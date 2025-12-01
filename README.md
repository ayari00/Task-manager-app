# 📝 Task Manager App

Task Manager App est une application full-stack moderne permettant de créer, gérer et organiser des tâches.  
Elle repose sur un backend rapide en **FastAPI**, un frontend en **React + Tailwind CSS**, et une architecture robuste basée sur **PostgreSQL**, **Redis** et **Docker Compose**.

---

## 🚀 Fonctionnalités

- ✅ CRUD complet (Créer, Lire, Mettre à jour, Supprimer des tâches)
- ✅ Stockage persistant avec PostgreSQL
- ✅ Cache haute performance (Redis TTL = 60s)
- ✅ UI moderne, responsive et simple à utiliser
- ✅ API documentée automatiquement (Swagger)
- ✅ Architecture conteneurisée (Docker) compatible Windows/WSL2, macOS & Linux

---

## 🛠️ Stack Technique

### **Backend**
- FastAPI (Python)
- Uvicorn
- SQLAlchemy
- Pydantic

### **Base de données**
- PostgreSQL 15  
- Volume Docker persistant

### **Cache**
- Redis 7  
- TTL des tâches : **60 secondes**

### **Frontend**
- React 18
- Vite
- Tailwind CSS

### **DevOps / Orchestration**
- Docker
- Docker Compose
- WSL2 (pour Windows)

---

## 📂 Architecture du projet
```
task-manager-app/
│── backend/
│ ├── app/
│ ├── requirements.txt
│ └── Dockerfile
│
│── frontend/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
│
│── docker-compose.yml
│── README.md
````

## 📦 Prérequis

Assure-toi d’avoir :

- **Docker Engine ≥ 24**
- **Docker Compose**
- (Windows) **WSL2 + Docker Desktop configuré pour WSL**

Vérification :

```
docker --version
docker compose version
```

# 🚀 Installation & Lancement
## 1️⃣ Cloner le projet
```
git clone https://github.com/votre-username/task-manager-app.git
cd task-manager-app
```
## 2️⃣ Lancer l’application (tous les services)
```
docker compose up --build
```
### 🌐 Accès aux services
```
Backend API	http://localhost:8000
Swagger (docs)	http://localhost:8000/docs
Frontend	http://localhost:5173
```
### ⚙️ Variables d’environnement (gérées via Docker)
Backend
```
POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tasks
REDIS_HOST=redis
REDIS_PORT=6379
CACHE_TTL=60
```
# 📚 Endpoints API (FastAPI)

| Méthode | Route         | Description             |
| ------- | ------------- | ----------------------- |
| GET     | `/tasks`      | Liste toutes les tâches |
| GET     | `/tasks/{id}` | Récupère une tâche      |
| POST    | `/tasks`      | Crée une tâche          |
| PUT     | `/tasks/{id}` | Met à jour une tâche    |
| DELETE  | `/tasks/{id}` | Supprime une tâche      |

Documentation interactive (Swagger) :
👉 http://localhost:8000/docs

🧰 Commandes utiles
* / Arrêter les containers :
```
docker compose down
````
* / Arrêter + supprimer les volumes (⚠️ supprime la DB) :
```
docker compose down -v
````

