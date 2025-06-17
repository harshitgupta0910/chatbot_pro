import { PromptTemplate } from '../types';

export const promptTemplates: PromptTemplate[] = [
  {
    id: '1',
    title: 'Explain a Concept',
    content: 'Can you explain {topic} in simple terms? Please include examples and why it matters.',
    category: 'Learning',
  },
  {
    id: '2',
    title: 'Code Review',
    content: 'Please review this code and suggest improvements:\n\n{code}',
    category: 'Programming',
  },
  {
    id: '3',
    title: 'Problem Solving',
    content: 'I have a problem: {problem}\n\nCan you help me brainstorm solutions and their pros/cons?',
    category: 'General',
  },
  {
    id: '4',
    title: 'Creative Writing',
    content: 'Help me write a {type} about {topic}. The tone should be {tone}.',
    category: 'Creative',
  },
  {
    id: '5',
    title: 'Technical Documentation',
    content: 'Help me create documentation for {feature}. Include setup instructions and examples.',
    category: 'Programming',
  },
  {
    id: '6',
    title: 'Learning Plan',
    content: 'Create a learning plan for {skill} over {timeframe}. I\'m currently at {level} level.',
    category: 'Learning',
  },
];