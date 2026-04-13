# /setup-clean-architecture

Genera la estructura de solución .NET 8 con Clean Architecture, DI configurado y stack de librerías estándar.

## Propósito

Crea una solución .NET completa con la estructura de Clean Architecture:
- Proyectos separados: Domain, Application, Infrastructure, Api
- MediatR para CQRS
- FluentValidation con pipeline behavior
- Entity Framework Core + SQL Server
- Scalar para documentación de API
- xUnit + FluentAssertions para pruebas

## Uso

```
/setup-clean-architecture <NombreSolucion>
```

**Ejemplo:**
```
/setup-clean-architecture SistemaFacturacion
```

## Implementación

1. **Crear estructura de solución**:
   ```bash
   dotnet new sln -n <NombreSolucion>
   
   # Proyectos principales
   dotnet new classlib -n <NombreSolucion>.Domain
   dotnet new classlib -n <NombreSolucion>.Application
   dotnet new classlib -n <NombreSolucion>.Infrastructure
   dotnet new webapi -n <NombreSolucion>.Api --use-minimal-apis
   
   # Proyectos de prueba
   dotnet new xunit -n <NombreSolucion>.UnitTests
   dotnet new xunit -n <NombreSolucion>.IntegrationTests
   
   # Agregar a la solución
   dotnet sln add **/<NombreSolucion>.*/*.csproj
   
   # Referencias entre proyectos
   dotnet add <NombreSolucion>.Application reference <NombreSolucion>.Domain
   dotnet add <NombreSolucion>.Infrastructure reference <NombreSolucion>.Application
   dotnet add <NombreSolucion>.Api reference <NombreSolucion>.Application
   dotnet add <NombreSolucion>.Api reference <NombreSolucion>.Infrastructure
   dotnet add <NombreSolucion>.UnitTests reference <NombreSolucion>.Application
   dotnet add <NombreSolucion>.IntegrationTests reference <NombreSolucion>.Api
   ```

2. **Instalar paquetes NuGet**:
   ```bash
   # Application
   dotnet add <NombreSolucion>.Application package MediatR
   dotnet add <NombreSolucion>.Application package FluentValidation
   dotnet add <NombreSolucion>.Application package AutoMapper
   
   # Infrastructure
   dotnet add <NombreSolucion>.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
   dotnet add <NombreSolucion>.Infrastructure package Microsoft.EntityFrameworkCore.Tools
   
   # Api
   dotnet add <NombreSolucion>.Api package Scalar.AspNetCore
   
   # Tests
   dotnet add <NombreSolucion>.UnitTests package FluentAssertions
   dotnet add <NombreSolucion>.UnitTests package NSubstitute
   dotnet add <NombreSolucion>.IntegrationTests package Microsoft.AspNetCore.Mvc.Testing
   dotnet add <NombreSolucion>.IntegrationTests package FluentAssertions
   ```

3. **Generar archivos base**:
   - `Domain/Entities/EntityBase.cs` — entidad base con Id y auditoría
   - `Application/Interfaces/IRepository.cs` — contrato genérico
   - `Application/Behaviors/ValidationBehavior.cs` — pipeline de validación
   - `Infrastructure/Persistence/AppDbContext.cs` — DbContext configurado
   - `Api/Program.cs` — minimal con Scalar y DI completo

4. **Crear `.editorconfig`** con convenciones C#

5. **Mostrar árbol de la solución** generada

## Convenciones

- Todo el código en español en comentarios/documentación, inglés en nombres técnicos
- `Program.cs` organizado en secciones con comentarios: `// --- Servicios ---`, `// --- Middleware ---`
- Habilitar nullable reference types en todos los proyectos
- Usar `global using` en cada proyecto con los namespaces más comunes
