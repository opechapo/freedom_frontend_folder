// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VapiWidget } from "@vapi-ai/client-sdk-react";
import "./Styles/VapiWidget.css";
import { ThemeProvider } from "./Themes/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./Pages/About";
import Header from "./Components/Header";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Services from "./Pages/Services";
import FAQ from "./Pages/FAQ";
import Contact from "./Pages/Contact";
import License from "./Pages/License";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
          {/* Header is now global - visible on all pages */}
          <Header />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/license" element={<License />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>

          {/* RESPONSIVE + COMPACT VAPI WIDGET */}
          <VapiWidget
            className="z-30 fixed bottom-4 right-10 md:bottom-4 md:right-10 lg:bottom-4 lg:right-10"
            publicKey="6aee3d91-1969-4e06-afc6-cc7d9a7567a6"
            assistantId="3d712d14-faa8-4767-907b-0eebbf37887f"
            mode="hybrid"
            position="bottom-right"
            theme="dark"
            size="compact"
            accentColor="#1E88E5"
            ctaTitle="" // Empty = hides text
            ctaSubtitle="" // Empty = hides subtitle
            startButtonText="📈" // Best icon for trading platform
            title="TradeNixPro AI"
            chatFirstMessage="Hey, How can I help you today?"
            chatPlaceholder="Ask about Trading or book a call..."
            voiceShowTranscript={true}
          />

          <ToastContainer
            position="top-right"
            theme="colored"
            autoClose={3000}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
