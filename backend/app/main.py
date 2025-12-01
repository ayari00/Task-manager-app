from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import redis
import json
import os

from fastapi.middleware.cors import CORSMiddleware

from app import models, schemas, database

app = FastAPI(title="Todo API avec FastAPI + PostgreSQL + Redis")

# ------------------------------
#  CORS FIX (required for frontend)
# ------------------------------

origins = [
    "http://localhost:3000",  # React dev mode
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # <-- allows OPTIONS automatically
    allow_headers=["*"],
)

# ------------------------------
# Database / Redis
# ------------------------------

models.Base.metadata.create_all(bind=database.engine)

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

# ------------------------------
# CRUD ENDPOINTS
# ------------------------------

@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    redis_client.delete("tasks")
    return db_task


@app.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(db: Session = Depends(database.get_db)):
    cached = redis_client.get("tasks")
    if cached:
        return json.loads(cached)

    tasks = db.query(models.Task).all()
    redis_client.setex(
        "tasks",
        60,
        json.dumps([{k: v for k, v in t.__dict__.items() if not k.startswith('_')} for t in tasks])
    )
    return tasks


@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(database.get_db)):
    cached = redis_client.get(f"task:{task_id}")
    if cached:
        return json.loads(cached)

    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    clean = {k: v for k, v in task.__dict__.items() if not k.startswith('_')}
    redis_client.setex(f"task:{task_id}", 60, json.dumps(clean))
    return task


@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task.model_dump().items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    redis_client.delete(f"task:{task_id}")
    redis_client.delete("tasks")
    return db_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(database.get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()

    redis_client.delete(f"task:{task_id}")
    redis_client.delete("tasks")

    return {"detail": "Task deleted"}

