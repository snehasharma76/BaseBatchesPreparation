import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TimerProvider } from './context/TimerContext';


// Pages
import Home from './pages/Home';
import Timer from './pages/Timer';
import Challenge from './pages/Challenge';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';


function App() {

  useEffect(() => {
    sdk.actions.ready();
}, []);


  return (
    <TimerProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-neo-red overflow-x-hidden">
          <Header />
          <main className="flex-grow flex items-center justify-center w-full px-4 pt-16 pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/challenge" element={<Challenge />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TimerProvider>
  );
}

export default App;
