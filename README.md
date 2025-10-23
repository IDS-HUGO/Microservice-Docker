# 🎵 Sistema de Gestión de Canciones Favoritas

**Autor:** Hugo Francisco Luis Inclán  
**Arquitectura:** Microservicios con Docker Compose  
**Stack:** React + FastAPI + MySQL

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso del Sistema](#uso-del-sistema)
- [Endpoints de la API](#endpoints-de-la-api)
- [Diagrama de Arquitectura](#diagrama-de-arquitectura)
- [Pruebas y Verificación](#pruebas-y-verificación)
- [Despliegue en AWS EC2](#despliegue-en-aws-ec2)
- [Solución de Problemas](#solución-de-problemas)

---

## 📖 Descripción del Proyecto

Sistema completo de microservicios para gestionar canciones favoritas, implementando operaciones CRUD (Crear, Leer, Actualizar, Eliminar) con persistencia de datos y comunicación entre contenedores.

### Características Principales

✅ **Frontend en React** - Interfaz moderna y responsive  
✅ **Backend en FastAPI** - API REST con validación de datos  
✅ **Base de Datos MySQL** - Persistencia con volúmenes Docker  
✅ **Comunicación entre contenedores** - Red interna personalizada  
✅ **Persistencia de datos** - Volúmenes explícitos  
✅ **Dockerfiles personalizados** - Sin imágenes preconstruidas para frontend/backend

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Navegador)                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP :3000
                            ▼
┌─────────────────────────────────────────────────────────────┐
│             CONTENEDOR: frontend-hugo-inclan                 │
│                      (React App)                             │
│  - Puerto: 3000                                              │
│  - Tecnología: React 18                                      │
│  - Servidor: Node serve                                      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP :8000
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          CONTENEDOR: backend-francisco-inclan                │
│                    (FastAPI Server)                          │
│  - Puerto: 8000                                              │
│  - Tecnología: Python 3.11 + FastAPI                         │
│  - Endpoints: /canciones, /inclan                            │
└───────────────────────────┬─────────────────────────────────┘
                            │ MySQL :3306
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           CONTENEDOR: database-luis-inclan                   │
│                     (MySQL 8.0)                              │
│  - Puerto: 3306                                              │
│  - Base de datos: hugo_francisco_luis_inclan_db              │
│  - Volumen: datos-inclan (persistente)                       │
└─────────────────────────────────────────────────────────────┘

Red Interna: red-inclan (bridge)
```

---

## ⚙️ Requisitos Previos

### Para desarrollo local:
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Docker Compose v2.0+
- Git
- Editor de código (VS Code recomendado)

### Para despliegue en AWS EC2:
- Cuenta de AWS
- Instancia EC2 Ubuntu 22.04 LTS
- Security Group configurado (puertos 3000, 8000, 3306)

### Verificar instalación:
```bash
docker --version
docker-compose --version
git --version
```

---

## 📁 Estructura del Proyecto

```
proyecto-hugo-inclan/
├── docker-compose.yml          # Orquestación de contenedores
├── .env                        # Variables de entorno
├── README.md                   # Este archivo
│
├── frontend/                   # Aplicación React
│   ├── Dockerfile             # Imagen personalizada
│   ├── package.json           # Dependencias Node
│   ├── public/
│   │   └── index.html         # HTML principal
│   └── src/
│       ├── index.js           # Entry point
│       ├── App.js             # Componente principal
│       └── App.css            # Estilos
│
├── backend/                    # API FastAPI
│   ├── Dockerfile             # Imagen personalizada
│   ├── requirements.txt       # Dependencias Python
│   └── app/
│       ├── __init__.py
│       └── main.py            # Lógica de la API
│
└── database/                   # Base de datos
    └── init.sql               # Script de inicialización
```

---

## 🚀 Instalación y Configuración

### Paso 1: Clonar o crear el proyecto

Si ya tienes la estructura de carpetas, continúa. Si no:

```bash
# Crear estructura de directorios
mkdir proyecto-hugo-inclan
cd proyecto-hugo-inclan
mkdir -p frontend/src frontend/public backend/app database
```

### Paso 2: Copiar todos los archivos

Copia todos los archivos proporcionados en esta guía a sus respectivas ubicaciones.

### Paso 3: Construir y levantar los contenedores

```bash
# Construir todas las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### Paso 4: Verificar que todo funciona

```bash
# Ver estado de contenedores
docker-compose ps

# Verificar logs individuales
docker-compose logs frontend-hugo
docker-compose logs backend-francisco
docker-compose logs database-luis
```

---

## 💻 Uso del Sistema

### Acceder a la aplicación

1. **Frontend:** http://localhost:3000
2. **API Backend:** http://localhost:8000
3. **Documentación API:** http://localhost:8000/docs

### Operaciones disponibles

#### ➕ Agregar Canción
1. Click en "Agregar Canción"
2. Llenar formulario con:
   - Nombre de la canción (requerido)
   - Artista (requerido)
   - Álbum (opcional)
   - URL (requerido)
   - Género (opcional)
   - Año (opcional)
3. Click en "Guardar"

#### ✏️ Editar Canción
1. Click en el ícono de editar (lápiz)
2. Modificar campos deseados
3. Click en "Actualizar"

#### 🗑️ Eliminar Canción
1. Click en el ícono de eliminar (basura)
2. Confirmar eliminación

#### 🔗 Escuchar Canción
1. Click en "Escuchar" para abrir URL en nueva pestaña

---

## 🔌 Endpoints de la API

### Endpoint con apellido (requisito del proyecto)
```http
GET /inclan
```
**Respuesta:**
```json
{
  "mensaje": "Bienvenido a la API de Canciones Favoritas",
  "nombre_completo": "Hugo Francisco Luis Inclán",
  "autor": "Hugo Francisco Luis Inclán"
}
```

### Listar todas las canciones
```http
GET /canciones
```

### Obtener una canción específica
```http
GET /canciones/{id}
```

### Crear nueva canción
```http
POST /canciones
Content-Type: application/json

{
  "nombre": "Bohemian Rhapsody",
  "artista": "Queen",
  "album": "A Night at the Opera",
  "url": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  "genero": "Rock",
  "anio": 1975
}
```

### Actualizar canción
```http
PUT /canciones/{id}
Content-Type: application/json

{
  "nombre": "Bohemian Rhapsody - Remastered",
  "artista": "Queen",
  "album": "A Night at the Opera",
  "url": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  "genero": "Rock",
  "anio": 1975
}
```

### Eliminar canción
```http
DELETE /canciones/{id}
```

### Health Check
```http
GET /health
```

---

## 📊 Diagrama de Arquitectura

### Diagrama de Flujo de Datos

```
1. Usuario accede → localhost:3000
   ↓
2. Frontend React carga
   ↓
3. React hace fetch → http://localhost:8000/canciones
   ↓
4. FastAPI recibe request
   ↓
5. FastAPI conecta → MySQL (database-luis:3306)
   ↓
6. MySQL ejecuta query → SELECT * FROM canciones
   ↓
7. MySQL retorna datos → FastAPI
   ↓
8. FastAPI serializa JSON → React
   ↓
9. React renderiza UI → Usuario
```

### Comunicación entre Contenedores

```
frontend-hugo-inclan
  ├── Se comunica con: backend-francisco-inclan
  └── A través de: red-inclan (nombre DNS interno)

backend-francisco-inclan
  ├── Se comunica con: database-luis-inclan
  └── A través de: red-inclan (nombre DNS interno)

database-luis-inclan
  └── Almacena datos en: volumen datos-inclan
```

---

## ✅ Pruebas y Verificación

### 1. Probar persistencia de datos

```bash
# Agregar una canción desde el frontend

# Detener contenedores
docker-compose down

# Levantar nuevamente
docker-compose up -d

# Verificar que la canción sigue ahí (en localhost:3000)
```

### 2. Probar comunicación entre contenedores

```bash
# Entrar al contenedor frontend
docker exec -it frontend-hugo-inclan sh

# Hacer ping al backend (debe funcionar)
ping backend-francisco

# Salir
exit
```

### 3. Verificar base de datos directamente

```bash
# Conectar a MySQL
docker exec -it database-luis-inclan mysql -uhug o_user -pHugoSecurePass2024! hugo_francisco_luis_inclan_db

# Ver canciones
SELECT * FROM canciones;

# Salir
exit
```

### 4. Probar endpoints de la API

```bash
# Endpoint con apellido (requisito)
curl http://localhost:8000/inclan

# Listar canciones
curl http://localhost:8000/canciones

# Health check
curl http://localhost:8000/health
```

---

## ☁️ Despliegue en AWS EC2

### Paso 1: Crear instancia EC2

1. Acceder a AWS Console
2. EC2 → Launch Instance
3. Seleccionar **Ubuntu Server 22.04 LTS**
4. Instance type: **t2.medium** (mínimo)
5. Configure Security Group:
   - SSH (22) - Tu IP
   - HTTP (80) - 0.0.0.0/0
   - Custom TCP (3000) - 0.0.0.0/0
   - Custom TCP (8000) - 0.0.0.0/0
6. Launch y descargar key pair

### Paso 2: Conectar a la instancia

```bash
chmod 400 tu-llave.pem
ssh -i "tu-llave.pem" ubuntu@tu-ip-publica
```

### Paso 3: Instalar Docker

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Cerrar sesión y volver a conectar
exit
ssh -i "tu-llave.pem" ubuntu@tu-ip-publica
```

### Paso 4: Clonar proyecto

```bash
# Opción 1: Desde GitHub (recomendado)
git clone https://github.com/tu-usuario/proyecto-hugo-inclan.git
cd proyecto-hugo-inclan

# Opción 2: Subir archivos manualmente con SCP
# En tu máquina local:
scp -i "tu-llave.pem" -r proyecto-hugo-inclan ubuntu@tu-ip-publica:~/
```

### Paso 5: Modificar configuración para producción

```bash
# Editar docker-compose.yml
nano docker-compose.yml

# Cambiar en la sección frontend:
environment:
  - REACT_APP_API_URL=http://TU_IP_PUBLICA:8000
```

### Paso 6: Levantar servicios

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f
```

### Paso 7: Acceder a la aplicación

- Frontend: http://TU_IP_PUBLICA:3000
- API: http://TU_IP_PUBLICA:8000

---

## 🔧 Solución de Problemas

### Problema: Contenedores no se comunican

```bash
# Verificar red
docker network ls
docker network inspect red-inclan

# Reiniciar red
docker-compose down
docker network prune
docker-compose up -d
```

### Problema: Base de datos no se inicializa

```bash
# Ver logs
docker-compose logs database-luis

# Eliminar volumen y recrear
docker-compose down -v
docker-compose up -d
```

### Problema: Frontend no conecta con backend

```bash
# Verificar variable de entorno
docker exec frontend-hugo-inclan env | grep REACT_APP

# Reconstruir frontend
docker-compose build frontend-hugo
docker-compose up -d frontend-hugo
```

### Problema: Puerto ya en uso

```bash
# Ver qué usa el puerto
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :3306

# Matar proceso
kill -9 PID

# O cambiar puertos en docker-compose.yml
```

### Comandos útiles

```bash
# Ver todos los contenedores
docker ps -a

# Ver logs de un servicio
docker-compose logs -f [servicio]

# Reiniciar un servicio
docker-compose restart [servicio]

# Reconstruir todo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Limpiar todo Docker
docker system prune -a --volumes
```

---

## 📦 Comandos Rápidos

```bash
# Levantar todo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener todo
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir
docker-compose build --no-cache

# Estado de servicios
docker-compose ps

# Entrar a un contenedor
docker exec -it [nombre-contenedor] bash
```

---

## 📝 Notas Importantes

1. **Nombres personalizados:** Todos los contenedores incluyen partes del nombre "Hugo Francisco Luis Inclán" según requisitos del proyecto.

2. **Base de datos:** Se llama `hugo_francisco_luis_inclan_db` según especificaciones.

3. **Endpoint con apellido:** `/inclan` retorna el nombre completo como se requirió.

4. **Volúmenes explícitos:** `datos-inclan` está definido explícitamente en docker-compose.yml.

5. **Dockerfiles personalizados:** Frontend y backend tienen sus propios Dockerfiles, no usan imágenes preconstruidas.

6. **Persistencia:** Los datos se mantienen incluso después de `docker-compose down`.

---

## 👨‍💻 Información del Autor

**Nombre:** Hugo Francisco Luis Inclán  
**Proyecto:** Sistema de Gestión de Canciones Favoritas  
**Tecnologías:** Docker, React, FastAPI, MySQL  
**Repositorio GitHub:** [URL del repositorio]

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de una actividad académica.

---

**¡Proyecto completado con éxito! 🎉**