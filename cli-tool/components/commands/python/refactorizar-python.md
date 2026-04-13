# /refactorizar-python

Analiza un archivo Python con ruff y mypy, detecta problemas y propone refactorizaciones concretas.

## Propósito

Realiza un análisis de calidad de código Python y propone mejoras:
- Linting con ruff (PEP8, imports, buenas prácticas)
- Verificación de tipos con mypy
- Detección de funciones largas (> 50 líneas)
- Código duplicado o candidato a extracción
- Type hints faltantes
- Docstrings ausentes en funciones públicas

## Uso

```
/refactorizar-python [archivo | directorio | .]
```

**Ejemplos:**
```
/refactorizar-python src/services/empleado_service.py
/refactorizar-python src/
/refactorizar-python .
```

## Implementación

1. **Verificar herramientas**:
   ```bash
   pip show ruff mypy 2>/dev/null || pip install ruff mypy
   ```

2. **Ejecutar ruff**:
   ```bash
   ruff check <ruta> --output-format=json
   ```

3. **Ejecutar mypy**:
   ```bash
   mypy <ruta> --output=json 2>&1
   ```

4. **Análisis estático adicional** (con Read y Grep):
   - Funciones con más de 50 líneas
   - Funciones sin type hints
   - Clases sin docstring
   - Código repetido (mismo bloque > 5 líneas en múltiples lugares)

5. **Generar informe priorizado**:
   ```
   🔍 Análisis de Calidad — empleado_service.py
   ════════════════════════════════════════════

   🚨 Errores de tipos (mypy):
   ├── línea 45: Argument 1 to "crear" has incompatible type "str"; expected "int"
   └── línea 67: Item "None" of "Empleado | None" has no attribute "email"

   ⚠️ Advertencias ruff (8 issues):
   ├── línea 12: F401 — 'datetime' imported but unused
   ├── línea 23: B006 — Do not use mutable data structures for argument defaults
   ├── línea 89: SIM108 — Use ternary operator instead of if-else block
   └── ... (5 más)

   📋 Mejoras de calidad:
   ├── procesar_datos() (línea 34): 78 líneas → candidata a extracción
   ├── Sin type hints: _validar_email, _normalizar_nombre
   └── Sin docstring: clase EmpleadoService, método crear

   💡 Refactorizaciones sugeridas:
   1. Extraer _validar_reglas_negocio() de procesar_datos()
   2. Agregar type hints a 2 funciones privadas
   3. Convertir lógica condicional en línea 89 a ternario
   ```

6. **Aplicar correcciones automáticas** si el usuario confirma:
   ```bash
   ruff check --fix <ruta>
   ruff format <ruta>
   ```

## Convenciones

- Mostrar archivo y número de línea para cada issue
- Diferenciar entre errores (bloquean), advertencias (deben revisarse) y sugerencias
- No modificar archivos automáticamente sin confirmación
- Priorizar errores de tipos sobre estilo
