# Sistema visual de 3DCreativeLab

## Dirección

«Línea de inspección»: una interfaz inspirada en fichas de control, estaciones de fabricación y etiquetas de taller. La composición combina titulares condensados, reglas gruesas, numeración técnica e imágenes monocromas. No se debe convertir en una tienda genérica de tarjetas suaves.

## Color

- Tinta: `#090909`
- Papel: `#f1f1f1`
- Campo industrial: `#444444`
- Texto secundario: `#4a4a4a`
- Blanco: `#ffffff`

No se admiten colores de acento. Estados y jerarquía se comunican mediante valor, borde, texto y posición.

## Tipografía

- Display: Akshar, pesos 500–700, titulares compactos y en mayúsculas cuando son secciones.
- Texto: Bricolage Grotesque, pesos 400–700.
- Los precios y conteos usan cifras tabulares.

## Superficies y controles

- Bordes rectos de 2–3 px; sin degradados decorativos ni esquinas redondeadas en controles.
- Acciones primarias con contraste máximo y altura mínima de 48 px.
- Foco visible de 3 px con separación de 4 px.
- Tarjetas de producto: imagen monocroma, categoría, nombre, precio y estado; nada ornamental sin función.

## Movimiento

- Transiciones de 160–300 ms con salida rápida.
- Hover solamente bajo `@media (hover: hover) and (pointer: fine)`.
- Las pulsaciones comprimen el control a `.97`.
- `prefers-reduced-motion` elimina desplazamientos y animaciones.

## Responsive

- Escritorio: cuadrículas de cuatro estaciones/productos.
- Tableta: dos columnas.
- Móvil: una columna y controles táctiles; el hero conserva el orden titular → imagen → fichas.

## Voz

Español de Colombia, claro y directo. Informar precio, inventario, modalidad y siguiente paso sin prometer disponibilidad, entrega ni cotizaciones automáticas.
