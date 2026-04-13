# /optimizar-query

Analiza una consulta T-SQL y propone optimizaciones con índices, reescritura y análisis del plan de ejecución.

## Propósito

Optimiza consultas SQL Server lentas:
- Identificar operaciones costosas (table scan, key lookup)
- Detectar patrones no-sargable
- Proponer índices faltantes
- Reescribir con CTEs o window functions cuando mejora rendimiento
- Estimar el impacto de cada optimización

## Uso

```
/optimizar-query
```

Después de invocar el comando, pega la consulta a analizar. Claude pedirá también:
- El plan de ejecución si está disponible (XML de SSMS)
- Las estadísticas de IO (`SET STATISTICS IO ON`)
- El volumen aproximado de datos de las tablas involucradas

## Implementación

1. **Recibir la consulta** del usuario

2. **Análisis estático de la consulta**:
   - Buscar funciones en columnas indexadas (no-sargable)
   - Buscar conversiones implícitas de tipos
   - Verificar uso de comodines al inicio en LIKE
   - Detectar `SELECT *`
   - Identificar subconsultas correlacionadas

3. **Analizar el plan de ejecución** (si se proporciona):
   - Operadores con mayor costo relativo
   - Missing Index hints del optimizador
   - Tipo de JOIN: Nested Loops vs Hash Match vs Merge Join
   - Estimaciones vs filas reales (divergencia = estadísticas desactualizadas)

4. **Proponer optimizaciones priorizadas**:

   ```
   📊 Análisis de Consulta
   ════════════════════════
   Consulta: SELECT * FROM pedidos p JOIN clientes c ON p.cliente_id = c.id
             WHERE YEAR(p.fecha) = 2024 AND c.activo = 1
   
   🚨 Problemas críticos:
   ├── YEAR(p.fecha) es no-sargable → no puede usar índice en fecha
   │   Solución: WHERE p.fecha >= '2024-01-01' AND p.fecha < '2025-01-01'
   │   Impacto estimado: de Table Scan a Index Seek
   │
   └── SELECT * trae columnas innecesarias
       Solución: listar solo columnas requeridas
   
   💡 Índices sugeridos:
   CREATE NONCLUSTERED INDEX IX_Pedidos_Fecha_Cliente
   ON pedidos (fecha, cliente_id)
   INCLUDE (total, estado, numero_pedido);
   
   ✅ Consulta optimizada:
   SELECT p.id, p.numero_pedido, p.fecha, p.total, c.nombre
   FROM pedidos p WITH (NOLOCK)
   INNER JOIN clientes c ON p.cliente_id = c.id
   WHERE p.fecha >= '2024-01-01' AND p.fecha < '2025-01-01'
     AND c.activo = 1;
   ```

5. **Advertencias de NOLOCK**: explicar cuándo es seguro y cuándo no

## Convenciones

- Siempre mostrar la consulta original y la optimizada en paralelo
- Indicar el tipo de operación esperada en el plan (Seek vs Scan)
- Para índices, incluir siempre `INCLUDE` con las columnas del SELECT
- Advertir sobre `WITH (NOLOCK)` y lecturas sucias
