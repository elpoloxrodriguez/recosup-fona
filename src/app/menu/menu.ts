import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard/home',
    nombre: 'Principal',
    // role: ['0','9'], 
    icono: 'home',
    type: 'item',
    url: 'home',
  },
  // Empresa
  {
    id: 'RegistroContribuyente',
    nombre: 'Empresa',
    title: 'Empresa',
    role: ['0'],
    type: 'collapsible',
    icono: 'file-text',
    children: [
      {
        id: 'GestionInscripcion',
        nombre: 'Gestion Inscripción',
        type: 'item',
        icono: 'circle',
        url: 'taxpayer-record/registration-management'
      },
      {
        id: 'DeclaracionPagos',
        nombre: 'Declaracion y Pagos',
        type: 'item',
        icono: 'circle',
        url: 'taxpayer-record/declaration-payments'
      },
      {
        id: 'MultasVigentes',
        nombre: 'Multas Vigentes',
        type: 'item',
        icono: 'circle',
        url: 'taxpayer-record/current-fines'
      }
    ]
  },
  // Documentacion
  {
    id: 'DocumentacionDigital',
    nombre: 'Documentacion Digital',
    title: 'Documentacion Digital',
    role: ['9','1','2','3','4'],
    type: 'collapsible',
    icono: 'folder-plus',
    children: [
      {
        id: 'contribuyentes',
        nombre: 'Contribuyentes',
        type: 'item',
        icono: 'circle',
        url: 'digital-documentation/taxpayers'
      },
      // {
      //   id: 'comunicaciones',
      //   nombre: 'Comunicaciones',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'digital-documentation/communications'
      // }
    ]
  },
  // Recaudacion
  {
    id: 'Recaudacion',
    nombre: 'Recaudacion',
    title: 'Recaudacion',
    type: 'collapsible',
    role: ['9','1'],
    icono: 'check-circle',
    children: [
      {
        id: 'contribuyentes',
        nombre: 'Empresas Contribuyentes',
        type: 'item',
        icono: 'circle',
        url: 'financial-collection/contributing-companies'
      },
      {
        id: 'PagosContribuyentes',
        nombre: 'Pagos Contribuyentes',
        type: 'item',
        icono: 'circle',
        url: 'financial-collection/taxpayer-payments'
      },
      {
        id: 'GenerarMultas',
        nombre: 'Generar Multas',
        type: 'item',
        icono: 'circle',
        url: 'financial-collection/generate-fines'
      },
      {
        id: 'GenerarMultasNoInscritas',
        nombre: 'Generar Multas No Inscritas',
        type: 'item',
        icono: 'circle',
        url: 'financial-collection/generate-non-registered-fines'
      },
      {
        id: 'GestionMetas',
        nombre: 'Gestión Metas',
        type: 'item',
        icono: 'circle',
        url: 'financial-collection/goal-management'
      },
      {
        id: 'Repores',
        nombre: 'Reportes',
        type: 'item',
        icono: 'circle',
        url: 'financial-collection/reports'
      }
    ]
  },
  // Usuarios Estatus Recaudacion
  {
    id: 'support/users-status',
    nombre: 'Usuarios',
    role: ['1'], 
    icono: 'user',
    type: 'item',
    url: 'support/users-status',
  },
  // Fiscalizacion
  {
    id: 'Fiscalizacion',
    nombre: 'Fiscalización',
    title: 'Fiscalización',
    role: ['9','3'],
    type: 'collapsible',
    icono: 'folder',
    children: [
      {
        id: 'contribuyentes',
        nombre: 'Información de Contribuyentes',
        type: 'item',
        icono: 'circle',
        url: 'inspection/contributing-companies'
      },
    ]
  },
  // Juridico
  {
    id: 'Juridicos',
    nombre: 'Juridico',
    title: 'Juridico',
    role: ['9','2'],
    type: 'collapsible',
    icono: 'folder',
    children: [
      {
        id: 'contribuyentes',
        nombre: 'Revisión de Contribuyentes',
        type: 'item',
        icono: 'circle',
        url: 'legal/contributing-companies'
      },
      {
        id: 'actasfiscales',
        nombre: 'Actas Fiscales',
        type: 'item',
        icono: 'circle',
        // url: 'financial-collection/contributing-companies'
      },
    ]
  },
    // Proyectos
    {
      id: 'Proyectos',
      nombre: 'Proyectos',
      title: 'Proyectos',
      role: ['9','4'],
      type: 'collapsible',
      icono: 'folder',
      children: [
        {
          id: 'proyectos',
          nombre: 'Proyectos',
          type: 'item',
          icono: 'circle',
          url: 'projects/company-projects-recosup'
        },
        {
          id: 'reportes',
          nombre: 'Reportes',
          type: 'item',
          icono: 'circle',
          url: 'projects/reports'
        },
      ]
    },
    {
      id: 'Proyectos',
      nombre: 'Proyectos',
      title: 'Proyectos',
      role: [ '0'],
      type: 'collapsible',
      icono: 'folder',
      children: [
        {
          id: 'proyectos',
          nombre: 'Carga de Proyectos',
          type: 'item',
          icono: 'circle',
          url: 'projects/company-projects'
        },
      ]
    },
  // Reportes y Alertas
  {
    id: 'reportes-alertas',
    nombre: 'Reportes y Alertas',
    title: 'Reportes y Alertas',
    type: 'collapsible',
    role: ['9'],
    icono: 'alert-triangle',
    children: [
      {
        id: 'gestion-Alertas',
        nombre: 'Gestión Alertas',
        type: 'item',
        icono: 'circle',
        url: 'reports-alerts/alert-management'
      },
      {
        id: 'definicion-alertas',
        nombre: 'Definición Alertas',
        type: 'item',
        icono: 'circle',
        url: 'reports-alerts/definition-alerts'
      },
      {
        id: 'configuracion-usuarios-alertados',
        nombre: 'Configuración Usuarios Alertados',
        type: 'item',
        icono: 'circle',
        url: 'reports-alerts/alerted-users-configuration'
      },
      {
        id: 'reportes-dinamicos',
        nombre: 'Reportes Dinamicos',
        type: 'item',
        icono: 'circle',
        url: 'reports-alerts/dinamic-reports'
      },
      {
        id: 'reportes-estaticos',
        nombre: 'Reportes Estaticos',
        type: 'item',
        icono: 'circle',
        url: 'reports-alerts/static-reports'
      }
    ]
  },
  // Soporte
  {
    id: 'soporte',
    nombre: 'Soporte',
    title: 'Soporte',
    type: 'collapsible',
    icono: 'tool',
    // hidden: true,
    role: ['9'],
    children: [
      // {
      //   id: 'modulosmenus',
      //   nombre: 'Modulos Menus',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/menu-module',
      // },
      {
        id: 'rolesusuarios',
        nombre: 'Roles de Usuarios',
        type: 'item',
        icono: 'circle',
        url: 'support/role-user'
      },
      {
        id: 'permisosusuarios',
        nombre: 'Permisos de Usuarios',
        type: 'item',
        icono: 'circle',
        url: 'support/permissions-user'
      },
      {
        id: 'gestiontablas',
        nombre: 'Gestion Tablas',
        type: 'item',
        icono: 'circle',
        url: 'support/table-management'
      },
      {
        id: 'usuariosContribuyentes',
        nombre: 'Usuarios Contribuyentes ',
        type: 'item',
        icono: 'circle',
        url: 'support/change-password'
      },
      {
        id: 'users-system',
        nombre: 'Usuarios Sistema',
        type: 'item',
        icono: 'circle',
        url: 'support/users'
      },
      {
        id: 'backups',
        nombre: 'Copias de Seguridad',
        type: 'item',
        icono: 'circle',
        url: 'support/backups'
      }
    ]
  },
];
