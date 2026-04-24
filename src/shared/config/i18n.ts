export const languages = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
} as const;

export const defaultLang = 'es';

export const languagesFlags = {
  es: '🇪🇸',
  en: '🇺🇸',
  fr: '🇫🇷',
} as const;

export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

const translations = {
  es: {
    meta: {
      title: 'LuiferDev - Desarrollador Full Stack',
      description: 'Desarrollador Full Stack especializado en React, TypeScript, .NET y tecnologías web modernas. Creando experiencias digitales con código y creatividad.',
    },
    nav: {
      about: 'Sobre Mí',
      experience: 'Experiencia',
      education: 'Educación',
      projects: 'Proyectos',
      certifications: 'Certificaciones',
      skills: 'Habilidades',
    },
    hero: {
      greeting: 'Hola, soy',
      name: 'LuiferDev',
      role: 'Desarrollador Full Stack',
      tagline: 'Creando experiencias digitales con código y creatividad',
      cta1: 'Ver Mi Trabajo',
      cta2: 'Contáctame',
    },
    about: {
      title: 'Sobre Mí',
      content: `Desarrollador Full Stack con más de 5 años de experiencia creando soluciones digitales innovadoras. 
      
Me especializo en el desarrollo de aplicaciones web modernas utilizando tecnologías como React, TypeScript, .NET y Java. 
      
Mi pasión es transformar ideas en productos digitales que generan valor real. Siempre estoy aprendiendo nuevas tecnologías y mejores prácticas para entregar código de calidad.`,
    },
    experience: {
      title: 'Experiencia',
    },
    education: {
      title: 'Educación',
    },
    projects: {
      title: 'Proyectos',
      live: 'Demo',
      code: 'Código',
      back: 'Volver a Proyectos',
      technologies: 'Tecnologías',
      stack: 'Stack',
      features: 'Características',
      completed: 'Completado',
      inProgress: 'En Progreso',
    },
    certifications: {
      title: 'Certificaciones',
    },
    skills: {
      title: 'Habilidades',
      verify: 'Verificar',
    },
    footer: {
      tagline: 'Creando experiencias digitales con código y creatividad',
      rights: 'Todos los derechos reservados.',
      contact: 'Contacto',
    },
    contact: {
      title: 'Contáctame',
      subtitle: '¿Tienes un proyecto en mente? Escríbeme y hablemos.',
      form: {
        name: 'Nombre',
        namePlaceholder: 'Tu nombre',
        lastname: 'Apellido',
        lastnamePlaceholder: 'Tu apellido',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@email.com',
        message: 'Mensaje',
        messagePlaceholder: 'Cuéntame sobre tu proyecto...',
        submit: 'Enviar mensaje',
        sending: 'Enviando...',
        success: '¡Mensaje enviado! Te responderé pronto.',
        error: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
      },
    },
    certs: {
      java: 'Desarrollador Backend Java',
      scrum: 'Certificación Scrum Foundational',
      data: 'Analista de Datos',
    },
    edu: {
      sena: 'Servicio Nacional de Aprendizaje (SENA)',
      senaDegree: 'Procesamiento de Software Testing',
      period: 'Sep 2024 - Jul 2025',
      inProgress: 'En Progreso',
    },
  },
  en: {
    meta: {
      title: 'LuiferDev - Full Stack Developer',
      description: 'Full Stack Developer specializing in React, TypeScript, .NET, and modern web technologies. Building digital experiences with code and creativity.',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      certifications: 'Certifications',
      skills: 'Skills',
    },
    hero: {
      greeting: "Hi, I'm",
      name: 'LuiferDev',
      role: 'Full Stack Developer',
      tagline: 'Building digital experiences with code and creativity',
      cta1: 'View My Work',
      cta2: 'Contact Me',
    },
    about: {
      title: 'About Me',
      content: `Full Stack Developer with over 5 years of experience creating innovative digital solutions.
      
I specialize in building modern web applications using technologies like React, TypeScript, .NET, and Java.
      
My passion is turning ideas into digital products that deliver real value. I'm always learning new technologies and best practices to deliver quality code.`,
    },
    experience: {
      title: 'Experience',
    },
    education: {
      title: 'Education',
    },
    projects: {
      title: 'Projects',
      live: 'Live',
      code: 'Code',
      back: 'Back to Projects',
      technologies: 'Technologies',
      stack: 'Stack',
      features: 'Features',
      completed: 'Completed',
      inProgress: 'In Progress',
    },
    certifications: {
      title: 'Certifications',
    },
    skills: {
      title: 'Skills',
      verify: 'Verify',
    },
    footer: {
      tagline: 'Building digital experiences with code and creativity',
      rights: 'All rights reserved.',
      contact: 'Contact',
    },
    contact: {
      title: 'Contact Me',
      subtitle: 'Have a project in mind? Write to me and let\'s talk.',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        lastname: 'Last Name',
        lastnamePlaceholder: 'Your last name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        message: 'Message',
        messagePlaceholder: 'Tell me about your project...',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent! I will reply soon.',
        error: 'Error sending message. Please try again.',
      },
    },
    certs: {
      java: 'Java Backend Developer',
      scrum: 'Scrum Foundational Certification',
      data: 'Data Analyst',
    },
    edu: {
      sena: 'National Learning Service (SENA)',
      senaDegree: 'Software Testing Processing',
      period: 'Sep 2024 - Jul 2025',
      inProgress: 'In Progress',
    },
  },
  fr: {
    meta: {
      title: 'LuiferDev - Développeur Full Stack',
      description: 'Développeur Full Stack spécialisé en React, TypeScript, .NET et technologies web modernes. Créer des expériences numériques avec du code et de la créativité.',
    },
    nav: {
      about: 'À propos',
      experience: 'Expérience',
      education: 'Éducation',
      projects: 'Projets',
      certifications: 'Certifications',
      skills: 'Compétences',
    },
    hero: {
      greeting: 'Bonjour, je suis',
      name: 'LuiferDev',
      role: 'Développeur Full Stack',
      tagline: 'Créer des expériences numériques avec du code et de la créativité',
      cta1: 'Voir Mon Travail',
      cta2: 'Me Contacter',
    },
    about: {
      title: 'À Propos',
      content: `Développeur Full Stack avec plus de 5 ans d'expérience créant des solutions numériques innovantes.
      
Je suis spécialisé dans le développement d'applications web modernes utilisant des technologies comme React, TypeScript, .NET et Java.
      
Ma passion est de transformer des idées en produits numériques qui génèrent une réelle valeur. J'apprends toujours de nouvelles technologies et meilleures pratiques pour delivers du code de qualité.`,
    },
    experience: {
      title: 'Expérience',
    },
    education: {
      title: 'Éducation',
    },
    projects: {
      title: 'Projets',
      live: 'Démo',
      code: 'Code',
      back: 'Retour aux Projets',
      technologies: 'Technologies',
      stack: 'Stack',
      features: 'Fonctionnalités',
      completed: 'Terminé',
      inProgress: 'En Cours',
    },
    certifications: {
      title: 'Certifications',
    },
    skills: {
      title: 'Compétences',
      verify: 'Vérifier',
    },
    footer: {
      tagline: 'Créer des expériences numériques avec du code et de la créativité',
      rights: 'Tous droits réservés.',
      contact: 'Contact',
    },
    contact: {
      title: 'Me Contacter',
      subtitle: 'Vous avez un projet en tête? Écrivez-moi et parlons-en.',
      form: {
        name: 'Prénom',
        namePlaceholder: 'Votre prénom',
        lastname: 'Nom',
        lastnamePlaceholder: 'Votre nom',
        email: 'Email',
        emailPlaceholder: 'votre@email.com',
        message: 'Message',
        messagePlaceholder: 'Parlez-moi de votre projet...',
        submit: 'Envoyer le message',
        sending: 'Envoi en cours...',
        success: 'Message envoyé! Je répondrai bientôt.',
        error: "Erreur lors de l'envoi. Veuillez réessayer.",
      },
    },
    certs: {
      java: 'Développeur Backend Java',
      scrum: 'Certification Scrum Foundational',
      data: 'Analyste de Données',
    },
    edu: {
      sena: 'Service National d\'Apprentissage (SENA)',
      senaDegree: 'Traitement des Tests Logiciels',
      period: 'Sep 2024 - Jul 2025',
      inProgress: 'En Cours',
    },
  },
};

export function useTranslations(lang: Lang) {
  return translations[lang];
}

// Helper to get translation by key path
export function getTranslation(lang: Lang, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}