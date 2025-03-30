import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Foooter'; // Corrigido "Foooter" para "Footer"
import Login from './pages/login/Login';
import Registro from './pages/register/Registro';
import Profile from './pages/profile/Profile';
import PostDetails from './components/PostDetails/PostDetails'
import NavigatePage from './pages/navegar/Navegar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Registro />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-posts" element={<Home />} />
            <Route path="/navegar" element={<NavigatePage />} />
            <Route path="/post/:postId" element={<PostDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;