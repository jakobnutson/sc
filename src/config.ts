import heroImage from './assets/hero-real.jpg';

export const SITE = {
  website: 'https://jakobnutson.github.io/sc', // Replace with your actual deployed URL
  author: 'Scholar-Lite Team',
  description: 'A lightweight, modern static website template for academic labs and scholars.',
  title: 'Scholar-Lite',
  ogImage: 'astropaper-og.jpg',
  lightAndDarkMode: true,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  
  // Lab Info
  labName: 'Scholar-Lite Lab',
  university: 'University Name',
  logo: '/sc/assets/logo-real.svg', // Logo path
  avatar: '/sc/assets/logo-real.svg', // Avatar for SEO/Schema
  email: 'contact@lab.edu', // Contact email for Join Us page

  // Hero Section (Home Page) - Main content does not need to be translated for 8 languages by default
  hero: {
    title: 'Advancing Computer Vision & Deep Learning Research.',
    subtitle: 'We are the Scholar-Lite Lab.',
    action: 'View Publications', // Optional call to action text
    image: heroImage, // Hero image path
  },

  // Navigation
  nav: [
    { text: 'Home', link: '/sc/', key: 'home' },
    { text: 'Research', link: '/sc/research', key: 'research' },
    { text: 'Achievements', link: '/sc/achievements', key: 'achievements' },
    { text: 'Team', link: '/sc/team', key: 'team' },
    { text: 'Activities', link: '/sc/activities', key: 'activities' },
    { text: 'Join Us', link: '/sc/join', key: 'join' },
    { text: 'Search', link: '/sc/search', key: 'search' },
  ],

  // Custom Pages (Appended after 'Join Us')
  customPages: [
    // Example: { text: 'Alumni', link: '/alumni', key: 'alumni' }
  ],
  
  // i18n Config
  i18n: {
    enabled: false,
    defaultLocale: 'zh',
  }
};

export const LOCALE = {
  lang: 'en', // html lang code. Set this empty and default will be "en"
  langTag: ['en-EN'], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS = [
  {
    link: 'https://github.com/fjd2004711/scholar-lite',
    active: true,
  },
];

// Default language configuration
export const DEFAULT_LANG: 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru' = 'en'; 
