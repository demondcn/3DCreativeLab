# Producto

<!-- impeccable:product-schema 1 -->

## Plataforma

web

## Stack

Next.js con App Router, React, TypeScript, Tailwind CSS, Neon Postgres y Managed Better Auth. Neon fue elegido expresamente por el usuario en sustitucion de Supabase.

## Usuarios

- Inferido del brief: compradores en Colombia que buscan objetos impresos en 3D disponibles o fabricados bajo pedido.
- Personas y empresas que necesitan una pieza personalizada y prefieren concretar especificaciones, disponibilidad, pago y envio por WhatsApp.
- Personal administrador autorizado que mantiene catalogo, precios, imagenes e inventario sin editar codigo.

## Proposito del producto

Permitir que un cliente descubra productos de impresion 3D, entienda precio y tiempos estimados, y prepare una solicitud clara por WhatsApp. Permitir que el negocio gestione el catalogo y el inventario desde una interfaz privada conectada a una base de datos persistente.

## Posicionamiento

La experiencia debe presentar la impresion 3D como fabricacion profesional, no como una coleccion de archivos o una tienda generica: cada producto muestra disponibilidad, modalidad de fabricacion, tiempo estimado y una consulta contextual lista para WhatsApp.

## Contexto operativo

- Moneda y contenido: espanol de Colombia y pesos colombianos (COP).
- Contacto comercial: WhatsApp +57 302 446 8132 mediante `https://wa.me/573024468132`.
- Flujo inicial: explorar, revisar detalle, elegir cantidad y consultar por WhatsApp; el negocio confirma disponibilidad, pago y envio directamente.
- Los productos pueden estar en inventario o fabricarse bajo pedido.
- Las fotografias de productos se almacenan en Vercel Blob; Neon conserva solamente sus URLs.

## Capacidades y restricciones

- Catalogo dinamico con busqueda, filtros por categoria, tipo, etiquetas y precio, ordenamiento, disponibilidad y estados de carga, vacio y error.
- Detalle por slug estable con SEO basico, etiquetas, cantidad y mensaje de WhatsApp codificado.
- Formulario de pedidos personalizados que genera un mensaje de WhatsApp; no simula un envio ni confirmacion.
- Panel privado con dashboard e inventario CRUD, slug automatico editable, etiquetas multiples, Managed Better Auth y autorizacion del lado servidor limitada a `ADMIN_EMAIL`.
- Registro, verificacion de correo mediante codigo OTP, inicio de sesion, recuperacion de contrasena y area de cuenta para clientes mediante Managed Better Auth.
- Recuperacion de acceso mediante correo y token temporal de Neon Auth, sin revelar si una cuenta existe.
- No hay registro publico de administradores, historial ficticio de pedidos, pasarela de pago, carrito complejo ni WhatsApp Business API en esta version.
- No se deben inventar testimonios, descuentos, estadisticas, disponibilidad ni fechas exactas.
- Neon PostgreSQL y Managed Better Auth estan conectados. Vercel Blob requiere su token privado antes de probar cargas reales.

## Compromisos de marca

- Nombre oficial confirmado: 3DCreativeLab.
- Paleta oficial confirmada: blanco, negro y grises. Las fotografias de producto conservan sus colores originales. El rojo fue descartado expresamente.
- Direccion visual confirmada: una orden de taller inspirada en hojas viajeras de fabricacion y etiquetas de control de calidad, aplicada con claridad comercial.
- Voz clara, profesional, cercana y precisa en espanol colombiano.
- Inferido del brief: el publico inicial es mixto; el mensaje equilibra productos decorativos o de regalo con encargos personalizados.

## Evidencia disponible

- Brief funcional completo y numero real de WhatsApp.
- No existen fotografias reales, testimonios ni cifras comerciales aportadas.
- La base de produccion inicia vacia; el seed demostrativo no se ejecuta automaticamente.

## Principios de producto

- Mostrar informacion util antes de pedir contacto.
- No fingir acciones, datos ni integraciones.
- Hacer que cada consulta llegue a WhatsApp con el contexto necesario.
- Mantener segura y sencilla la administracion del catalogo.
- Diseñar primero para uso tactil y adaptarlo con la misma calidad al escritorio.

## Accesibilidad e inclusion

Navegacion, formularios y controles deben funcionar con teclado, tener nombres accesibles, foco visible, contraste suficiente y respetar `prefers-reduced-motion`.
