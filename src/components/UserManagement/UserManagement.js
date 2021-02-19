import Keycloak from 'keycloak-js';

const userManagerConfig = {
  url: 'https://accounts.kab.info/auth',
  realm: 'main',
  clientId: 'trl', // TODO: Replace trl with ...
  scope: 'profile',
  enableLogging: true,
};

export const kc = new Keycloak(userManagerConfig);

kc.onTokenExpired = () => {
  console.debug(' -- Renew token -- ');
  renewToken(0);
};

kc.onAuthLogout = () => {
  console.debug('-- Detect clearToken --');
  kc.logout();
};

const renewToken = (retry) => {
  kc.updateToken(70)
    .then(refreshed => {
      if (refreshed) {
        console.debug('-- Refreshed --');
      } else {
        console.warn('Token is still valid?..');
      }
    })
    .catch(err => {
      retry++;
      if (retry > 5) {
        console.error('Refresh retry: failed');
        console.debug('-- Refresh Failed --');
        kc.clearToken();
      } else {
        setTimeout(() => {
          console.error('Refresh retry: ' + retry);
          renewToken(retry);
        }, 10000);
      }
    });
};

const checkPermissions = (user) => {
  const gxy_group = kc.hasRealmRole('trl_user'); // TODO: change trl_user to ...
  if (gxy_group) {
    delete user.roles;
    user.role = 'user';
    return user;
  } else {
    alert('Access denied!');
    kc.logout();
    return null;
  }
};

export const getUser = (callback) => {
  kc.init({ onLoad: 'check-sso', checkLoginIframe: false, flow: 'standard', pkceMethod: 'S256' })
    .then(authenticated => {
      if (authenticated) {
        const { realm_access: { roles }, sub, given_name, name, email } = kc.tokenParsed;

        const user = checkPermissions({ id: sub, title: given_name, username: given_name, name, email, roles });
        callback(user);
      } else {
        callback(null);
      }
    }).catch((err) => console.log(err));
};
