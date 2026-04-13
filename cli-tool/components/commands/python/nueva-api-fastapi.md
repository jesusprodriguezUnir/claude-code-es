# /nueva-api-fastapi

Genera un router FastAPI completo para un recurso con modelos Pydantic, repositorio y pruebas.

## Propósito

Crea la estructura completa de un endpoint FastAPI:
- Router con operaciones CRUD (GET, POST, PUT, DELETE)
- Esquemas Pydantic v2 (Request y Response)
- Clase repository con SQLAlchemy 2 async
- Dependencias de autenticación (si se solicita)
- Tests con pytest + httpx AsyncClient

## Uso

```
/nueva-api-fastapi <recurso> [--operaciones get,post,put,delete] [--autenticacion]
```

**Ejemplos:**
```
/nueva-api-fastapi empleado
/nueva-api-fastapi producto --operaciones get,post
/nueva-api-fastapi pedido --autenticacion
```

## Implementación

1. **Detectar estructura**: Buscar `main.py`, `src/api/routers/`, `src/repositories/`

2. **Generar `src/api/routers/<recurso>s.py`**:
   ```python
   from fastapi import APIRouter, Depends, HTTPException, status, Query
   
   router = APIRouter(prefix="/<recurso>s", tags=["<Recurso>s"])
   
   @router.get("/", response_model=list[<Recurso>Response])
   async def listar_<recurso>s(...): ...
   
   @router.get("/{id}", response_model=<Recurso>Response)
   async def obtener_<recurso>(...): ...
   
   @router.post("/", response_model=<Recurso>Response, status_code=201)
   async def crear_<recurso>(...): ...
   ```

3. **Generar `src/schemas/<recurso>.py`**:
   - `<Recurso>Response` — campos de respuesta con `model_config = {'from_attributes': True}`
   - `Crear<Recurso>Request` — campos de creación con validaciones
   - `Actualizar<Recurso>Request` — todos los campos opcionales

4. **Generar `src/repositories/<recurso>_repository.py`**:
   - Clase `<Recurso>Repository` con métodos async
   - Paginación, filtros, crear, actualizar, eliminar

5. **Actualizar `src/main.py`**: Incluir el nuevo router

6. **Generar `tests/test_<recurso>s.py`**:
   - Fixture con cliente HTTP async
   - Tests para GET lista, GET por ID, POST exitoso, POST datos inválidos

## Convenciones

- Nombres de rutas en plural y snake_case: `/empleados`, `/pedidos_activos`
- Siempre usar `Optional[T]` con `None` por defecto en campos opcionales de Pydantic
- Manejar `404` con `HTTPException(status_code=404, detail="<Recurso> no encontrado")`
- Siempre `async def` para todos los endpoints
