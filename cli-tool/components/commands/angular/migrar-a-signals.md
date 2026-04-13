# /migrar-a-signals

Analiza componentes Angular y propone migración progresiva a la API de Signals.

## Propósito

Detecta patrones que pueden migrar a Signals de Angular 17+ y genera el código transformado:
- `@Input()` → `input()` / `input.required()`
- `@Output() EventEmitter` → `output()`
- `Subject` + `BehaviorSubject` simples → `signal()` + `computed()`
- `[(ngModel)]` bidireccional → `model()`

## Uso

```
/migrar-a-signals [archivo | directorio]
```

**Ejemplos:**
```
/migrar-a-signals src/app/components/producto-card.component.ts
/migrar-a-signals src/app/features/empleados/
/migrar-a-signals  (analiza todos los componentes del proyecto)
```

## Implementación

1. **Escanear componentes**: Usar Glob para encontrar `*.component.ts`

2. **Analizar cada componente** buscando:
   ```typescript
   // Patrones a detectar
   @Input() nombre: string = '';                    // → input<string>('')
   @Input({ required: true }) id!: number;          // → input.required<number>()
   @Output() seleccionar = new EventEmitter<Item>(); // → output<Item>()
   private estado$ = new BehaviorSubject(false);    // → estado = signal(false)
   readonly estado$ = this.estado$.asObservable();  // → computed o signal directo
   ```

3. **Generar informe de migración** con:
   - Total de componentes analizados
   - Candidatos a migración ordenados por facilidad
   - Código original vs código migrado propuesto para cada uno
   - Advertencias cuando hay RxJS complejo que NO debe migrarse (operadores, combineLatest, etc.)

4. **Aplicar migraciones** si el usuario confirma: solo transformaciones seguras (1:1 mapping)

## Reglas de migración

| Patrón original | Signal equivalente | Seguridad |
|----------------|-------------------|-----------|
| `@Input() x: T = val` | `x = input<T>(val)` | ✅ Segura |
| `@Input({ required: true }) x!: T` | `x = input.required<T>()` | ✅ Segura |
| `@Output() x = new EventEmitter<T>()` | `x = output<T>()` | ✅ Segura |
| `BehaviorSubject<T>(val)` sin operadores | `signal<T>(val)` | ⚠️ Revisar |
| `combineLatest([...])` | No migrar | ❌ Complejo |
| `switchMap`, `mergeMap`, etc. | No migrar | ❌ Complejo |

## Convenciones

- Migrar en orden de menor a mayor complejidad
- Nunca eliminar imports de `@angular/core` hasta confirmar que no se usan en otros archivos
- Actualizar siempre el template: `{{ nombre }}` → `{{ nombre() }}`, `[valor]="campo"` → `[valor]="campo()"`
