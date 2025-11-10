import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGenres, deleteGenre } from '../services/genreService';
import type { Genre } from '../services/genreService';
import Button from '../components/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/StateMessage';

export default function Genres() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getAllGenres();
      setGenres(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch genres');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete genre "${name}"?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteGenre(id);
      setGenres((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete genre');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return <LoadingState title="Loading genres..." />;
  }

  if (error) {
    return (
      <ErrorState title="Error" description={error} action={<Button onClick={fetchGenres}>Try Again</Button>} />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Genres</h1>
        <Button onClick={() => navigate('/genres/add')}>Add New Genre</Button>
      </div>

      {genres.length === 0 ? (
        <EmptyState title="No genres found" description="Create your first genre to get started" action={<Button onClick={() => navigate('/genres/add')}>Add First Genre</Button>} />
      ) : (
        <div className="grid gap-4">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {genre.name}
                  </h2>
                  {genre.description && (
                    <p className="text-gray-600 mb-3">{genre.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {genre._count?.books || 0} books
                    </span>
                    <span>
                      Created: {new Date(genre.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/genres/${genre.id}/edit`)}
                    className="text-sm py-2 px-4"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(genre.id, genre.name)}
                    disabled={deleteLoading === genre.id}
                    className="text-sm py-2 px-4"
                  >
                    {deleteLoading === genre.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
