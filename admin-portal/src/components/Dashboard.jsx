import { useState } from 'react';
import { supabase } from '../supabaseClient';
import HeroContentManager from './HeroContentManager';
import ConnectionCardsManager from './ConnectionCardsManager';
import PagesManager from './PagesManager';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('hero');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroContentManager />;
      case 'cards':
        return <ConnectionCardsManager />;
      case 'pages':
        return <PagesManager />;
      default:
        return <HeroContentManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Content Dashboard</h1>
            <nav className="flex space-x-4">
              <button onClick={() => setActiveTab('hero')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'hero' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}>Hero Content</button>
              <button onClick={() => setActiveTab('cards')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'cards' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}>Connection Cards</button>
              <button onClick={() => setActiveTab('pages')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'pages' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}>Pages</button>
            </nav>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
