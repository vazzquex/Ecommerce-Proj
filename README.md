## Actualizaciones y Mejoras

### 1. Sistema de Envio de Correos
He implementado un sistema de notificación por correo electrónico que asegura que los usuarios sean informados cuando se elimina su cuenta debido a inactividad o cuando uno de sus productos es eliminado.

### 2. Centro de control para el admin
Se añadio un nuevo panel de control solo para el admin. En este panel, tenes la capacidad de eliminar usuarios o modificar sus roles.


![Screenshot from 2023-10-12 20-05-02](https://github.com/vazzquex/Ecommerce-Proj/assets/108772623/56deff02-ba3a-42a5-9c33-0ba23864af3e)
![Screenshot from 2023-10-12 20-05-38](https://github.com/vazzquex/Ecommerce-Proj/assets/108772623/65fb2117-50da-4918-abdd-c0b93ae77685)
![Screenshot from 2023-10-12 20-05-46](https://github.com/vazzquex/Ecommerce-Proj/assets/108772623/e39464c8-641b-44c7-b612-514dbc738c21)
![Screenshot from 2023-10-12 20-05-49](https://github.com/vazzquex/Ecommerce-Proj/assets/108772623/d9f68dc5-440a-4331-add9-0b0c892af661)
![Screenshot from 2023-10-12 20-06-05](https://github.com/vazzquex/Ecommerce-Proj/assets/108772623/cfb9cfe9-5291-46cd-8135-3423272be4d4)



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
