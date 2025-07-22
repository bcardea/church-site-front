import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function HeroForm({ item, onSave, onCancel }) {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    cta_text: '',
    cta_url: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

    const handleUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) {
      alert('Error uploading file: ' + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    }
    setUploading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    onSave(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subtitle</label>
          <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
                <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" onChange={handleUpload} disabled={uploading} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          {uploading && <p>Uploading...</p>}
          {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-4 h-32 w-full object-contain rounded-md border border-gray-200" />}
          <input type="hidden" name="image_url" value={formData.image_url} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Text</label>
          <input type="text" name="cta_text" value={formData.cta_text} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CTA URL</label>
          <input type="text" name="cta_url" value={formData.cta_url} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <label className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Hero')}</button>
      </div>
    </form>
  );
}

export default HeroForm;
