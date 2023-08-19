## Actualizaciones y Mejoras

### 1. Sistema de Recuperación de Contraseña
Permite a los usuarios restablecer su contraseña mediante un enlace enviado por correo electrónico. El enlace expira después de 1 hora y no permite restablecer la contraseña con la misma actual. Si el enlace ha expirado, redirige a una vista que permite generar un nuevo correo de restablecimiento.

### 2. Nuevo Rol "Premium"
Se ha establecido un rol premium que tiene la capacidad de crear productos.

### 3. Modificación del Schema de Producto
Se añadió un campo "owner" para identificar al creador del producto. Si se crea un producto sin propietario, el valor por defecto es "admin". Solo los usuarios premium pueden ser asignados como propietarios.

### 4. Permisos de Modificación y Eliminación de Productos
Los usuarios premium solo pueden eliminar productos que les pertenecen, mientras que los administradores pueden eliminar cualquier producto.

### 5. Lógica de Carrito Modificada
Los usuarios premium no pueden agregar a su carrito un producto que les pertenezca.

### 6. Ruta para Cambiar el Rol de Usuario
Se implementó una nueva ruta en el router de api/users, específicamente `/api/users/premium/:uid`, que permite cambiar el rol de un usuario de "user" a "premium" y viceversa.



## 📝 Variables de Entorno

Archivo ejemplo del `.env` contiene:

```bash
# La variable "ENVIROMENT" puede ser "dev" para entorno de desarrollo y "prod" para un ejemplo de produccion 
ENVIROMENT="dev"


MONGO_URL='mongodb://localhost:8080/test' 

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
