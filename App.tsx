import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AdWizard from './components/AdWizard';
import CreativeStudio from './components/CreativeStudio';
import TrendScout from './components/TrendScout';
import ProductAnalyzer from './components/ProductAnalyzer';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AD_WIZARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.AD_WIZARD:
        return <AdWizard />;
      case AppView.CREATIVE_STUDIO:
        return <CreativeStudio />;
      case AppView.TREND_SCOUT:
        return <TrendScout />;
      case AppView.PRODUCT_ANALYZER:
        return <ProductAnalyzer />;
      default:
        return <AdWizard />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;