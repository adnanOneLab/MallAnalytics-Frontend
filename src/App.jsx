import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import VisitorsList from "./pages/visitors/VisitorsList";
import Dashboard from "./pages/dashboard/Dashboard";
import RegistrationForm from "./pages/registration/RegistrationForm";
import SuccessScreen from "./pages/registration/SuccessScreen";
import VisitorsProfile from "./pages/visitors/VisitorsProfile";
import VisitorMovements from "./pages/visitors/VisitorMovements";
import CampaignTable from "./pages/campaigns/Campaigns";

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
            <ProtectedRoute
              isAllowed={user.isSubscribed}
              redirectTo="/register-user"
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <ProtectedRoute
              isAllowed={user.isSubscribed}
              redirectTo="/register-user"
            >
              <VisitorsList />
            </ProtectedRoute>
          }
        />

        <Route path="/visitors/:user_id" element={<VisitorsProfile />} />
        <Route
          path="/register-user"
          element={
            <ProtectedRoute isAllowed={user.isSubscribed} redirectTo="/">
              <RegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route path="/registration-success" element={<SuccessScreen />} />
        <Route path="/registration-success/:userId" element={<SuccessScreen />} />
        <Route path="/visits/:visit_id" element={<VisitorMovements />} />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute
              isAllowed={user.isSubscribed}
              redirectTo="/register-user"
            >
              <CampaignTable />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
