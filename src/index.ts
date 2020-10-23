import { Router } from '@vaadin/router';
import '@vaadin/vaadin-lumo-styles/all-imports';

// eslint-disable-next-line import/extensions
import './global-styles';

const routes = [
  {
    path: '',
    component: 'vank-app',
    action: async () => { await import ('./views/main/vank-app'); },
    children: [
      {
        path: '',
        component: 'dashboard-view',
        action: async () => { await import ('./views/dashboard/dashboard-view'); }
      },
      {
        path: 'movement',
        component: 'add-movement-view',
        action: async () => { await import ('./views/movement/add-movement-view'); }
      }
    ]
  },
  {
    path: '/login',
    component: 'login-view',
    action: async () => { await import ('./views/login/login-view'); }
  }
];

export const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);
