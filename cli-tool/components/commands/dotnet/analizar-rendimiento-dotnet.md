# /analizar-rendimiento-dotnet

Detecta problemas de rendimiento comunes en proyectos .NET Core: N+1, sync-over-async, allocations y más.

## Propósito

Analiza el código .NET del proyecto en busca de antipatrones de rendimiento:
- Consultas N+1 en Entity Framework Core
- Llamadas `Task.Result` / `.GetAwaiter().GetResult()` (sync-over-async)
- Concatenación de strings en loops (usar StringBuilder)
- Capturas de `DbContext` en singletons (DI scope mismatch)
- `ToList()` innecesarios antes de filtrar
- Falta de `AsNoTracking()` en consultas de solo lectura
- Falta de índices detectables por las consultas LINQ
- Boxing/unboxing evitable con generics

## Uso

```
/analizar-rendimiento-dotnet [ruta | .] [--solo-criticos]
```

**Ejemplos:**
```
/analizar-rendimiento-dotnet
/analizar-rendimiento-dotnet src/Infrastructure/
/analizar-rendimiento-dotnet --solo-criticos
```

## Implementación

1. **Escanear archivos C#**: Usar Grep para buscar patrones conocidos

2. **Detectar N+1 en EF Core**:
   ```
   Buscar: bucles foreach/for que contienen .FirstOrDefault(), .Find(), db.*, .Include()
   ```

3. **Detectar sync-over-async**:
   ```
   Buscar: .Result, .GetAwaiter().GetResult(), .Wait() en métodos async
   ```

4. **Detectar AsNoTracking faltante**:
   ```
   Buscar: .Where(...) sin .AsNoTracking() en métodos que devuelven datos de solo lectura (GET)
   ```

5. **Generar informe**:
   ```
   🔍 Análisis de Rendimiento — MiProyecto
   ════════════════════════════════════════

   🚨 Críticos (3):
   ├── Infrastructure/Repos/PedidoRepository.cs:45
   │   Sync-over-async: await this.ObtenerClienteAsync().Result
   │   → Cambiar a: await ObtenerClienteAsync()
   │
   ├── Application/Services/ReporteService.cs:89
   │   Consulta N+1: foreach sobre lista con .Include() dentro del bucle
   │   → Usar eager loading o batch query
   │
   └── Infrastructure/Repos/ProductoRepository.cs:32
       Sin AsNoTracking en query de solo lectura
       → Agregar .AsNoTracking() antes de .ToListAsync()

   ⚠️  Advertencias (5):
   ├── ToList() antes de Where() — 3 ocurrencias
   ├── string concatenación en loop — 2 ocurrencias
   ```

6. **Proponer correcciones** con el código corregido para cada issue

## Convenciones

- Mostrar siempre el archivo y línea exactos
- Indicar impacto estimado en rendimiento (alto/medio/bajo)
- No modificar archivos sin confirmación del usuario
- Priorizar los críticos (sync-over-async, N+1) sobre las advertencias
