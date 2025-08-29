import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function ContentBlockEditor({ blocks, onChange }) {
  const updateBlock = (index, newBlock) => {
    const newBlocks = blocks.map((b, i) => (i === index ? newBlock : b));
    onChange(newBlocks);
  };

  const handleFieldChange = (index, field, value) => {
    updateBlock(index, { ...blocks[index], [field]: value });
  };

  const moveBlock = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const addBlock = (type) => {
    let newBlock;
    switch (type) {
      case 'text_block':
        newBlock = { type: 'text_block', title: '', content: '' };
        break;
      case 'detail_list':
        newBlock = { type: 'detail_list', title: '', items: [{ term: '', description: '' }] };
        break;
      case 'faq':
        newBlock = { type: 'faq', title: '', questions: [{ question: '', answer: '' }] };
        break;
      case 'cta_block':
        newBlock = { type: 'cta_block', title: '', content: '', button_text: '', button_link: '' };
        break;
      case 'belief_list':
        newBlock = { type: 'belief_list', title: '', beliefs: [{ title: '', description: '', scripture: '' }] };
        break;
      case 'quote_block':
        newBlock = { type: 'quote_block', quote: '', attribution: '' };
        break;
      case 'profile_list':
        newBlock = { type: 'profile_list', title: '', profiles: [{ name: '', credentials: [''] }] };
        break;
      case 'numbered_list':
        newBlock = { type: 'numbered_list', title: '', items: [''] };
        break;
      case 'logo_block':
        newBlock = { type: 'logo_block', image_url: '', alt_text: '' };
        break;
      case 'image_gallery':
        newBlock = { type: 'image_gallery', images: [{ url: '', alt_text: '' }] };
        break;
      default:
        return;
    }
    onChange([...(blocks || []), newBlock]);
  };

  const removeBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const addArrayItem = (blockIndex, field, newItem) => {
    const block = blocks[blockIndex];
    const items = [...(block[field] || []), newItem];
    updateBlock(blockIndex, { ...block, [field]: items });
  };

  const removeArrayItem = (blockIndex, field, itemIndex) => {
    const block = blocks[blockIndex];
    const items = block[field].filter((_, i) => i !== itemIndex);
    updateBlock(blockIndex, { ...block, [field]: items });
  };

  const handleArrayItemChange = (blockIndex, field, itemIndex, itemField, value) => {
    const block = blocks[blockIndex];
    const items = block[field].map((item, i) => {
      if (i === itemIndex) {
        if (typeof item === 'string') {
          return value;
        }
        return { ...item, [itemField]: value };
      }
      return item;
    });
    updateBlock(blockIndex, { ...block, [field]: items });
  };

  const handleCredentialChange = (blockIndex, profileIndex, credIndex, value) => {
    const block = blocks[blockIndex];
    const profiles = [...block.profiles];
    const credentials = [...profiles[profileIndex].credentials];
    credentials[credIndex] = value;
    profiles[profileIndex] = { ...profiles[profileIndex], credentials };
    updateBlock(blockIndex, { ...block, profiles });
  };

  const addCredential = (blockIndex, profileIndex) => {
    const block = blocks[blockIndex];
    const profiles = [...block.profiles];
    const credentials = [...(profiles[profileIndex].credentials || []), ''];
    profiles[profileIndex] = { ...profiles[profileIndex], credentials };
    updateBlock(blockIndex, { ...block, profiles });
  };

  const removeCredential = (blockIndex, profileIndex, credIndex) => {
    const block = blocks[blockIndex];
    const profiles = [...block.profiles];
    const credentials = profiles[profileIndex].credentials.filter((_, i) => i !== credIndex);
    profiles[profileIndex] = { ...profiles[profileIndex], credentials };
    updateBlock(blockIndex, { ...block, profiles });
  };

  const getBlockTypeLabel = (type) => {
    const labels = {
      text_block: 'Text Block',
      detail_list: 'Detail List',
      faq: 'FAQ',
      cta_block: 'CTA Block',
      belief_list: 'Belief List',
      quote_block: 'Quote Block',
      profile_list: 'Profile List',
      numbered_list: 'Numbered List',
      logo_block: 'Logo Block',
      image_gallery: 'Image Gallery'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">Content Blocks</h4>
        {blocks && blocks.length > 0 && (
          <span className="text-sm text-gray-500">{blocks.length} blocks</span>
        )}
      </div>
      
      {blocks && blocks.map((block, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getBlockTypeLabel(block.type)}
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
                className={`text-sm ${index === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
                className={`text-sm ${index === blocks.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}`}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>

          {block.type === 'text_block' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <ReactQuill
                  theme="snow"
                  value={block.content || ''}
                  onChange={(content) => handleFieldChange(index, 'content', content)}
                />
              </div>
            </div>
          )}

          {block.type === 'detail_list' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {block.items && block.items.map((item, iIdx) => (
                <div key={iIdx} className="p-3 border border-gray-100 rounded-md space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Term</label>
                    <input
                      type="text"
                      value={item.term || ''}
                      onChange={(e) => handleArrayItemChange(index, 'items', iIdx, 'term', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => handleArrayItemChange(index, 'items', iIdx, 'description', e.target.value)}
                      rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'items', iIdx)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(index, 'items', { term: '', description: '' })}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Item
              </button>
            </div>
          )}

          {block.type === 'faq' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {block.questions && block.questions.map((q, qIdx) => (
                <div key={qIdx} className="p-3 border border-gray-100 rounded-md space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <input
                      type="text"
                      value={q.question || ''}
                      onChange={(e) => handleArrayItemChange(index, 'questions', qIdx, 'question', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Answer</label>
                    <textarea
                      value={q.answer || ''}
                      onChange={(e) => handleArrayItemChange(index, 'questions', qIdx, 'answer', e.target.value)}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'questions', qIdx)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Remove Question
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(index, 'questions', { question: '', answer: '' })}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Question
              </button>
            </div>
          )}

          {block.type === 'cta_block' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <ReactQuill
                  theme="snow"
                  value={block.content || ''}
                  onChange={(content) => handleFieldChange(index, 'content', content)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Button Text</label>
                <input
                  type="text"
                  value={block.button_text || ''}
                  onChange={(e) => handleFieldChange(index, 'button_text', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Button Link</label>
                <input
                  type="text"
                  value={block.button_link || ''}
                  onChange={(e) => handleFieldChange(index, 'button_link', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {block.type === 'belief_list' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {block.beliefs && block.beliefs.map((belief, bIdx) => (
                <div key={bIdx} className="p-3 border border-gray-100 rounded-md space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Belief Title</label>
                    <input
                      type="text"
                      value={belief.title || ''}
                      onChange={(e) => handleArrayItemChange(index, 'beliefs', bIdx, 'title', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={belief.description || ''}
                      onChange={(e) => handleArrayItemChange(index, 'beliefs', bIdx, 'description', e.target.value)}
                      rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scripture Reference</label>
                    <input
                      type="text"
                      value={belief.scripture || ''}
                      onChange={(e) => handleArrayItemChange(index, 'beliefs', bIdx, 'scripture', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'beliefs', bIdx)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Remove Belief
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(index, 'beliefs', { title: '', description: '', scripture: '' })}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Belief
              </button>
            </div>
          )}

          {block.type === 'quote_block' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quote</label>
                <textarea
                  value={block.quote || ''}
                  onChange={(e) => handleFieldChange(index, 'quote', e.target.value)}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attribution</label>
                <input
                  type="text"
                  value={block.attribution || ''}
                  onChange={(e) => handleFieldChange(index, 'attribution', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {block.type === 'profile_list' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {block.profiles && block.profiles.map((profile, pIdx) => (
                <div key={pIdx} className="p-3 border border-gray-100 rounded-md space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => handleArrayItemChange(index, 'profiles', pIdx, 'name', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credentials</label>
                    {profile.credentials && profile.credentials.map((cred, cIdx) => (
                      <div key={cIdx} className="flex mt-1 space-x-2">
                        <input
                          type="text"
                          value={cred}
                          onChange={(e) => handleCredentialChange(index, pIdx, cIdx, e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeCredential(index, pIdx, cIdx)}
                          className="text-xs font-medium text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addCredential(index, pIdx)}
                      className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Credential
                    </button>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'profiles', pIdx)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Remove Profile
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(index, 'profiles', { name: '', credentials: [''] })}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Profile
              </button>
            </div>
          )}

          {block.type === 'numbered_list' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {block.items && block.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{iIdx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayItemChange(index, 'items', iIdx, null, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'items', iIdx)}
                    className="text-xs font-medium text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(index, 'items', '')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Item
              </button>
            </div>
          )}

          {block.type === 'logo_block' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={block.image_url || ''}
                  onChange={(e) => handleFieldChange(index, 'image_url', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {block.image_url && (
                  <img src={block.image_url} alt={block.alt_text} className="mt-2 h-20 object-contain" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  type="text"
                  value={block.alt_text || ''}
                  onChange={(e) => handleFieldChange(index, 'alt_text', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {block.type === 'image_gallery' && (
            <div className="space-y-4">
              {block.images && block.images.map((img, imgIdx) => (
                <div key={imgIdx} className="p-3 border border-gray-100 rounded-md space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      value={img.url || ''}
                      onChange={(e) => handleArrayItemChange(index, 'images', imgIdx, 'url', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {img.url && (
                      <img src={img.url} alt={img.alt_text} className="mt-2 h-32 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                    <input
                      type="text"
                      value={img.alt_text || ''}
                      onChange={(e) => handleArrayItemChange(index, 'images', imgIdx, 'alt_text', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'images', imgIdx)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(index, 'images', { url: '', alt_text: '' })}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Image
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => addBlock('text_block')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Text Block
        </button>
        <button
          type="button"
          onClick={() => addBlock('detail_list')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Detail List
        </button>
        <button
          type="button"
          onClick={() => addBlock('faq')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + FAQ
        </button>
        <button
          type="button"
          onClick={() => addBlock('cta_block')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + CTA Block
        </button>
        <button
          type="button"
          onClick={() => addBlock('belief_list')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Belief List
        </button>
        <button
          type="button"
          onClick={() => addBlock('quote_block')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Quote Block
        </button>
        <button
          type="button"
          onClick={() => addBlock('profile_list')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Profile List
        </button>
        <button
          type="button"
          onClick={() => addBlock('numbered_list')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Numbered List
        </button>
        <button
          type="button"
          onClick={() => addBlock('logo_block')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Logo Block
        </button>
        <button
          type="button"
          onClick={() => addBlock('image_gallery')}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          + Image Gallery
        </button>
      </div>
    </div>
  );
}

export default ContentBlockEditor;