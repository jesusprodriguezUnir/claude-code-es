import type { FeaturedItem } from './types';

export const COMPONENTS_JSON_URL =
  import.meta.env.PUBLIC_COMPONENTS_JSON_URL ?? '/components.json';

export const ITEMS_PER_PAGE = 24;

export const FEATURED_ITEMS: FeaturedItem[] = [
  {
    name: 'Angular Empresarial',
    description: 'Arquitectura Angular moderna para equipos hispanohablantes',
    logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
    url: '/featured/angular-empresarial',
    tag: 'Frontend',
    tagColor: '#dd0031',
    category: 'Desarrollo Web',
    ctaLabel: 'Instalar componentes Angular',
    ctaUrl: 'https://github.com/jpedro-lemos/claude-code-es',
    websiteUrl: 'https://angular.io',
    installCommand:
      'npx claude-code-es@latest --agent ingenieria-software/arquitecto-angular --skill desarrollo/angular-es --command angular/nuevo-componente --yes',
    metadata: {
      Componentes: '6',
      Stack: 'Angular 17+',
      Idioma: 'Español',
    },
    links: [
      { label: 'Documentación Angular', url: 'https://angular.dev' },
      { label: 'Repositorio', url: 'https://github.com/jpedro-lemos/claude-code-es' },
    ],
  },
  {
    name: 'Backend .NET Limpio',
    description: 'Clean Architecture con ASP.NET Core 8 y SQL Server',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/.NET_Core_Logo.svg',
    url: '/featured/backend-dotnet',
    tag: 'Backend',
    tagColor: '#512bd4',
    category: 'Desarrollo Backend',
    ctaLabel: 'Instalar componentes .NET',
    ctaUrl: 'https://github.com/jpedro-lemos/claude-code-es',
    websiteUrl: 'https://dotnet.microsoft.com',
    installCommand:
      'npx claude-code-es@latest --agent ingenieria-software/experto-dotnet-core --skill desarrollo/dotnet-es --command dotnet/setup-clean-architecture --yes',
    metadata: {
      Componentes: '7',
      Stack: '.NET 8 + SQL Server',
      Idioma: 'Español',
    },
    links: [
      { label: 'Documentación .NET', url: 'https://learn.microsoft.com/dotnet' },
      { label: 'Repositorio', url: 'https://github.com/jpedro-lemos/claude-code-es' },
    ],
  },
  {
    name: 'Python + SQL Server',
    description: 'FastAPI, SQLAlchemy 2 y SQL Server para equipos en español',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
    url: '/featured/python-sqlserver',
    tag: 'Backend',
    tagColor: '#3776ab',
    category: 'Desarrollo Backend',
    ctaLabel: 'Instalar componentes Python',
    ctaUrl: 'https://github.com/jpedro-lemos/claude-code-es',
    websiteUrl: 'https://fastapi.tiangolo.com',
    installCommand:
      'npx claude-code-es@latest --agent ingenieria-software/desarrollador-python-senior --skill desarrollo/python-es --skill base-de-datos/sqlserver --command python/nueva-api-fastapi --yes',
    metadata: {
      Componentes: '6',
      Stack: 'Python + FastAPI',
      Idioma: 'Español',
    },
    links: [
      { label: 'Documentación FastAPI', url: 'https://fastapi.tiangolo.com' },
      { label: 'Repositorio', url: 'https://github.com/jpedro-lemos/claude-code-es' },
    ],
  },
];

export const NAV_LINKS = {
  github: 'https://github.com/jpedro-lemos/claude-code-es',
  docs: 'https://github.com/jpedro-lemos/claude-code-es#readme',
  blog: 'https://github.com/jpedro-lemos/claude-code-es/discussions',
  trending: '/trending',
};
