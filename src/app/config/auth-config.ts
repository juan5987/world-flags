import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export function getAuthConfig(): AuthConfig {
  return {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.googleClientId,
    responseType: 'code',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false,
    customQueryParams: { access_type: 'offline' },
    showDebugInformation: !environment.production,
    usePkceWithAuthorizationCodeFlow: true,
    requireHttps: false,
  };
}