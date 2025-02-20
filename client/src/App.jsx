import { useState } from 'react'
import './App.css'
import HomeComponent from './routes/Home'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Donation from './routes/Donation';
import Request from './routes/Request';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <div className='w-full min-h-screen flex justify-center items-center'>
        <BrowserRouter>
          <Routes>
            <>
              <Route path="/" element={<HomeComponent/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/donate" element={<Donation />} />
              <Route path="/request" element={<Request />} />
            </>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
