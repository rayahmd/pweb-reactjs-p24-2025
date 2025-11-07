import { useParams } from "react-router-dom";

export default function BookDetail() {
  const { id } = useParams();

  // sementara dummy data
  const book = {
    id,
    title: "Learning React",
    author: "Alex Banks",
    description:
      "Panduan lengkap mempelajari React.js untuk pengembangan web modern.",
    image: "/books/react.jpg",
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-80 object-cover rounded-lg shadow"
      />
      <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
      <p className="text-gray-600 mb-2">by {book.author}</p>
      <p className="text-gray-700">{book.description}</p>

      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Pinjam Buku
      </button>
    </div>
  );
}
