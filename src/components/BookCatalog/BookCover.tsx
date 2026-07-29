import { motion } from "framer-motion";
import "./book.css";

interface Props {
  opened: boolean;
}

export default function BookCover({ opened }: Props) {
  return (
    <motion.div
      className="book-cover"
      initial={false}
      animate={{
        rotateY: opened ? -180 : 0,
      }}
      transition={{
        duration: 2,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      style={{
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Cara exterior */}
      <div className="cover-front">

        <div className="cover-frame">

          <div className="cover-logo">📖</div>

          <h1>ALMACÉN</h1>

          <h2>LO DE INÉS</h2>

          <p>Catálogo de Productos</p>

        </div>

      </div>

      {/* Cara interior */}
      <div className="cover-back">

        <div className="cover-back-content">

          <h3>Bienvenido</h3>

          <p>
            Descubra nuestra selección
            de productos.
          </p>

        </div>

      </div>

    </motion.div>
  );
}