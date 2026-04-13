# /setup-ci-github

Genera un workflow de GitHub Actions para el stack detectado con build, test y análisis de cobertura.

## Propósito

Crea el workflow de CI/CD adaptado al stack del proyecto:
- Build y pruebas automáticas en cada push/PR
- Análisis de cobertura de código
- Caché de dependencias para builds rápidos
- Soporte para branches `main` y `develop`

## Uso

```
/setup-ci-github [--stack angular|dotnet|python|auto] [--cobertura <porcentaje>]
```

**Ejemplos:**
```
/setup-ci-github
/setup-ci-github --stack dotnet --cobertura 80
/setup-ci-github --stack python --cobertura 75
```

## Implementación

1. **Detectar stack** (igual que `/dockerizar-app`)

2. **Generar `.github/workflows/ci.yml`**:

   **.NET Core**:
   ```yaml
   name: CI .NET
   
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   
   jobs:
     build-and-test:
       runs-on: ubuntu-latest
       
       services:
         sqlserver:
           image: mcr.microsoft.com/mssql/server:2022-latest
           env:
             SA_PASSWORD: ${{ secrets.SA_PASSWORD_TEST }}
             ACCEPT_EULA: 'Y'
           ports: ['1433:1433']
       
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-dotnet@v4
           with:
             dotnet-version: '8.x'
         - name: Restaurar dependencias
           run: dotnet restore
         - name: Compilar
           run: dotnet build --no-restore -c Release
         - name: Ejecutar pruebas con cobertura
           run: |
             dotnet test --no-build -c Release \
               --collect:"XPlat Code Coverage" \
               --results-directory ./coverage
         - name: Publicar cobertura
           uses: codecov/codecov-action@v4
           with:
             directory: ./coverage
   ```

   **Python FastAPI**:
   ```yaml
   name: CI Python
   
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   
   jobs:
     lint-and-test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with:
             python-version: '3.12'
             cache: 'pip'
         - name: Instalar dependencias
           run: pip install -r requirements.txt -r requirements-dev.txt
         - name: Linting con ruff
           run: ruff check . && ruff format --check .
         - name: Verificación de tipos
           run: mypy src/
         - name: Ejecutar pruebas
           run: pytest --cov=src --cov-report=xml --cov-fail-under=80
         - name: Publicar cobertura
           uses: codecov/codecov-action@v4
   ```

3. **Verificar que existan secrets necesarios** y listarlos en la salida

4. **Crear `README.md` badge de CI** si no existe

## Convenciones

- Siempre usar `actions/checkout@v4`, `setup-dotnet@v4`, `setup-python@v5` (versiones actuales)
- Caché de dependencias habilitado por defecto
- Cobertura mínima del 75% por defecto; configurable con `--cobertura`
- PR y push a `main`/`develop` siempre ejecutan el workflow
- Los secrets de base de datos deben configurarse en GitHub Secrets del repo
