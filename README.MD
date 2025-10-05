# My Project

This is a **full-stack application** built with **React (frontend)** and **Django (backend)**.  
It integrates **3 AI models** locally using [Ollama](https://ollama.com):  

- `llama3.2:1b`  
- `falcon3:1b`  
- `qwen2:1.5b`  

---

## Table of Contents

1. [Requirements](#requirements)  
2. [Setup Instructions](#setup-instructions)  
3. [Backend (Django)](#backend-django)  
4. [Frontend (React)](#frontend-react)  
5. [AI Models Setup (Ollama)](#ai-models-setup-ollama)  

---

## Requirements

- Python 3.10+  
- Node.js 18+ (or newer)  
- npm or yarn  
- [Ollama](https://ollama.com) installed locally to run AI models  

---

## Setup Instructions

### Backend (Django)

1. Navigate to the backend folder:

```bash
cd chat_bot/backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

# install dependencies 
pip install -r requirements.txt

# apply db migrations 
python manage.py migrate

# activate venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
python manage.py runserver


## set this envirement varriable in backend 
OLLAMA_HOST="http://localhost:11434/api/chat"


### frontend-react
cd chat_bot/front/chatbot_frontend


# install dependencies 

npm install
# or
yarn install


# run frontend app 
npm start
# or
yarn start

### ai-models-setup-ollama


# Verify Ollama installation
ollama --version

# Pull the required AI models locally
ollama pull llama3.2:1b
ollama pull falcon3:1b
ollama pull qwen2:1.5b