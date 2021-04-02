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
        path: 'dashboard/dashboard2',
        title: 'Bolão',
        moduleName: 'dashboard',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        submenu: []
      },
      {
        path: 'dashboard/dashboard3',
        title: 'Jogo',
        moduleName: 'dashboard',
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
