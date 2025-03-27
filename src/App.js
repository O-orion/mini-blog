import './App.css';

import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import About from './pages/about/About';
import Navbar from './components/navbar/Navbar';
import Foooter from './components/footer/Foooter';

function App() {

  return (

    <div className="App">

      <BrowserRouter >
        <Navbar />
          <div className='container' >
            <Routes>
              <Route  path="/" element={ <Home /> } />
              <Route  path="/about" element={ <About /> } />
            </Routes>
          </div>
        <Foooter />
      </BrowserRouter>
    </div>

  );
}

export default App;
