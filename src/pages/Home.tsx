import BookCard from "../components/BookCard";

const books = [
  { title: "React for Beginners", author: "Dan Abramov", image: "/books/react.jpg" },
  { title: "Learning TypeScript", author: "Boris Cherny", image: "/books/ts.jpg" },
];

export default function Home() {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map((book, i) => (
        <BookCard key={i} {...book} />
      ))}
    </div>
  );
}
