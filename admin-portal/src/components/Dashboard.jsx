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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-white tracking-wide">Content Dashboard</h1>
            <nav className="flex space-x-2">
              <button onClick={() => setActiveTab('hero')} className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'hero' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'}`}>Hero</button>
              <button onClick={() => setActiveTab('cards')} className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'cards' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'}`}>Cards</button>
              <button onClick={() => setActiveTab('pages')} className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'pages' ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'}`}>Pages</button>
            </nav>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white font-medium py-1.5 px-4 rounded-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
