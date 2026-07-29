import { motion } from "framer-motion";
import { catalog } from "../../data/catalog";
import Page from "./Page";

interface Props {
  currentPage: number;
  turning: boolean;
}

export default function BookSpread({
  currentPage,
  turning,
}: Props) {
  const total = catalog.length;

  const current = catalog[currentPage % total];
  const next = catalog[(currentPage + 1) % total];

  return (
    <div className="book-spread">

      {/* Página izquierda */}
      <div className="left-page">
        <Page
          title={current.left.title}
          image={current.left.image}
        />
      </div>

      {/* Página siguiente (queda debajo) */}
      <div className="next-page">
        <Page
          title={next.left.title}
          image={next.left.image}
        />
      </div>

      {/* Hoja que gira */}
      <motion.div
        className="turning-page"
        animate={{
          rotateY: turning ? -180 : 0,
        }}
        transition={{
          duration: 1.15,
          ease: "easeInOut",
        }}
      >

        {/* Frente */}
        <div className="page-face front-face">
          <Page
            title={current.right.title}
            image={current.right.image}
          />
        </div>

        {/* Dorso */}
        <div className="page-face back-face" />

      </motion.div>

    </div>
  );
}