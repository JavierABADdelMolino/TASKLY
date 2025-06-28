# GitHub Actions Workflows

## Mantener Render Activo

El workflow `keep-alive.yml` está diseñado para evitar que el servicio de Render entre en modo de suspensión (sleep) en el plan gratuito.

### Funcionamiento:
- Hace una petición HTTP al endpoint `/api/ping` del backend cada 10 minutos
- Verifica que la respuesta sea exitosa (códigos 200 o 204)
- Muestra un mensaje de estado en los logs de GitHub Actions

### Ejecución manual:
Este workflow puede ejecutarse manualmente desde la pestaña "Actions" en GitHub si necesitas despertar manualmente el servicio.

### Ajustes:
Si cambias la URL del backend o el endpoint de ping, recuerda actualizar la URL en el archivo `keep-alive.yml`.
