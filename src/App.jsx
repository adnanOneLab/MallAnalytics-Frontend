import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import VisitorsList from "./pages/visitors/VisitorsList";
import Dashboard from "./pages/dashboard/Dashboard";
import RegistrationForm from "./pages/registration/RegistrationForm";
import SuccessScreen from "./pages/registration/SuccessScreen";
import VisitorsProfile from "./pages/visitors/VisitorsProfile";
import VisitorMovements from "./pages/visitors/VisitorMovements";
import CampaignTable from "./pages/campaigns/Campaigns";
import CampaignManagement from "./pages/campaigns/CampaignManagement";
import Auth0ProviderWithHistory from "./context/auth0-provider-with-history";
import { useAuth0 } from "@auth0/auth0-react";
import UserAccessDenied from "./components/UserAccessDenied";
import LoadingComponent from "./components/LoadingComponent";
import { useEffect, useState } from "react";
import { getUser } from "./services/userService";
import React from "react";
import LandingPage from "./pages/landing/LandingPage";

const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === "true";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  React.useEffect(() => {
    if (!isAuthDisabled && !isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthDisabled, isLoading, isAuthenticated, loginWithRedirect]);

  if (isAuthDisabled) {
    return children;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

const AppContent = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getUser().then((user) => {
        setUserProfile(user);
        setIsProfileLoading(false);
      }).catch((error) => {
        console.error("Error fetching user profile:", error);
        setIsProfileLoading(false);
      }).finally(() => {
        setIsProfileLoading(false);
      });
    }
  }, [isAuthenticated]);

  if (isLoading || (isAuthenticated && isProfileLoading)) {
    return <LoadingComponent />;
  }

  if (isAuthenticated && !userProfile?.email) {
    return <UserAccessDenied email={userProfile?.email} name={userProfile?.name} />;
  }

  return (
    <Routes>
      <Route path="/auth/callback" element={<LandingPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <VisitorsList />
          </ProtectedRoute>
        }
      />
      <Route path="/visitors/:user_id" element={<VisitorsProfile />} />
      <Route
        path="/register-user"
        element={
            <RegistrationForm />
        }
      />
      <Route path="/registration-success" element={<SuccessScreen />} />
      <Route path="/registration-success/:userId" element={<SuccessScreen />} />
      <Route path="/visits/:visit_id" element={<VisitorMovements />} />
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <CampaignTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns/:id/manage"
        element={
          <ProtectedRoute>
            <CampaignManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Auth0ProviderWithHistory>
        <AppContent />
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;
