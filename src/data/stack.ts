export interface StackItem {
  name: string
  description: string
  icon: string
  url: string
}

export const stackItems: StackItem[] = [
  {
    name: 'Framer',
    description: 'Web Design',
    icon: '/icons/framer.svg',
    url: 'https://www.framer.com/'
  },
  {
    name: 'Figma',
    description: 'General Design',
    icon: '/icons/figma.svg',
    url: 'https://www.figma.com/'
  },
  {
    name: 'Illustrator',
    description: 'Vector Management',
    icon: '/icons/illustrator.svg',
    url: 'https://www.adobe.com/products/illustrator.html'
  },
  {
    name: 'Photoshop',
    description: 'Photo Editing',
    icon: '/icons/photoshop.svg',
    url: 'https://www.adobe.com/products/photoshop.html'
  },
  {
    name: 'VS Code',
    description: 'Backend Functions',
    icon: '/icons/vscode.svg',
    url: 'https://code.visualstudio.com/'
  },
  {
    name: 'Shots',
    description: 'Mockup Creation',
    icon: '/icons/shots.svg',
    url: 'https://shots.so/'
  },
  {
    name: 'ChatGPT',
    description: 'Content Generation',
    icon: '/icons/chatgpt.svg',
    url: 'https://chat.openai.com/'
  },
  {
    name: 'Slack',
    description: 'Collaboration',
    icon: '/icons/slack.svg',
    url: 'https://slack.com/'
  }
]
