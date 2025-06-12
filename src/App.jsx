import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VisitorsList from './VisitorsList';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visitors" element={<VisitorsList />} />
      </Routes>
    </Router>
  );
}

export default App;
