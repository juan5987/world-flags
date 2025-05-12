import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  issuer: 'https://accounts.google.com',

  redirectUri: window.location.origin,

  clientId: '', // TODO: Add client id

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,

};