import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function EmailAllowlistManager() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchAllowedEmails();
  }, []);

  const fetchAllowedEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('allowed_emails')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      alert('Error loading email list: ' + error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const addEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('allowed_emails')
        .insert([{ email: newEmail.toLowerCase().trim() }])
        .select()
        .single();

      if (error) throw error;
      
      setEmails([data, ...emails]);
      setNewEmail('');
      alert('Email added successfully!');
    } catch (error) {
      console.error('Error adding email:', error);
      if (error.code === '23505') {
        alert('This email is already in the allowlist.');
      } else {
        alert('Error adding email: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleEmailStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('allowed_emails')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setEmails(emails.map(email => 
        email.id === id ? { ...email, is_active: !currentStatus } : email
      ));
    } catch (error) {
      console.error('Error updating email status:', error);
      alert('Error updating email status: ' + error.message);
    }
  };

  const removeEmail = async (id) => {
    if (!confirm('Are you sure you want to remove this email from the allowlist?')) return;

    try {
      const { error } = await supabase
        .from('allowed_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmails(emails.filter(email => email.id !== id));
      alert('Email removed successfully!');
    } catch (error) {
      console.error('Error removing email:', error);
      alert('Error removing email: ' + error.message);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading email allowlist...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Allowlist Manager</h2>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Only emails in this list can access the admin portal using magic link authentication. 
          Make sure to add your own email before testing!
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Email</h3>
        <form onSubmit={addEmail} className="flex gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white font-medium rounded-md ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? 'Adding...' : 'Add Email'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Allowed Emails ({emails.length})
        </h3>
        
        {emails.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No emails in the allowlist. Add some emails above to get started.
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {emails.map((email) => (
                <li key={email.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div>
                        <p className={`text-sm font-medium ${
                          email.is_active ? 'text-gray-900' : 'text-gray-400 line-through'
                        }`}>
                          {email.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Added {new Date(email.added_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        email.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {email.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleEmailStatus(email.id, email.is_active)}
                        className={`text-sm font-medium ${
                          email.is_active 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {email.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => removeEmail(email.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailAllowlistManager;