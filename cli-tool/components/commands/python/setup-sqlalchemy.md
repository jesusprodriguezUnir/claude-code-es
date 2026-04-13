# /setup-sqlalchemy

Configura SQLAlchemy 2.0 async con SQL Server (pyodbc/aioodbc), Alembic para migraciones y patrones de repositorio.

## Propósito

Genera la configuración completa de base de datos para un proyecto Python con SQL Server:
- `create_async_engine` con cadena de conexión SQL Server
- `async_sessionmaker` y dependencia FastAPI
- Clase base declarativa con auditoría
- Configuración de Alembic para migraciones async
- Patrón repository/unit-of-work base

## Uso

```
/setup-sqlalchemy [--servidor <host>] [--base-de-datos <nombre>] [--auth windows|sql]
```

**Ejemplos:**
```
/setup-sqlalchemy
/setup-sqlalchemy --servidor localhost --base-de-datos MiDB --auth windows
/setup-sqlalchemy --auth sql
```

## Implementación

1. **Verificar dependencias**:
   ```bash
   pip install sqlalchemy[asyncio] aioodbc pyodbc alembic
   ```

2. **Generar `src/db/session.py`**:
   ```python
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
   from src.core.config import settings
   
   _odbc_params = (
       f"Driver={{ODBC Driver 18 for SQL Server}};"
       f"Server={settings.DB_SERVER};"
       f"Database={settings.DB_DATABASE};"
   )
   # Auth Windows o SQL según la opción seleccionada
   
   engine = create_async_engine("mssql+aioodbc:///?odbc_connect=...", ...)
   AsyncSessionFactory = async_sessionmaker(engine, ...)
   
   async def get_db() -> AsyncIterator[AsyncSession]:
       async with AsyncSessionFactory() as session:
           try: yield session; await session.commit()
           except: await session.rollback(); raise
   ```

3. **Generar `src/db/models/base.py`**:
   ```python
   class Base(DeclarativeBase):
       pass
   
   class AuditoriaBase(Base):
       __abstract__ = True
       creado_en: Mapped[datetime] = mapped_column(default=func.now())
       actualizado_en: Mapped[datetime] = mapped_column(onupdate=func.now(), nullable=True)
       creado_por: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
   ```

4. **Configurar Alembic**:
   ```bash
   alembic init -t async alembic
   ```
   Generar `alembic/env.py` con soporte async y auto-detección de modelos

5. **Generar `src/repositories/base_repository.py`**:
   - `BaseRepository[T]` genérico con métodos: `obtener`, `listar`, `crear`, `actualizar`, `eliminar`

6. **Actualizar `.env.example`** con las variables necesarias

## Convenciones

- Nunca hardcodear credenciales: siempre variables de entorno via Pydantic `BaseSettings`
- `pool_pre_ping=True` siempre para detectar conexiones muertas
- `expire_on_commit=False` en el sessionmaker para acceso a objetos post-commit
- Siempre usar `mapped_column()` con tipo explícito en SQLAlchemy 2
