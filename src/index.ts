import { Router } from '@vaadin/router';
import '@vaadin/vaadin-lumo-styles/all-imports';
import '../../src/global-styles.js';

const routes = [
  {
    path: '',
    component: 'vank-app',
    action: async () => {
      await import('./views/main/vank-app');
    },
    children: [
      {
        path: '',
        params: '',
        component: 'dashboard-view',
        action: async () => {
          await import('./views/dashboard/dashboard-view');
        },
      },
      {
        path: 'movement',
        component: 'add-movement-view',
        action: async () => {
          await import('./views/movement/add-movement-view');
        },
      },
      {
        path: 'movement-other',
        component: 'add-movement-others-view',
        action: async () => {
          await import('./views/movement/add-movement-others-view');
        },
      },
      {
        path: 'account',
        component: 'add-account-view',
        action: async () => {
          await import('./views/account/add-account-view');
        },
      },
    ],
  },
  {
    path: '/login',
    component: 'login-view',
    action: async () => {
      await import('./views/login/login-view');
    },
  },
  {
    path: '/signup',
    component: 'signup-view',
    action: async () => {
      await import('./views/signup/signup-view');
    },
  },
];

export const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);
