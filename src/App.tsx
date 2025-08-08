import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/components';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Scans from './pages/Scans';
import NewScan from './pages/NewScan';
import ScanResult from './pages/ScanResult';
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
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scans" element={<Scans />} />
              <Route path="/scans/new" element={<NewScan />} />
              <Route path="/scans/:id/result" element={<ScanResult />} />
              <Route path="*" element={<Dashboard />} />
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
