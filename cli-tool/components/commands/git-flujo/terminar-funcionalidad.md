# /terminar-funcionalidad

Finaliza una rama feature: merge a develop con squash opcional, actualiza CHANGELOG y limpia la rama.

## Propósito

Completa el ciclo de vida de una rama feature:
- Verifica que la rama esté al día con `develop`
- Ofrece opción de squash para limpiar el historial
- Hace merge a `develop`
- Actualiza `CHANGELOG.md` si existe
- Elimina la rama local y remota

## Uso

```
/terminar-funcionalidad [--squash] [--no-eliminar]
```

**Ejemplos:**
```
/terminar-funcionalidad
/terminar-funcionalidad --squash
/terminar-funcionalidad --no-eliminar  (mantiene la rama para revisión)
```

## Implementación

1. **Verificar estado de la rama**:
   ```bash
   git status  # Confirmar sin cambios pendientes
   git log origin/develop..HEAD --oneline  # Ver commits a integrar
   ```

2. **Actualizar con develop** (rebase para historial limpio):
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

3. **Merge a develop**:
   ```bash
   git checkout develop
   git pull origin develop
   
   # Con squash (un solo commit limpio)
   git merge --squash feature/<nombre>
   git commit -m "feat: <descripción de la funcionalidad completa>"
   
   # Sin squash (mantiene historial)
   git merge --no-ff feature/<nombre>
   ```

4. **Actualizar CHANGELOG.md** (si existe):
   - Agregar entrada bajo `[Unreleased]` con la descripción del feature

5. **Push y limpieza**:
   ```bash
   git push origin develop
   git branch -d feature/<nombre>          # Eliminar local
   git push origin --delete feature/<nombre> # Eliminar remoto
   ```

6. **Mostrar resumen**:
   ```
   ✅ Feature integrado: feature/gestion-empleados → develop
   📝 Commits incluidos: 7 (squash: 1 commit final)
   🗑️  Rama eliminada: local y remota
   📋 CHANGELOG.md actualizado
   ```

## Convenciones

- Preferir `--squash` cuando los commits intermedios tienen mensajes de trabajo (WIP, fixes, etc.)
- Mantener historial completo (`--no-ff`) cuando los commits son limpios y documentan bien la evolución
- Siempre hacer `git pull origin develop` antes del merge para evitar conflictos
- El mensaje del commit de squash debe seguir Conventional Commits
