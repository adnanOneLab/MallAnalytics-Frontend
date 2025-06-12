import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VisitorsList from './VisitorsList';
import Dashboard from './components/Dashboard';
import VisitorsProfile from './components/VisitorsProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visitors" element={<VisitorsList />} />
        <Route path="/visitors/:id" element={<VisitorsProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
