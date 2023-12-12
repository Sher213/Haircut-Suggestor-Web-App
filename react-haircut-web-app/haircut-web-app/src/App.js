import './App.scss';
import { Routes, Route} from 'react-router-dom'
import Layout from './components/Layout';
import Home from './components/Home';
import Classification from './components/Classification';
import HairCutRecommendations from './components/HairCutRecommendations';
import FindBarbers from './components/FindBarbers';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  return (
    <>
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' index element={<Home/>} />
        <Route path='/classify' index element={<Classification/>} />
        <Route path='/recommendations' index element={<HairCutRecommendations/>} />
        <Route path='/local-haircuts' index element={<FindBarbers/>} />
        <Route path='/terms' index element={<TermsOfService/>} />
        <Route path='/privacy' index element={<PrivacyPolicy/>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
