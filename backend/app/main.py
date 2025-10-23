from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector
from mysql.connector import Error
import os
import time

app = FastAPI(title="API de Canciones Favoritas - Hugo Francisco Luis Inclán")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://54.88.82.65:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'database-luis'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'hugo_user'),
    'password': os.getenv('DB_PASSWORD', 'HugoSecurePass2024!'),
    'database': os.getenv('DB_NAME', 'hugo_francisco_luis_inclan_db')
}

# Modelos Pydantic
class Cancion(BaseModel):
    nombre: str
    artista: str
    album: Optional[str] = None
    url: str
    genero: Optional[str] = None
    anio: Optional[int] = None

class CancionResponse(Cancion):
    id: int

# Función para obtener conexión a la base de datos con reintentos
def get_db_connection():
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            connection = mysql.connector.connect(**DB_CONFIG)
            if connection.is_connected():
                return connection
        except Error as e:
            if attempt < max_retries - 1:
                print(f"Intento {attempt + 1} fallido. Reintentando en {retry_delay} segundos...")
                time.sleep(retry_delay)
            else:
                raise HTTPException(status_code=500, detail=f"Error de conexión a la base de datos: {str(e)}")

# Endpoint con apellido que retorna nombre completo
@app.get("/inclan")
def get_nombre_completo():
    return {
        "mensaje": "Bienvenido a la API de Canciones Favoritas",
        "nombre_completo": "Hugo Francisco Luis Inclán",
        "autor": "Hugo Francisco Luis Inclán"
    }

@app.get("/")
def root():
    return {
        "mensaje": "API de Canciones Favoritas",
        "autor": "Hugo Francisco Luis Inclán",
        "endpoints": [
            "/inclan - Obtener nombre completo",
            "/canciones - Listar todas las canciones",
            "/canciones/{id} - Obtener una canción específica",
            "POST /canciones - Agregar una canción",
            "PUT /canciones/{id} - Actualizar una canción",
            "DELETE /canciones/{id} - Eliminar una canción"
        ]
    }

@app.get("/canciones", response_model=List[CancionResponse])
def listar_canciones():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM canciones ORDER BY id DESC")
        canciones = cursor.fetchall()
        cursor.close()
        connection.close()
        return canciones
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener canciones: {str(e)}")

@app.get("/canciones/{cancion_id}", response_model=CancionResponse)
def obtener_cancion(cancion_id: int):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM canciones WHERE id = %s", (cancion_id,))
        cancion = cursor.fetchone()
        cursor.close()
        connection.close()
        
        if not cancion:
            raise HTTPException(status_code=404, detail="Canción no encontrada")
        
        return cancion
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la canción: {str(e)}")

@app.post("/canciones", response_model=CancionResponse, status_code=201)
def crear_cancion(cancion: Cancion):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        INSERT INTO canciones (nombre, artista, album, url, genero, anio)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        valores = (cancion.nombre, cancion.artista, cancion.album, 
                  cancion.url, cancion.genero, cancion.anio)
        
        cursor.execute(query, valores)
        connection.commit()
        
        cancion_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return {**cancion.dict(), "id": cancion_id}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la canción: {str(e)}")

@app.put("/canciones/{cancion_id}", response_model=CancionResponse)
def actualizar_cancion(cancion_id: int, cancion: Cancion):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        UPDATE canciones 
        SET nombre = %s, artista = %s, album = %s, url = %s, genero = %s, anio = %s
        WHERE id = %s
        """
        valores = (cancion.nombre, cancion.artista, cancion.album, 
                  cancion.url, cancion.genero, cancion.anio, cancion_id)
        
        cursor.execute(query, valores)
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Canción no encontrada")
        
        cursor.close()
        connection.close()
        
        return {**cancion.dict(), "id": cancion_id}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar la canción: {str(e)}")

@app.delete("/canciones/{cancion_id}")
def eliminar_cancion(cancion_id: int):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("DELETE FROM canciones WHERE id = %s", (cancion_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Canción no encontrada")
        
        cursor.close()
        connection.close()
        
        return {"mensaje": "Canción eliminada exitosamente", "id": cancion_id}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar la canción: {str(e)}")

@app.get("/health")
def health_check():
    try:
        connection = get_db_connection()
        if connection.is_connected():
            connection.close()
            return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}