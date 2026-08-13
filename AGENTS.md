# AGENTS.md

## Propósito del proyecto

Aplicación web "Libreta Digital" para el almacén "Almacén Lo de Inés" (Fraile Muerto, Cerro Largo, Uruguay). Gestiona de forma digital las ventas del comercio: registro de ventas al contado, catálogo de productos con efecto de libro y generación de tickets.

## Stack tecnológico

- React 18 + TypeScript 5.2
- Vite 5 (build y dev server)
- Material UI v7 (@mui/material, @mui/icons-material, @emotion)
- framer-motion (animaciones 3D del catalogo en forma de libro)
- react-router-dom v7 (rutas)
- html2canvas + jsPDF (generacion de PDF del ticket)
- vite-plugin-pwa (PWA instalable con cache)
- Firebase SDK (instalado, configurado en `src/firebase/config.ts`, NO integrado aun)

## Estructura general

```
src/
  models/       Product, SaleItem, SaleTicket, CatalogPage (en CatalogItem.ts)
  data/         products.ts (catalogo de precios, 5 items) y catalog.ts (libro, 17 spreads)
  context/      SaleContext + hook useSale (estado global del ticket)
  hooks/        useInactivity
  firebase/     config.ts (inicializa Firebase, codigo sin uso actual)
  pages/        Home, CashSale (SaleTicket.tsx esta muerta, no enrutada)
  components/   Ticket, TicketDrawer, TicketModal (sin uso), BookCatalog/
  theme/        theme.ts (paleta verde MUI)
public/catalogo/  Imagenes de productos (bebidas/, lacteos/)
```

Rutas: `/` → Home (menu), `/venta` → CashSale. El catalogo tipo libro se muestra fullscreen cuando hay 2 min de inactividad.

## Funcionalidades que funcionan

1. Catalogo de productos con efecto de libro/flip 3D (se abre a los 2s y auto-voltea paginas cada 6s).
2. Modulo de venta al contado (Alta de producto + precio, detalle de compra, total).
3. Ingreso de productos y precios (Autocomplete libre + campo de precio con validaciones).
4. Calculo del total de la venta (reduce de los items).
5. Generacion/visualizacion de ticket (Drawer lateral con Ticket, exportar PDF de 80mm, imprimir y compartir).

## Reglas para no romper funcionalidades existentes

- No eliminar ni reemplazar componentes que ya funcionan sin una razon concreta.
- Conservar la arquitectura actual (paginas → componentes → datos estaticos listos para Firebase).
- Mantener intactos los flujos que funcionan: flujo de venta (`CashSale.tsx`), flujo del ticket (`Ticket.tsx`), libro del catalogo (`Book.tsx`/`BookSpread.tsx`).
- No enrutar ni habilitar paginas de demos rotas (ej. `SaleTicket.tsx`) por accidente.
- No eliminar el overlay de inactividad que muestra el catalogo (`App.tsx`).
- Preservar la configuracion de Firebase (project `libreta-digital-3f11f`) y del hosting.
- No introducir cambios que rompan `npm run build` (hoy compila correctamente; mantenerlo asi).

## Reglas para modificar codigo

- Entender el codigo antes de tocarlo; no asumir.
- Seguir las convenciones existentes: SFC con arrow function por defecto, MUI para UI (`sx`), estilos de catalogo en `book.css`, fuentes Courier para el ticket.
- Mantener tipado estricto: `strict: true`, `noUnusedLocals`, `noUnusedParameters`.
- No agregar dependencias nuevas solo por conveniencia; reutilizar las ya instaladas.
- No duplicar datos: `products.ts` y `catalog.ts` hoy estan desconectados; no agravar la divergencia ni fijar precios en dos lugares.
- No expner/acotar secretos: la apiKey de Firebase ya es publica y normal para web, pero no subir keys nuevas ni archivos de credenciales.
- No dejar comentarios explicativos innecesarios; codigo limpio.
- Archivos muertos que conviene no revivir sin necesidad: `Firebase` config.ts, `SaleTicket.tsx`, `TicketModal.tsx`.

## Comandos de verificacion

```sh
npm run dev          # dev server (NO chequea tipos)
npm run build        # tsc -b + vite build; compila correctamente
npm run lint         # eslint (max-warnings 0)
npx tsc --noEmit -p tsconfig.app.json   # type-check rapido
npx tsc --noEmit -p tsconfig.node.json
```

Estado conocido: `npm run build` compila correctamente (EXIT 0). Se elimino `src/components/BookCatalog/BookPage.tsx` (codigo muerto sin referencias) que causaba el error anterior. `npm run lint` reporta 1 warning pre-existente en `src/context/SaleContext.tsx:9` (`react-refresh/only-export-components`, max-warnings 0) que no afecta al build.