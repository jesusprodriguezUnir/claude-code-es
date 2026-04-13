# /dockerizar-app

Detecta el stack del proyecto y genera Dockerfile multi-stage optimizado + docker-compose con SQL Server.

## Propósito

Genera la configuración Docker completa adaptada al stack detectado:
- Dockerfile multi-stage optimizado para producción
- `docker-compose.yml` para desarrollo local con SQL Server 2022
- Variables de entorno en `.env.docker`
- `.dockerignore` para excluir archivos innecesarios

## Uso

```
/dockerizar-app [--stack angular|dotnet|python|auto] [--con-sqlserver]
```

**Ejemplos:**
```
/dockerizar-app
/dockerizar-app --stack dotnet --con-sqlserver
/dockerizar-app --stack python --con-sqlserver
```

## Implementación

1. **Detectar stack automáticamente**:
   - Buscar `angular.json` → Angular
   - Buscar `*.csproj` → .NET
   - Buscar `pyproject.toml` / `requirements.txt` → Python

2. **Generar `Dockerfile`** según el stack:

   **.NET Core**:
   ```dockerfile
   # Build stage
   FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
   WORKDIR /src
   COPY ["MiApp.Api/MiApp.Api.csproj", "MiApp.Api/"]
   RUN dotnet restore
   COPY . .
   RUN dotnet publish -c Release -o /app/publish
   
   # Runtime stage
   FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
   WORKDIR /app
   COPY --from=build /app/publish .
   EXPOSE 8080
   ENTRYPOINT ["dotnet", "MiApp.Api.dll"]
   ```

   **Python FastAPI**:
   ```dockerfile
   FROM python:3.12-slim AS base
   RUN apt-get update && apt-get install -y --no-install-recommends \
       unixodbc-dev libodbc2 && rm -rf /var/lib/apt/lists/*
   WORKDIR /app
   
   FROM base AS deps
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   FROM base AS final
   COPY --from=deps /usr/local/lib/python3.12 /usr/local/lib/python3.12
   COPY src/ ./src/
   EXPOSE 8000
   CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Generar `docker-compose.yml`** con SQL Server:
   ```yaml
   services:
     app:
       build: .
       ports: ["8080:8080"]
       environment:
         - ConnectionStrings__Default=Server=sqlserver;...
       depends_on:
         sqlserver:
           condition: service_healthy
     
     sqlserver:
       image: mcr.microsoft.com/mssql/server:2022-latest
       environment:
         - SA_PASSWORD=${SA_PASSWORD}
         - ACCEPT_EULA=Y
       ports: ["1433:1433"]
       volumes: ["sqlserver_data:/var/opt/mssql"]
       healthcheck:
         test: ["/opt/mssql-tools/bin/sqlcmd", "-S", "localhost", "-U", "sa", "-P", "${SA_PASSWORD}", "-Q", "SELECT 1"]
         interval: 10s
         retries: 5
   
   volumes:
     sqlserver_data:
   ```

4. **Generar `.dockerignore`** apropiado para el stack

## Convenciones

- Siempre usar multi-stage builds para reducir el tamaño de la imagen
- SQL Server `SA_PASSWORD` siempre en variables de entorno, nunca hardcodeada
- Incluir `HEALTHCHECK` en el contenedor de SQL Server
- La imagen de producción debe ejecutarse como usuario no-root
