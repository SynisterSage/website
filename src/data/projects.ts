export interface Project {
  id: string;
  title: string;
  categories: string[];
  description: string;
  thumbnail: string;
  images: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    id: 'dominos-redesign',
    title: 'Dominos App Redesign',
    categories: ['UI/UX', 'App Design'],
    description: 'A complete redesign of the Dominos mobile ordering experience, focusing on user-friendly navigation and streamlined checkout process.',
    thumbnail: '/projects/dominos/thumbnail.jpg',
    images: [
      '/projects/dominos/main.jpg',
      '/projects/dominos/flow.jpg',
      '/projects/dominos/components.jpg'
    ]
  },
  {
    id: 'overtone-app',
    title: 'Overtone App',
    categories: ['UI/UX', 'Full Stack Development'],
    description: 'A music learning platform that helps users master their instrument through interactive lessons and real-time feedback.',
    thumbnail: '/projects/overtone/thumbnail.jpg',
    images: [
      '/projects/overtone/main.jpg',
      '/projects/overtone/features.jpg',
      '/projects/overtone/interface.jpg'
    ]
  },
  {
    id: 'velkro',
    title: 'Velkro Type Creation',
    categories: ['Typography', 'Posters'],
    description: 'A custom typeface design project exploring modern geometric forms with a focus on readability and versatility.',
    thumbnail: '/projects/velkro/thumbnail.jpg',
    images: [
      '/projects/velkro/main.jpg',
      '/projects/velkro/specimens.jpg',
      '/projects/velkro/applications.jpg'
    ]
  }
]