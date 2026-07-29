import { CatalogItem } from "../../models/CatalogItem";
import "./book.css";

interface Props {
  item: CatalogItem;
}

export default function BookPage({ item }: Props) {
  return (
    <div className="book-page">
      <h2>{item.name}</h2>

      <img src={item.image} alt={item.name} />

      <span>{item.category}</span>
    </div>
  );
}