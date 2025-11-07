type Props = {
  title: string;
  author: string;
  image: string;
};

export default function BookCard({ title, author, image }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img src={image} alt={title} className="h-48 w-full object-cover mb-2 rounded" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{author}</p>
    </div>
  );
}
