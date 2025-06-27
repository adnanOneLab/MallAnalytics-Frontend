import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingComponent from "../../components/LoadingComponent";

const LandingPage = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }

  return null;
};

export default LandingPage;
