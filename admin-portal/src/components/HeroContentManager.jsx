import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Modal from './Modal';
import HeroForm from './HeroForm';

function HeroContentManager() {
  const [heroContent, setHeroContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('hero_content').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setHeroContent(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('hero_content').delete().eq('id', id);
      if (error) {
        alert(error.message);
      } else {
        fetchHeroContent();
      }
    }
  };

  const handleSave = async (formData) => {
    const { id, ...data } = formData;
    let error;
    if (id) {
      // Update
      ({ error } = await supabase.from('hero_content').update(data).eq('id', id));
    } else {
      // Insert
      ({ error } = await supabase.from('hero_content').insert(data));
    }

    if (error) {
      alert(error.message);
    } else {
      fetchHeroContent();
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  if (loading) {
    return <p>Loading hero content...</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Hero Content</h2>
        <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Add New</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {heroContent.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subtitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.is_active ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Hero Content' : 'Add Hero Content'}>
        <HeroForm item={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default HeroContentManager;
