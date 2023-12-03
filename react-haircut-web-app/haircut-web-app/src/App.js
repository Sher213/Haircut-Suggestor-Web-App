import './App.scss';
import { Routes, Route} from 'react-router-dom'
import Layout from './components/Layout';
import Home from './components/Home';
import Classification from './components/Classification';
import HairCutRecommendations from './components/HairCutRecommendations';


function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' index element={<Home/>} />
        <Route path='/classify' index element={<Classification/>} />
        <Route path='/recommendations' index element={<HairCutRecommendations/>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
