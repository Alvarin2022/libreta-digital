import { useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { catalog } from "../../data/catalog";
import { products } from "../../data/products";
import "./book.css";

interface BookCatalogProps {
  onExit: () => void;
}

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/(ml|cc|kg|g|l)$/, "");

export default function BookCatalog({ onExit }: BookCatalogProps) {
  const items = useMemo(
    () =>
      catalog.flatMap((spread) => [spread.left, spread.right]).map((item) => {
        const product = products.find(
          (candidate) =>
            normalizeName(candidate.name) === normalizeName(item.title),
        );

        return {
          ...item,
          price: product?.price,
          category: item.image.includes("/bebidas/") ? "Bebidas" : "Lácteos",
        };
      }),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeItem = items[activeIndex];

  useEffect(() => {
    if (autoPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPaused, items.length]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const pauseAutoAdvance = () => {
    setAutoPaused(true);

    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoPaused(false), 6500);
  };

  const showItem = (index: number) => {
    pauseAutoAdvance();
    setActiveIndex((index + items.length) % items.length);
  };

  return (
    <main
      className="catalog-background promo-carousel"
      data-promotional-carousel
      onPointerDown={pauseAutoAdvance}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showItem(activeIndex - 1);
        if (event.key === "ArrowRight") showItem(activeIndex + 1);
      }}
    >
      <div className="promo-shell">
        <header className="promo-header">
          <div className="promo-brand">
            <span className="promo-brand-mark" aria-hidden="true">L</span>
            <div>
              <p className="promo-eyebrow">Almacén</p>
              <h1>Lo de Inés</h1>
            </div>
          </div>
          <IconButton
            className="promo-exit-icon"
            aria-label="Volver al sistema"
            onClick={onExit}
          >
            <CloseRoundedIcon />
          </IconButton>
        </header>

        <section className="promo-content" aria-label="Productos destacados">
          <div className="promo-intro">
            <span className="promo-kicker">Elegidos para vos</span>
            <h2>Algo rico para hoy</h2>
            <p>Descubrí nuestros productos destacados.</p>
          </div>

          <div className="promo-stage">
            <IconButton
              className="promo-arrow promo-arrow-left"
              aria-label="Producto anterior"
              onClick={() => showItem(activeIndex - 1)}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>

            <article className="promo-card" key={activeItem.image}>
              <div className="promo-image-wrap">
                <span className="promo-category">{activeItem.category}</span>
                <img src={activeItem.image} alt={activeItem.title} />
                <span className="promo-image-glow" aria-hidden="true" />
              </div>

              <div className="promo-details">
                <span className="promo-item-count">
                  PRODUCTO {String(activeIndex + 1).padStart(2, "0")} / {items.length}
                </span>
                <h3>{activeItem.title}</h3>
                <p className={activeItem.price ? "promo-price" : "promo-price promo-price-missing"}>
                  {activeItem.price !== undefined
                    ? `$ ${activeItem.price}`
                    : "Consultar precio en caja"}
                </p>
                <span className="promo-price-caption">
                  {activeItem.price !== undefined ? "Precio en pesos uruguayos" : "Precio sujeto a consulta"}
                </span>
              </div>
            </article>

            <IconButton
              className="promo-arrow promo-arrow-right"
              aria-label="Producto siguiente"
              onClick={() => showItem(activeIndex + 1)}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </div>

          <div className="promo-controls">
            <div className="promo-dots" aria-label="Seleccionar producto">
              {items.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  className={`promo-dot${index === activeIndex ? " is-active" : ""}`}
                  aria-label={`Mostrar ${item.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => showItem(index)}
                />
              ))}
            </div>
            <span className="promo-autoplay-status">
              {autoPaused ? "Pausa breve" : "Avance automático"}
            </span>
          </div>
        </section>

        <footer className="promo-footer">
          <span>Fraile Muerto · Cerro Largo</span>
          <button type="button" className="promo-return" onClick={onExit}>
            Volver al sistema <ChevronRightRoundedIcon fontSize="small" />
          </button>
        </footer>
      </div>
    </main>
  );
}
