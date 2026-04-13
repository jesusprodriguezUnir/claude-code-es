# /nuevo-componente

Genera un componente Angular standalone completo con buenas prácticas modernas.

## Propósito

Crea un componente Angular 17+ standalone con:
- `ChangeDetectionStrategy.OnPush`
- Signal inputs y outputs (si aplica)
- Template con nueva sintaxis de control flow
- Archivo de prueba unitaria con TestBed
- Estilos con clase BEM o CSS encapsulado

## Uso

```
/nuevo-componente <nombre> [--tipo presentador|contenedor] [--con-form] [--con-lista]
```

**Ejemplos:**
```
/nuevo-componente producto-card --tipo presentador
/nuevo-componente lista-empleados --tipo contenedor --con-lista
/nuevo-componente formulario-contacto --con-form
```

## Implementación

1. **Analizar el contexto**: Leer la estructura del proyecto para determinar:
   - Ubicación correcta del componente (feature folder)
   - Prefijo del selector (`app-`, `ui-`, etc. según `angular.json`)
   - Módulos o imports ya disponibles

2. **Generar archivos**:

   **`<nombre>.component.ts`**:
   ```typescript
   import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
   import { CommonModule } from '@angular/common';

   @Component({
     selector: 'app-<nombre>',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './<nombre>.component.html',
     styleUrl: './<nombre>.component.scss',
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class <NombrePascal>Component {
     // Signals de entrada y salida según el tipo solicitado
   }
   ```

   **`<nombre>.component.html`**: Template mínimo con nueva sintaxis
   
   **`<nombre>.component.scss`**: Estilos con selector de host y BEM básico
   
   **`<nombre>.component.spec.ts`**: Prueba unitaria con TestBed y describe/it

3. **Validaciones previas**:
   - Verificar que el nombre sigue `kebab-case`
   - Confirmar que no existe ya un componente con ese nombre
   - Revisar si necesita imports adicionales (`ReactiveFormsModule`, `RouterLink`, etc.)

4. **Reportar**: Mostrar la lista de archivos creados y el comando para incluirlo en la app

## Convenciones

- Nombre del selector: `app-<nombre>` (según prefijo detectado en `angular.json`)
- Nombre de clase: `<NombrePascal>Component`
- Siempre `ChangeDetectionStrategy.OnPush`
- Signals para todos los inputs/outputs en código nuevo
- El archivo de prueba siempre se genera
