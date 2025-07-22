import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

function ContentBlockEditor({ blocks, onChange }) {
  const handleBlockChange = (content, index) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], content };
    onChange(newBlocks);
  };

  const addBlock = (type = 'text') => {
    const newBlock = { type, content: '' };
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900">Content Blocks</h4>
      {blocks.map((block, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-md">
          {block.type === 'text' && (
            <ReactQuill
              theme="snow"
              value={block.content}
              onChange={(content) => handleBlockChange(content, index)}
            />
          )}
          <div className="text-right mt-2">
            <button type="button" onClick={() => removeBlock(index)} className="text-sm font-medium text-red-600 hover:text-red-800">Remove Block</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => addBlock('text')} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">+ Add Text Block</button>
    </div>
  );
}

export default ContentBlockEditor;
