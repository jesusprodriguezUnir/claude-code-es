# /crear-procedimiento

Genera un procedimiento almacenado SQL Server robusto con manejo de errores, transacciones y script de prueba.

## Propósito

Crea procedimientos almacenados T-SQL siguiendo buenas prácticas:
- `SET NOCOUNT ON` y `SET XACT_ABORT ON`
- `TRY/CATCH` con rollback automático
- Validaciones de negocio con `THROW`
- Parámetros tipados explícitamente
- Comentario de cabecera con descripción, parámetros y ejemplos
- Script de prueba `EXEC` al final

## Uso

```
/crear-procedimiento <nombre> [--operacion select|insert|update|delete|proceso]
```

**Ejemplos:**
```
/crear-procedimiento usp_ObtenerEmpleadosPorDepartamento --operacion select
/crear-procedimiento usp_CrearPedido --operacion proceso
/crear-procedimiento usp_ActualizarSalarioMasivo --operacion update
```

## Implementación

1. **Recopilar información**: Preguntar al usuario sobre las tablas involucradas y la lógica de negocio

2. **Generar el procedimiento con cabecera**:
   ```sql
   -- ============================================================
   -- Procedimiento: dbo.<nombre>
   -- Descripción  : [descripción de lo que hace]
   -- Parámetros   :
   --   @Param1  : descripción
   --   @Param2  : descripción
   -- Retorna      : [filas / OUTPUT params / código de retorno]
   -- Creado       : <fecha>
   -- Modificado   : <fecha> — <descripción del cambio>
   -- ============================================================
   CREATE OR ALTER PROCEDURE dbo.<nombre>
       @Param1  TIPO1,
       @Param2  TIPO2 = valor_defecto,
       @Result  INT OUTPUT
   AS
   BEGIN
       SET NOCOUNT ON;
       SET XACT_ABORT ON;
       
       BEGIN TRY
           BEGIN TRANSACTION;
           
           -- Validaciones
           -- Lógica principal
           
           COMMIT TRANSACTION;
       END TRY
       BEGIN CATCH
           IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
           THROW;
       END CATCH
   END;
   GO
   ```

3. **Generar script de prueba**:
   ```sql
   -- ============================================================
   -- Prueba: dbo.<nombre>
   -- ============================================================
   DECLARE @Result INT;
   
   -- Caso 1: Happy path
   EXEC dbo.<nombre> @Param1 = valor1, @Param2 = valor2, @Result = @Result OUTPUT;
   SELECT @Result AS Resultado;
   
   -- Caso 2: Error esperado
   BEGIN TRY
       EXEC dbo.<nombre> @Param1 = NULL, @Result = @Result OUTPUT;
   END TRY
   BEGIN CATCH
       PRINT 'Error esperado: ' + ERROR_MESSAGE();
   END CATCH
   ```

## Convenciones

- Prefijo `usp_` para procedimientos de usuario
- Nombre en PascalCase descriptivo: `usp_CrearEmpleado`, `usp_ObtenerPedidosPorFecha`
- Parámetros con `@` y PascalCase
- Siempre `CREATE OR ALTER` (SQL Server 2016+) en lugar de DROP + CREATE
- Incluir `WITH RECOMPILE` si los parámetros generan parameter sniffing
