# 3DCreativeLab

Tienda administrable de impresión 3D construida con Next.js 16, TypeScript, Tailwind CSS, Neon PostgreSQL, Neon Managed Better Auth y Vercel Blob.

## Ejecutar en Windows

Requisitos: Node.js 22 o superior, un proyecto de Neon y, para subir fotografías, un almacén público de Vercel Blob.

```powershell
npm install
Copy-Item .env.example .env.local
# Completa .env.local de forma privada
npm run db:migrate
npm run dev
```

Abre `http://localhost:3000`. `.env.local` está excluido por `.gitignore`; nunca debe copiarse al README, capturas o control de versiones.

## Variables privadas

```dotenv
DATABASE_URL=
NEON_AUTH_BASE_URL=
NEON_AUTH_COOKIE_SECRET=
ADMIN_EMAIL=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Genera el secreto de cookies en PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

Ninguna de las credenciales debe llevar el prefijo `NEXT_PUBLIC_`.

## Neon PostgreSQL

1. Copia la cadena con pooling desde **Neon → Connect** a `DATABASE_URL`.
2. Ejecuta `npm run db:migrate`. El migrador registra cada archivo aplicado en `schema_migrations`, por lo que no duplica tablas.
3. Comprueba la conexión con `npm run db:inspect`.
4. Ejecuta `npm run db:smoke` para probar un CRUD temporal que se elimina automáticamente.

No ejecutes `neon/seed.sql` en producción salvo que hayas revisado expresamente sus productos demostrativos. Cuando Neon está configurado, el catálogo nunca sustituye una consulta fallida por arrays ficticios.

## Administrador y Neon Auth

1. En la rama de Neon abre **Auth → Configuration** y activa Managed Better Auth.
2. Copia el Auth URL a `NEON_AUTH_BASE_URL`.
3. Crea la cuenta administrativa desde Neon Auth usando una contraseña privada elegida por su propietario.
4. Escribe exactamente ese correo en `ADMIN_EMAIL`.
5. Añade `http://localhost:3000` y después el dominio público a los orígenes autorizados.
6. Comprueba endpoint, esquema y existencia de la cuenta con `npm run auth:smoke`.

La autorización se repite en cada Server Action. Tener una cuenta válida no concede administración si el correo no coincide con `ADMIN_EMAIL`.

Si la cuenta ya existe pero no conoces la contraseña, abre `/admin/forgot-password`. El correo siempre muestra una respuesta neutral para no revelar si una cuenta existe; el enlace de Neon abre `/admin/reset-password`, vence después de 15 minutos y permite establecer una contraseña nueva sin modificar tablas ni hashes manualmente.

## Cuentas de clientes

Las rutas públicas de autenticación reutilizan la misma instancia de Neon Managed Better Auth:

- `/iniciar-sesion`: acceso de clientes y administrador. El destino final se decide con la sesión validada en el servidor.
- `/registrarse`: crea únicamente usuarios normales mediante `signUp.email`; si el correo queda pendiente, muestra el formulario de seis dígitos y valida el código con `emailOtp.verifyEmail`.
- `/recuperar-contrasena` y `/restablecer-contrasena`: recuperación neutral con `requestPasswordReset` y `resetPassword`.
- `/cuenta`: nombre, correo, estado de verificación, catálogo y cierre de sesión. No muestra pedidos inexistentes.

En **Neon Console → Settings → Better Auth** mantén `Sign-up with Email` activo, habilita `Verify at Sign-up` y selecciona `Codes`. Con esa configuración, `signUp.email` envía automáticamente el código; `sendVerificationEmail` solicita un código nuevo sin volver a crear la cuenta. Agrega también los orígenes autorizados. `NEXT_PUBLIC_SITE_URL` es la única base utilizada para callbacks: en local puede ser `http://127.0.0.1:3001`; en Vercel Production debe ser exactamente `https://3dcreativelab.vercel.app`. La aplicación rechaza en producción cualquier otro host, protocolo, ruta o credencial embebida.

La cuenta administrativa existente puede completar o reenviar su código desde el formulario de acceso cuando Neon la marque como pendiente, o desde `/cuenta` después de iniciar sesión. El código se envía a esa misma dirección; verificarla no crea otra cuenta ni cambia permisos. Un correo que coincida con `ADMIN_EMAIL` solo recibe acceso administrativo cuando la sesión real de esa cuenta ha sido validada en el servidor.

Neon/Better Auth aplica el límite de solicitudes del servicio a registro, acceso, verificación y recuperación. La interfaz además bloquea envíos simultáneos y maneja respuestas `429` sin revelar la existencia de cuentas.

## Fotografías con Vercel Blob

Vercel Blob mantiene los archivos fuera de PostgreSQL y entrega URLs públicas optimizadas por CDN.

1. En el proyecto de Vercel abre **Storage → Create Database → Blob**.
2. Crea un almacén público y conéctalo a los entornos deseados.
3. Copia `BLOB_READ_WRITE_TOKEN` a `.env.local` o usa `vercel env pull`.
4. Reinicia el servidor. El formulario administrativo permite hasta 6 imágenes JPG, PNG, WebP o AVIF, de máximo 4 MB cada una.

Una nueva selección reemplaza las fotografías anteriores. Los archivos antiguos se eliminan después de confirmar la actualización en Neon; si una escritura falla, se limpian las cargas nuevas. Sin el token, el catálogo y el CRUD textual funcionan, pero las cargas muestran un error real y no se simulan.

## Funciones

- Catálogo exclusivamente desde Neon con búsqueda, categoría, tipo y orden por nombre o precio.
- Detalle con inventario, tiempos de impresión y envío, galería y enlace MakerWorld.
- WhatsApp con cantidad, precio unitario, total estimado y solicitud explícita de confirmación.
- Solicitudes personalizadas con nombre, contacto, descripción, cantidad, ciudad y referencias.
- Panel protegido: CRUD, fotografías, visibilidad, destacados e inventario.
- Registro, verificación por código OTP, inicio de sesión, recuperación de contraseña y cuenta de cliente sobre Neon Auth.
- Dashboard calculado desde Neon: total, visibles, agotados, pocas unidades y valor de inventario.
- Estados vacíos y errores de conexión sin datos ficticios en producción.

## Verificación

```powershell
npm run typecheck
npm run lint
npm test
npm run db:inspect
npm run db:smoke
npm run auth:smoke
npm run build
npm audit --omit=dev
```

Con un build ejecutándose en el puerto 3001 también puedes correr `npm run e2e:public`.

## Publicar en Vercel

1. Sube el repositorio a un proveedor Git. Confirma que `.env.local` no aparezca en los archivos versionados.
2. Importa el repositorio en Vercel sin publicar todavía un dominio comercial.
3. Crea/conecta Vercel Blob.
4. Añade las seis variables en **Settings → Environment Variables** para Production y Preview.
5. Cambia `NEXT_PUBLIC_SITE_URL` por la URL de Vercel.
6. Añade la misma URL a los orígenes de Neon Auth.
7. Ejecuta las migraciones contra la rama de producción de Neon.
8. Despliega y prueba catálogo, detalle, formulario, sesión administrativa, CRUD y subida de fotografías.
9. Carga productos reales desde `/admin`; no ejecutes el seed demostrativo.
10. Conecta el dominio definitivo, actualiza `NEXT_PUBLIC_SITE_URL` y Neon Auth, y vuelve a desplegar.

La aplicación no incluye carrito ni pasarela de pago. WhatsApp prepara una solicitud; no afirma que exista un pedido confirmado.

