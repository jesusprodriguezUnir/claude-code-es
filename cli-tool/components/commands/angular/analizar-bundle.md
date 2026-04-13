# /analizar-bundle

Analiza el bundle de Angular para detectar dependencias pesadas y oportunidades de optimización.

## Propósito

Ejecuta un análisis del build de Angular para identificar:
- Módulos y dependencias que aumentan el bundle
- Código importado pero no usado (tree-shaking fallido)
- Chunks que pueden dividirse con lazy loading
- Estimado de mejora de Core Web Vitals (LCP, FID)

## Uso

```
/analizar-bundle [--produccion] [--umbral <kb>]
```

**Ejemplos:**
```
/analizar-bundle
/analizar-bundle --produccion
/analizar-bundle --umbral 50  (reportar módulos > 50 KB)
```

## Implementación

1. **Verificar dependencias**: Confirmar que `webpack-bundle-analyzer` está instalado
   ```bash
   npm list webpack-bundle-analyzer 2>/dev/null || npm install --save-dev webpack-bundle-analyzer
   ```

2. **Ejecutar build con stats**:
   ```bash
   ng build --stats-json
   ```

3. **Analizar `dist/stats.json`**:
   - Leer el archivo JSON generado
   - Identificar chunks mayores al umbral especificado (default: 30 KB)
   - Detectar duplicados (misma librería en múltiples chunks)
   - Buscar `node_modules` de alto peso

4. **Generar informe con recomendaciones**:

   ```
   📦 Análisis de Bundle — Mi Aplicación
   ════════════════════════════════════
   Total: 1.24 MB (sin comprimir) | 312 KB (gzip)
   
   ⚠️  Módulos pesados (> 30 KB):
   ├── @angular/material: 245 KB → usar imports selectivos
   ├── rxjs: 180 KB → importar solo operadores usados
   ├── moment.js: 142 KB → reemplazar con date-fns o Intl API
   └── chart.js: 98 KB → cargar con @defer
   
   🚀 Oportunidades de lazy loading:
   ├── AdminModule (67 KB) → convertir a ruta lazy
   └── ReportesModule (43 KB) → convertir a ruta lazy
   
   💡 Mejoras recomendadas:
   1. Lazy load de AdminModule: -67 KB del bundle inicial
   2. Reemplazar moment.js con date-fns: -100 KB
   3. Usar @defer para chart.js: -98 KB del bundle inicial
   ```

5. **Proponer cambios de código** para las mejoras identificadas

## Convenciones

- Siempre generar el informe antes de proponer cambios
- No modificar `package.json` sin confirmación explícita
- Priorizar mejoras por impacto en el bundle inicial (no lazy)
