import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leases from './pages/Leases';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="leases" element={<Leases />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
