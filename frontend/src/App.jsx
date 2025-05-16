import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntroPage from './pages/IntroPage';

import './App.css';
import SignUp from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/Forget-password';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgetpass" element={<ForgotPassword/>} />
       
      </Routes>
    </Router>
  );
}

export default App;