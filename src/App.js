import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Messages from './pages/Messages';
import SimplexMethod from './pages/SimplexMethod';
import GraphicalMethod from './pages/GraphicalMethod';
import TransportationMethod from './pages/TransportationMethod';
import LinearProgramming from './pages/LinearProgramming';
import NonLinearProgramming from './pages/NonLinearProgramming';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/simplex-method" element={<SimplexMethod />} />
            <Route path="/graphical-method" element={<GraphicalMethod />} />
            <Route path="/transportation-method" element={<TransportationMethod />} />
            <Route path="/linear-programming" element={<LinearProgramming />} />
            <Route path="/non-linear-programming" element={<NonLinearProgramming />} />
          </Routes>
        </main>
        <Footer />
      </>
    </ThemeProvider>
  );
}

export default App; 