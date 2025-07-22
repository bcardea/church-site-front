import { useState, useEffect } from 'react';
import ContentBlockEditor from './ContentBlockEditor';

function PageForm({ item, onSave, onCancel }) {
  const isEditing = !!item;
      const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content_blocks: [],
    // Add other page fields here
  });

  useEffect(() => {
    if (item) {
      let blocks = item.content_blocks || [];
      if (typeof blocks === 'string') {
        try {
          blocks = JSON.parse(blocks);
        } catch (err) {
          blocks = [];
        }
      }
      setFormData({
        ...item,
        content_blocks: blocks, // Ensure content_blocks is an array
      });
    }
  }, [item]);

  const handleChange = (e) => {
        const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    onSave(formData);
    // setLoading(false) will be handled by the parent component closing the modal
  };

  return (
    <form onSubmit={handleSave}>
       <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
                <ContentBlockEditor 
          blocks={formData.content_blocks}
          onChange={(newBlocks) => setFormData(prev => ({ ...prev, content_blocks: newBlocks }))}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4">
        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Page')}</button>
      </div>
    </form>
  );
}

export default PageForm;
