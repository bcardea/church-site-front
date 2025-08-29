import { useState, useEffect } from 'react';
import ContentBlockEditor from './ContentBlockEditor';
import { supabase } from '../supabaseClient';

function PageForm({ item, onSave, onCancel }) {
  const isEditing = !!item;
      const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    image_url: '',
    template: 'TemplateA',
    cta_button_text: '',
    cta_button_link: '',
    accent_color: '#000000',
    content_blocks: [],
  });
  const [uploading, setUploading] = useState(false);

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
        title: item.title || '',
        slug: item.slug || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        image_url: item.image_url || '',
        template: item.template || 'TemplateA',
        cta_button_text: item.cta_button_text || '',
        cta_button_link: item.cta_button_link || '',
        accent_color: item.accent_color || '#000000',
        content_blocks: blocks, // Ensure content_blocks is an array
      });
    }
  }, [item]);

  const handleChange = (e) => {
        const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) {
      alert('Error uploading file: ' + error.message);
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    }
    setUploading(false);
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
          <label className="block text-sm font-medium text-gray-700">Subtitle</label>
          <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {uploading && <p>Uploading...</p>}
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Preview"
              className="mt-4 h-32 w-full object-contain rounded-md border border-gray-200"
            />
          )}
          <input type="hidden" name="image_url" value={formData.image_url} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Template</label>
          <select
            name="template"
            value={formData.template}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="TemplateA">TemplateA</option>
            <option value="TemplateB">TemplateB</option>
            <option value="TemplateC">TemplateC</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Button Text</label>
            <input type="text" name="cta_button_text" value={formData.cta_button_text} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Button Link</label>
            <input type="text" name="cta_button_link" value={formData.cta_button_link} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Accent Color</label>
          <input type="color" name="accent_color" value={formData.accent_color} onChange={handleChange} className="mt-1 block w-full h-10 px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
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
