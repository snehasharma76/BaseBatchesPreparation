import React from 'react';

const Header = () => {
  return (
    <header className="mb-8">
      <div className="sleek-card-primary relative overflow-hidden">
        {/* Decorative elements - pastel circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pastel-blue rounded-full opacity-40 blur-sm"></div>
        <div className="absolute top-10 -right-4 w-16 h-16 bg-pastel-purple rounded-full opacity-40 blur-sm"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-pastel-pink rounded-full opacity-30 blur-sm"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">ReadMe</h1>
              <p className="mt-2 text-gray-600 max-w-md">
                Search and discover crypto conversations from Farcaster
              </p>
            </div>
            
            <div className="sleek-card py-2 px-4 self-start">
              <div className="text-sm font-medium">
                Powered by <a href="https://neynar.com" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-800 transition-colors">Neynar</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
