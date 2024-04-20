```js
throw new customError("InvalidToken", error.message, 403, 1);
```
```js
throw new customError("ExpiredToken", "El token ah expirado", 403, 2);
```
```js
throw new customError("BlackList","El token se encuentra en lista negra, se rechazo la conexion",403,3)
```
```js
throw new customError(
    "InvalidCredentials",
    "Este mail no tiene un usuario asociado",
    400,
    4
  );
```
```js  
  throw new customError(
    "InvalidCredentials",
    "Contraseña incorrecta",
    404,
    5,
    {
      attempts: await credentialsServices.getAttemptsNumber(credentials.id),
    }
  );
```
```js  
throw new customError(
    "RejectedAction",
    "Accion rechazada por falta de acceso o bloqueo de esta misma",
    403,
    6,
    {
      reason: { name: "UnverifiedAccount", via: "signin" },
    }
  );
```
```js
throw new customError("nonexistentUser", "Este usuario no existe", 404, 7);
```
```js
throw new customError("MissedAuthToken","Un token de autenticacion debe ser proporcionado",401,8,{
  method:""
})
```
```js
throw new customError("FailedMailConnection","Something went wrong while connecting with the SMTP provider",500,41,{
    provider:"Google",
    typeOfConnection:"SMTP"
  })
```


