# /agregar-migracion

Crea una migración de Entity Framework Core con validaciones previas y documentación.

## Propósito

Genera una nueva migración de EF Core de forma segura:
- Verifica estado del contexto y migraciones pendientes
- Crea la migración con nombre descriptivo
- Genera script SQL para revisión previa al despliegue
- Documenta los cambios en un comentario de cabecera

## Uso

```
/agregar-migracion <NombreMigracion> [--contexto <DbContext>] [--proyecto <ruta>]
```

**Ejemplos:**
```
/agregar-migracion AgregarTablaEmpleados
/agregar-migracion AgregarIndiceEmailClientes
/agregar-migracion AgregarColumnaFechaArchivoProducto --contexto CatalogoDbContext
```

## Implementación

1. **Verificar estado previo**:
   ```bash
   dotnet ef migrations list
   ```
   Si hay migraciones pendientes sin aplicar, advertir al usuario.

2. **Revisar cambios en el modelo**: Leer los archivos `*.cs` en `Infrastructure/Persistence/` para identificar qué cambios se van a migrar

3. **Crear la migración**:
   ```bash
   dotnet ef migrations add <NombreMigracion>
   ```

4. **Generar script SQL de validación**:
   ```bash
   dotnet ef migrations script <MigracionAnterior> <NuevaMigracion> --output migrations/<NombreMigracion>.sql
   ```

5. **Agregar cabecera de documentación** al archivo de migración generado:
   ```csharp
   // ============================================================
   // Migración: <NombreMigracion>
   // Fecha: <fecha actual>
   // Descripción: <descripción de los cambios>
   // Impacto: <tablas/columnas afectadas>
   // Rollback: Ejecutar la migración inversa con dotnet ef migrations down
   // ============================================================
   ```

6. **Mostrar resumen**: Archivos generados, tablas/columnas afectadas, instrucciones de aplicación

## Convenciones

- Nombres en PascalCase describiendo la acción: `AgregarTablaX`, `ModificarColumnaY`, `EliminarIndiceZ`
- Siempre revisar el SQL generado antes de aplicar en producción
- Guardar scripts SQL en `migrations/scripts/` para historial
- Si la migración elimina datos, generar script de backup primero
