import { Auth0Context, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const deferred = (() => {
    const props = {};
    props.promise = new Promise((resolve) => props.resolve = resolve);
    return props;
  })();

// In-memory token cache
let cachedToken = null;
let cachedTokenExpiry = null;

export const getAccessToken = async () => {
    // If we have a cached token and it's not expired, return it
    if (cachedToken && cachedTokenExpiry && Date.now() < cachedTokenExpiry) {
        return cachedToken;
    }
    const getToken = await deferred.promise;
    const token = await getToken({detailedResponse: true});
    // Decode the JWT to get the expiry
    const decoded = parseJwt(token.id_token);
    cachedToken = token;
    cachedTokenExpiry = decoded && decoded.exp ? decoded.exp * 1000 : null;
    return token;
}

// Helper to decode JWT
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

const Auth0ProviderWithHistory = ({
  children,
}) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/auth/callback",
        audience: audience,
        scope: "openid profile email https://graph.microsoft.com/User.Read Mail.Send User.Read Mail.Read User.Read.All offline_access User.ReadWrite User.ReadBasic.All Mail.ReadWrite",
      }}
      onRedirectCallback={onRedirectCallback}
    >
        <Auth0Context.Consumer>
            {({getAccessTokenSilently}) => {
                deferred.resolve(getAccessTokenSilently)
                return children
            }}
        </Auth0Context.Consumer>
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
