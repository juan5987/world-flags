import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  issuer: 'https://accounts.google.com',

  redirectUri: window.location.origin,

  clientId: '940816975774-g8706mu7polp8u9c6t97cfg6ovq1d1vq.apps.googleusercontent.com',

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,

};