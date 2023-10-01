## Actualizaciones y Mejoras

### 1. Sistema de Envio de Correos
Cuando se elimina a un usuario ya sea por inactividad o tambien se elimina el producto de un usuario, este es notificado por email

### 2. Centro de control para el admin
Ahora hay una nueva vista para el admin donde puede eliminar a usuarios o actualizar sus roles


## 📝 Variables de Entorno

Archivo ejemplo del `.env` contiene:

```bash
# La variable "ENVIROMENT" puede ser "dev" para entorno de desarrollo y "prod" para un ejemplo de produccion 
ENVIROMENT="dev"


MONGO_URL='mongodb://localhost:8080/test' 

#Tiempo en segundos para que se elimine un usuario si pertenece inactivo
USER_CLEANUP_INTERVAL=170000

# Las siguientes variables son para la autenticación con GitHub usando Passport
CLIENT_ID='Iv1.a1b2c3a1b2c3'
CLIENT_SECRET='12345123451234512345123451'

SECRET_KEY='1234512345'

ADMIN_USER='prueba@adminuser.com'
ADMIN_PASSWORD='contraseña'

##Gmail keys
EMAIL='your@email.com'
EMAIL_PASS='a7y1234tk487ty' #example 
```
## 🚀 Cómo usar este proyecto

Para usar este proyecto, sigue estos pasos:

Ejecuta `npm install` para instalar las dependencias. 📥
Luego, ejecuta `npm start` para iniciar el servidor. 🖥️
