import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGenre } from '../services/genreService';
import type { GenreFormData } from '../services/genreService';
import InputField from '../components/form/InputField';
import TextareaField from '../components/form/TextareaField';
import Button from '../components/Button';

export default function AddGenre() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GenreFormData>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Genre name is required');
      return;
    }

    setLoading(true);
    try {
      await createGenre(formData);
      navigate('/genres');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create genre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Genre</h1>
        <Button onClick={() => navigate('/genres')} variant="secondary">
          Back to Genres
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <InputField
          label="Genre Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter genre name"
          required
        />

        <TextareaField
          label="Description (Optional)"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Enter genre description"
          rows={4}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Genre'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/genres')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
