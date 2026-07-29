import "./book.css";

interface Props {
  title: string;
  image: string;
}

export default function Page({
  title,
  image,
}: Props) {
  return (
    <div className="page">

      <div className="page-content">

        <div className="image-container">
          <img
            src={image}
            alt={title}
            draggable={false}
          />
        </div>

        <div className="page-footer">

          <h2>{title}</h2>

          <span className="page-category">
            Almacén Lo de Inés
          </span>

        </div>

      </div>

    </div>
  );
}