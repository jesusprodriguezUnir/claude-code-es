# /generar-servicio

Genera un servicio Angular con inyección de dependencias, tipado estricto y prueba unitaria.

## Propósito

Crea un servicio Angular completo con:
- `@Injectable({ providedIn: 'root' })` por defecto
- Inyección con `inject()` (no constructor)
- Métodos tipados con `Observable<T>` o `Promise<T>`
- Manejo de errores con `catchError` o `try/catch`
- Prueba unitaria con mock de `HttpClient`

## Uso

```
/generar-servicio <nombre> [--http] [--crud <entidad>] [--scope root|component]
```

**Ejemplos:**
```
/generar-servicio empleado --http --crud Empleado
/generar-servicio autenticacion --http
/generar-servicio temas --scope root
```

## Implementación

1. **Detectar contexto**: Leer `tsconfig.json` para confirmar modo strict y version target

2. **Generar `<nombre>.service.ts`**:

   Con `--http --crud <Entidad>` genera métodos CRUD completos:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class EmpleadoService {
     private readonly http = inject(HttpClient);
     private readonly baseUrl = '/api/empleados';

     obtenerTodos(): Observable<Empleado[]> { ... }
     obtenerPorId(id: number): Observable<Empleado> { ... }
     crear(datos: CrearEmpleadoDto): Observable<Empleado> { ... }
     actualizar(id: number, datos: ActualizarEmpleadoDto): Observable<Empleado> { ... }
     eliminar(id: number): Observable<void> { ... }
   }
   ```

3. **Generar `<nombre>.service.spec.ts`**:
   - `HttpClientTestingModule` y `HttpTestingController`
   - Tests para método principal y manejo de error 500

4. **Crear interfaces si no existen**: `<entidad>.model.ts` con las interfaces necesarias

## Convenciones

- Siempre `inject()` en lugar de constructor DI
- Manejo de errores con `pipe(catchError(...))` en todos los métodos HTTP
- Interfaces en archivos `*.model.ts` separados
- Nombre de archivo: `<nombre>.service.ts`
- Nombre de clase: `<NombrePascal>Service`
