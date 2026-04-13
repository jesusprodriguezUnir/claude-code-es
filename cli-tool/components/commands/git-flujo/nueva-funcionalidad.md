# /nueva-funcionalidad

Crea una rama feature siguiendo Git Flow en español con validaciones de nombre y tracking remoto.

## Propósito

Automatiza la creación de ramas feature con Git Flow:
- Valida que el nombre sea kebab-case descriptivo
- Crea la rama desde `develop` (o `main` si no existe `develop`)
- Configura tracking con el remoto
- Actualiza `develop` antes de crear la rama

## Uso

```
/nueva-funcionalidad <nombre-descripcion>
```

**Ejemplos:**
```
/nueva-funcionalidad gestion-empleados
/nueva-funcionalidad autenticacion-oauth2
/nueva-funcionalidad exportar-reporte-pdf
```

## Implementación

1. **Validar nombre**: Confirmar que sea kebab-case (solo minúsculas, números y guiones)

2. **Actualizar develop**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

3. **Crear y cambiar a la rama**:
   ```bash
   git checkout -b feature/<nombre-descripcion>
   ```

4. **Configurar tracking remoto**:
   ```bash
   git push -u origin feature/<nombre-descripcion>
   ```

5. **Mostrar resumen**:
   ```
   ✅ Rama creada: feature/gestion-empleados
   📍 Base: develop (commit abc1234)
   🔗 Tracking: origin/feature/gestion-empleados
   
   Próximos pasos:
   1. Desarrollar la funcionalidad con commits descriptivos
   2. Al terminar: /terminar-funcionalidad
   ```

## Convenciones de commits durante el desarrollo

Usar Conventional Commits en español:
```
feat: agregar listado paginado de empleados
fix: corregir validación de email en formulario
test: agregar pruebas de integración para endpoint empleados
refactor: extraer lógica de negocio a servicio dedicado
docs: documentar API de empleados con OpenAPI
```

## Convenciones

- Nombre de rama: `feature/<descripcion-en-kebab-case>`
- Siempre crear desde `develop` actualizado
- Commits atómicos y descriptivos (Conventional Commits)
- No hacer merge directo a `main` sin pasar por `develop`
