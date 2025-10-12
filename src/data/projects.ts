export interface Project {
  id: string;
  title: string;
  categories: string[];
  description: string;
  thumbnail: string;
  images: string[];
  link?: string;
  year?: string;
  service?: string;
  tools?: string[];
  fullDescription?: string;
  figmaEmbed?: string;
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
    ],
    year: '2025',
    service: 'UI/UX',
    tools: ['Figma'],
    fullDescription: `This mobile redesign reimagines the Domino's ordering experience with a sharper, more intuitive user flow and a bold flat-UI aesthetic. Created as a class assignment, it became a passion project driven by my love for improving everyday digital experiences. The goal was simple: fix the frustrating UX of the existing app and make pizza ordering fast, clear, and visually cohesive.

I rebuilt the entire design system from the ground up with clean, modular components, defined states, and a flexible variable structure supporting light and dark modes. The color palette was reinvented for vibrancy and contrast, while typography stays confident yet readable. Every interaction, from micro animations to modal transitions, was refined to feel responsive and satisfying.

The new flow dramatically reduces the number of steps to browse the menu, build a pizza, and check out. Features like guest checkout and simplified navigation remove friction while keeping the brand's personality intact. I validated improvements through peer feedback and user testing, iterating based on real behavior.

It's a complete end-to-end Figma prototype that feels modern, efficient, and cohesive from screen to screen—a redesign that makes ordering pizza actually enjoyable.`,
    figmaEmbed: 'https://embed.figma.com/proto/dJgsXGf3LhAJuVZAnJyLqh/Dominos-Redesign-Main-File?node-id=108-916&p=f&scaling=scale-down&content-scaling=fixed&page-id=1%3A2&starting-point-node-id=108%3A914&embed-host=share'
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
    ],
    year: '2024',
    service: 'UI/UX',
    tools: ['Figma', 'React', 'Node.js'],
    fullDescription: `A music learning platform that helps users master their instrument through interactive lessons and real-time feedback. Overtone combines cutting-edge audio recognition technology with an intuitive interface designed for musicians of all skill levels.

The app features a dark mode-first design that reduces eye strain during long practice sessions, with carefully considered typography and spacing that keeps the focus on learning. Interactive tuner, metronome, and practice logging features are seamlessly integrated into the experience.

Built with React Native for cross-platform compatibility, Overtone delivers consistent performance on both iOS and Android devices. The backend leverages Node.js and real-time audio processing to provide instant feedback on pitch, rhythm, and technique.

From concept to launch, this project showcases full-stack development capabilities alongside thoughtful UX design that prioritizes the needs of practicing musicians.`
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
    ],
    year: '2024',
    service: 'Typography',
    tools: ['Illustrator', 'InDesign'],
    fullDescription: `Velkro is a custom geometric typeface that balances modern aesthetics with exceptional readability. Inspired by Swiss design principles and contemporary digital interfaces, Velkro features clean lines, precise curves, and carefully adjusted spacing.

The typeface family includes multiple weights from Light to Bold, each meticulously crafted to maintain visual consistency across sizes. Special attention was paid to kerning pairs and OpenType features to ensure professional-grade typesetting results.

A comprehensive type specimen book showcases Velkro in various applications, from editorial layouts to poster designs. The book itself demonstrates the versatility of the typeface, featuring both display and body text treatments.

This project represents a deep dive into type design fundamentals, from initial sketches to final production-ready font files, with extensive testing across print and digital media.`
  }
]