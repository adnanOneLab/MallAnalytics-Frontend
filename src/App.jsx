import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import VisitorsList from "./VisitorsList";
import Dashboard from "./components/Dashboard";
import RegistrationForm from "./RegistrationForm";

// Sample user object for now
const user = {
  id: "u123",
  name: "John Doe",
  isSubscribed: true, // set true for subscribed users
};

const ProtectedRoute = ({ isAllowed, redirectTo, children }) => {
  return isAllowed ? children : <Navigate to={redirectTo} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAllowed={user.isSubscribed} redirectTo="/register-user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <ProtectedRoute isAllowed={user.isSubscribed} redirectTo="/register-user">
              <VisitorsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-user"
          element={
            <ProtectedRoute isAllowed={!user.isSubscribed} redirectTo="/">
              <RegistrationForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
