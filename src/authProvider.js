import { MsalAuthProvider, LoginType } from "react-aad-msal";

// Msal Configurations
const config = {
  auth: {
    authority:
      "https://login.microsoftonline.com/92e84ceb-fbfd-47ab-be52-080c6b87953f/",
    clientId: "285ab54d-3f46-4c6b-847a-94254d2a3189",
    // redirectUri: 'https://acc.digitalprojectmanagement.ericsson.net/',
    // redirectUri: 'https://localhost:3000'
    redirectUri: window.location.origin,
    // redirectUri: 'https://digitalprojectmanagement.ericsson.net/bam-sg',
    // validateAuthority: true,
    // After being redirected to the "redirectUri" page, should user
    // be redirected back to the Url where their login originated from?
    // navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

// Authentication Parameters
const authenticationParameters = {
  scopes: ["user.read.all"],
};

// Options
const options = {
  loginType: LoginType.Redirect,
  tokenRefreshUri: window.location.origin,
};

export const authProvider = new MsalAuthProvider(
  config,
  authenticationParameters,
  options
);
