import './App.scss';
import { Routes, Route} from 'react-router-dom'
import Layout from './components/Layout';
import Home from './components/Home';
import Camera from './components/Camera'


function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' index element={<Home/>} />
        <Route path='/classify' index element={<Camera/>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
