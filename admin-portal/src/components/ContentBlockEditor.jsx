import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

function ContentBlockEditor({ blocks, onChange }) {
  const updateBlock = (index, newBlock) => {
    const newBlocks = blocks.map((b, i) => (i === index ? newBlock : b));
    onChange(newBlocks);
  };

  const handleFieldChange = (index, field, value) => {
    updateBlock(index, { ...blocks[index], [field]: value });
  };

  const addBlock = (type) => {
    let newBlock;
    switch (type) {
      case 'text_block':
        newBlock = { type: 'text_block', title: '', content: '' };
        break;
      case 'quote_block':
        newBlock = { type: 'quote_block', quote: '', attribution: '' };
        break;
      case 'profile_list':
        newBlock = { type: 'profile_list', title: '', profiles: [{ name: '', credentials: '' }] };
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

  const addProfile = (blockIndex) => {
    const block = blocks[blockIndex];
    const profiles = [...(block.profiles || []), { name: '', credentials: '' }];
    updateBlock(blockIndex, { ...block, profiles });
  };

  const removeProfile = (blockIndex, profileIndex) => {
    const block = blocks[blockIndex];
    const profiles = block.profiles.filter((_, i) => i !== profileIndex);
    updateBlock(blockIndex, { ...block, profiles });
  };

  const handleProfileChange = (blockIndex, profileIndex, field, value) => {
    const block = blocks[blockIndex];
    const profiles = block.profiles.map((p, i) => (i === profileIndex ? { ...p, [field]: value } : p));
    updateBlock(blockIndex, { ...block, profiles });
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900">Content Blocks</h4>
      {blocks.map((block, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-md space-y-4">
          {block.type === 'text_block' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <ReactQuill
                theme="snow"
                value={block.content}
                onChange={(content) => handleFieldChange(index, 'content', content)}
              />
            </div>
          )}

          {block.type === 'quote_block' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quote</label>
                <textarea
                  value={block.quote}
                  onChange={(e) => handleFieldChange(index, 'quote', e.target.value)}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attribution</label>
                <input
                  type="text"
                  value={block.attribution}
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
                  value={block.title}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {block.profiles &&
                block.profiles.map((profile, pIdx) => (
                  <div key={pIdx} className="p-3 border border-gray-100 rounded-md space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleProfileChange(index, pIdx, 'name', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Credentials</label>
                      <input
                        type="text"
                        value={profile.credentials}
                        onChange={(e) => handleProfileChange(index, pIdx, 'credentials', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => removeProfile(index, pIdx)}
                        className="text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Remove Profile
                      </button>
                    </div>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => addProfile(index)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Add Profile
              </button>
            </div>
          )}

          <div className="text-right">
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Remove Block
            </button>
          </div>
        </div>
      ))}

      <div className="space-x-4">
        <button
          type="button"
          onClick={() => addBlock('text_block')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          + Add Text Block
        </button>
        <button
          type="button"
          onClick={() => addBlock('quote_block')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          + Add Quote Block
        </button>
        <button
          type="button"
          onClick={() => addBlock('profile_list')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          + Add Profile List
        </button>
      </div>
    </div>
  );
}

export default ContentBlockEditor;
