# /nueva-api-minimal

Genera un endpoint de Minimal API ASP.NET Core 8+ con validación, manejo de errores y prueba de integración.

## Propósito

Crea un grupo de endpoints Minimal API completo para un recurso dado:
- Clase estática con métodos de extensión (`MapXxx`)
- Validación con FluentValidation
- Respuestas tipadas con `IResult`
- Manejo de errores con Problem Details (RFC 7807)
- Prueba de integración con `WebApplicationFactory`
- Documentación OpenAPI con `WithOpenApi()`

## Uso

```
/nueva-api-minimal <Recurso> [--operaciones get,post,put,delete] [--autenticacion]
```

**Ejemplos:**
```
/nueva-api-minimal Empleado
/nueva-api-minimal Producto --operaciones get,post
/nueva-api-minimal Pedido --autenticacion
```

## Implementación

1. **Detectar estructura del proyecto**: Buscar `Program.cs` y la arquitectura existente (Clean Architecture, carpeta `Endpoints/`, etc.)

2. **Generar `<Recurso>Endpoints.cs`**:
   ```csharp
   public static class <Recurso>Endpoints
   {
       public static IEndpointRouteBuilder Map<Recurso>s(this IEndpointRouteBuilder app)
       {
           var grupo = app.MapGroup("/api/<recurso>s")
               .WithTags("<Recurso>s")
               .WithOpenApi();
           
           // GET, POST, PUT, DELETE según operaciones solicitadas
           return app;
       }
   }
   ```

3. **Generar DTOs** (`<Recurso>Dto.cs`): Records para Request y Response

4. **Generar validador** (`<Recurso>Validator.cs`): FluentValidation con reglas básicas

5. **Actualizar `Program.cs`**: Agregar `app.Map<Recurso>s()` en la sección de endpoints

6. **Generar prueba de integración** (`<Recurso>EndpointsTests.cs`):
   - Clase que hereda de `IClassFixture<WebApplicationFactory<Program>>`
   - Tests para escenarios happy path y error 400

## Convenciones

- Agrupar todos los endpoints del recurso en una sola clase estática
- Usar `[AsParameters]` para query parameters complejos
- Siempre incluir `WithName()` para poder generar URLs tipadas
- Nombre de ruta en plural y kebab-case: `/api/empleados`, `/api/pedidos-activos`
- Retornar `Results.CreatedAtRoute()` en POST con la URL del recurso creado
