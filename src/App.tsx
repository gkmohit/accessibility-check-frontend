import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/components';
import Header from './components/Header';
import { Landing } from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Scans from './pages/Scans';
import NewScan from './pages/NewScan';
import ScanResult from './pages/ScanResult';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Support } from './pages/Support';
import 'react-toastify/dist/ReactToastify.css';

const theme = {
  // Add theme configuration if needed
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<><Header /><Dashboard /></>} />
              <Route path="/scans" element={<><Header /><Scans /></>} />
              <Route path="/scans/new" element={<><Header /><NewScan /></>} />
              <Route path="/scans/:id/result" element={<><Header /><ScanResult /></>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
