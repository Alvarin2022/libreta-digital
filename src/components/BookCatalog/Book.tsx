import { useEffect, useState } from "react";
import BookSpread from "./BookSpread";
import BookCover from "./BookCover";

export default function Book() {
  const [opened, setOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [turning, setTurning] = useState(false);

  // Apertura del libro
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpened(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Paso automático de páginas
  useEffect(() => {
    if (!opened) return;

    const interval = setInterval(() => {
      setTurning(true);

      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setTurning(false);
      }, 1200);
    }, 6000);

    return () => clearInterval(interval);
  }, [opened]);

  return (
    <div className="book">

      {/* Bordes del libro */}
      <div className="book-top-edge" />
      <div className="book-bottom-edge" />
      <div className="book-right-edge" />

      {/* Lomo */}
      <div className="book-spine" />

      {/* Portada */}
      <BookCover opened={opened} />

      {/* Páginas */}
      {opened && (
        <BookSpread
          currentPage={currentPage}
          turning={turning}
        />
      )}

    </div>
  );
}