# Instrucciones permanentes del proyecto

Estas instrucciones aplican a todo el arbol de 3DCreativeLab y a futuras sesiones.

## Identidad aprobada

- Empresa: **3DCreativeLab**.
- Direccion visual: **Linea de inspeccion**.
- Paleta: exclusivamente blanco, negro y escala de grises.
- No reabrir decisiones de nombre, direccion visual o paleta salvo peticion expresa del usuario.

## Skills obligatorias

Antes de actuar en una nueva sesion, comprobar que estan disponibles y leer su `SKILL.md` completo cuando corresponda:

1. `emil-design-eng`: aplicar movimiento deliberado, feedback tactil, transiciones interrumpibles, duraciones breves, hover solo para puntero fino y `prefers-reduced-motion`.
2. `impeccable`: mantener `PRODUCT.md`, contratos de superficie y controles de acabado. Usar sus revisiones como verificacion interna sin volver a pedir decisiones visuales ya aprobadas.
3. `design-taste-frontend`: mantener la direccion de secciones y la calidad anti-generica. Para este proyecto, la direccion registrada es `contact-sheet`, subordinada a la composicion aprobada Linea de inspeccion.
4. `ponytail` en nivel `full`: implementar la solucion completa con el menor codigo y dependencias posibles; reutilizar patrones existentes, evitar abstracciones prematuras y dejar pruebas pequenas para logica no trivial, dinero, validacion y seguridad.

## Reglas de implementacion

- Continuar desde el codigo existente; no recrear ni reinicializar el proyecto.
- Next.js App Router, React, TypeScript, Tailwind CSS y Neon Postgres con Managed Better Auth.
- Espanol de Colombia, precios en COP y WhatsApp `https://wa.me/573024468132`.
- Sin pasarela de pago ni carrito complejo en esta version.
- No inventar testimonios, descuentos, estadisticas, disponibilidad real ni fechas exactas.
- Los datos de demostracion solo se permiten en desarrollo sin credenciales. Produccion debe mostrar un error cuando Neon no este disponible.
- Proteger administracion en servidor, limitarla a `ADMIN_EMAIL` y no exponer `DATABASE_URL` en el navegador.
- Guardar fotografias en Vercel Blob y solo sus referencias en Neon; validar formato, cantidad y tamano antes de subir.
- Ejecutar typecheck, lint, pruebas, build de produccion y comprobacion responsive antes de entregar.

## Criterio de cierre

No declarar el proyecto terminado mientras falten funcionalidades solicitadas, pruebas relevantes, migraciones reproducibles, `.env.example`, README de Windows, auditoria visual final o documentacion de riesgos pendientes.
