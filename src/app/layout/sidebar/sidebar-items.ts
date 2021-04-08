import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Administração',
    moduleName: 'administracao',
    icon: 'fas fa-tachometer-alt',
    class: 'menu-toggle',
    groupTitle: false,
    submenu: [
      {
        path: 'administracao/campeonato',
        title: 'Campeonato',
        moduleName: 'administracao',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      },
      {
        path: 'administracao/bolao',
        title: 'Bolão',
        moduleName: 'administracao',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      },
      {
        path: 'administracao/time',
        title: 'Time',
        moduleName: 'administracao',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      }
    ]
  },
  {
    path: 'campeonato',
    title: 'Campeonatos',
    moduleName: 'campeonato',
    icon: 'fas fa-trophy',
    class: '',
    groupTitle: false,
    submenu: []
  },
  {
    path: 'bolao',
    title: 'Bolões',
    moduleName: 'bolao',
    icon: 'fas fa-futbol',
    class: '',
    groupTitle: false,
    submenu: []
  }

];
