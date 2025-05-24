
import React, { useState, createContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AskMePage } from './pages/AskMePage';
import { PsychologicalTestPage } from './pages/PsychologicalTestPage';
import { TestQuizPage } from './pages/TestQuizPage';
import { TestResultPage } from './pages/TestResultPage';
import { ContactExpertPage } from './pages/ContactExpertPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { User } from './types';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const authContextValue = useMemo(() => ({
    currentUser,
    login: (user: User) => setCurrentUser(user),
    logout: () => setCurrentUser(null),
  }), [currentUser]);

  // Simulate API_KEY for Gemini. In a real app, this would be in a .env file.
  // IMPORTANT: This is a placeholder. A real API key should NEVER be hardcoded in client-side code.
  // It's assumed process.env.API_KEY is set in the build/runtime environment.
  if (!process.env.API_KEY) {
    // In a real deployment, you'd ensure API_KEY is set.
    // For this example, we'll set a placeholder to allow UI to render.
    // The Gemini service will check and error if it's missing/invalid.
    (process.env as any).API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
    console.warn("API_KEY is not set. Using placeholder. Gemini features will not work without a valid key.");
  }


  return (
    <AuthContext.Provider value={authContextValue}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ask-me" element={<AskMePage />} />
            <Route path="/test" element={<PsychologicalTestPage />} />
            <Route path="/test/quiz" element={<TestQuizPage />} />
            <Route path="/test/results" element={<TestResultPage />} />
            <Route path="/contact-expert" element={<ContactExpertPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
