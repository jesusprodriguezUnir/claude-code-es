# /auditoria-esquema

Escanea el esquema SQL Server para detectar problemas de diseño, nomenclatura y rendimiento.

## Propósito

Audita el esquema de la base de datos conectada y genera un informe de:
- Tablas sin clave primaria
- Claves foráneas sin índice (causa de table scans en JOINs)
- Columnas `NVARCHAR(MAX)` / `VARCHAR(MAX)` en columnas de filtro
- Tablas con nombres inconsistentes (mezcla de idiomas, espacios, etc.)
- Columnas nullable que deberían ser NOT NULL
- Índices duplicados o redundantes
- Procedimientos almacenados sin SET NOCOUNT ON
- Columnas de auditoría faltantes (creado_en, actualizado_en)

## Uso

```
/auditoria-esquema [--base-de-datos <nombre>] [--esquema <esquema>]
```

**Ejemplos:**
```
/auditoria-esquema
/auditoria-esquema --base-de-datos MiBaseDeDatos
/auditoria-esquema --esquema dbo
```

## Implementación

1. **Generar script de auditoría** (el usuario lo ejecuta en SSMS o sqlcmd):

   ```sql
   -- ============================================================
   -- AUDITORÍA DE ESQUEMA
   -- Base de datos: <nombre>
   -- Fecha: <fecha>
   -- ============================================================
   
   PRINT '=== TABLAS SIN CLAVE PRIMARIA ===';
   SELECT t.name AS tabla
   FROM sys.tables t
   WHERE NOT EXISTS (
       SELECT 1 FROM sys.indexes i
       WHERE i.object_id = t.object_id AND i.is_primary_key = 1
   );
   
   PRINT '=== CLAVES FORÁNEAS SIN ÍNDICE ===';
   SELECT
       OBJECT_NAME(fk.parent_object_id)  AS tabla,
       COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS columna
   FROM sys.foreign_keys fk
   INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
   WHERE NOT EXISTS (
       SELECT 1 FROM sys.index_columns ic
       WHERE ic.object_id = fkc.parent_object_id
         AND ic.column_id = fkc.parent_column_id
         AND ic.index_column_id = 1
   );
   
   -- ... más checks
   ```

2. **Interpretar resultados** del usuario (pega los resultados del script)

3. **Generar informe priorizado**:
   ```
   🔍 Auditoría de Esquema — MiBaseDeDatos
   ════════════════════════════════════════

   🚨 Críticos (requieren acción inmediata):
   ├── pedidos_lineas: Sin clave primaria
   ├── FK pedidos.cliente_id → clientes.id: Sin índice (impacto en todos los JOINs)
   └── productos.descripcion_larga: NVARCHAR(MAX) usado en WHERE frecuente

   ⚠️ Advertencias:
   ├── 3 tablas sin columnas de auditoría (creado_en, actualizado_en)
   ├── Nomenclatura inconsistente: tblClientes, Empleados, t_productos
   └── 2 índices redundantes detectados

   📋 Scripts de corrección generados:
   1. ALTER TABLE pedidos_lineas ADD pk_id INT IDENTITY PRIMARY KEY;
   2. CREATE INDEX IX_Pedidos_ClienteId ON pedidos (cliente_id);
   3. ...
   ```

## Convenciones

- Siempre generar el script de diagnóstico primero para que el usuario lo ejecute
- No ejecutar DDL directamente sin revisión del usuario
- Ordenar issues por impacto en rendimiento primero
- Incluir scripts de corrección para cada issue con impacto
