import { WritingSample, DialogNode, QuestNode, QuestConnection, Certificate } from './types';

export const PORTFOLIO_INFO = {
  name: "Arezoo",
  roles: [
    "Game Narrative Designer",
    "Copywriter & Copyeditor",
    "Content Creator"
  ],
  tagline: "Structuring agency, dialogue mechanics, and rich content ecosystems to bring modern experiences to life.",
  about: "I am a Game Narrative Designer, Copywriter, Copyeditor, and Content Creator. I specialize in designing branching story paths, creating compelling marketing copy, polishing copy layout, and generating premium interactive system architectures.",
  skills: [
    "Branching Dialogue Logic",
    "Interactive Narrative Strategy",
    "Technical Writing",
    "Copyediting & Copywriting",
    "Content Strategy & Planning",
    "Script Editing & Directing",
    "Creative Storyboarding",
    "UI Narrative Microcopy"
  ],
  socials: {
    github: "github.com/arezoo-izadi",
    portfolio: "arezoo-portfolio.design"
  }
};

// Start with empty arrays so you can add your own certified credentials & portfolio content!
export const INITIAL_CERTIFICATES: Certificate[] = [];
export const INITIAL_WRITING_SAMPLES: WritingSample[] = [];

export const INITIAL_QUEST_NODES: QuestNode[] = [];
export const INITIAL_QUEST_CONNECTIONS: QuestConnection[] = [];

export const DEFAULT_BRANCHING_STORY: { [key: string]: DialogNode } = {
  start: {
    id: "start",
    speaker: "NPC GUIDE",
    text: "Welcome to your new branching story workspace. This is the starting node (ID: 'start'). You can add choices below or configure new node pathways in the creator menu.",
    pose: "neutral",
    choices: [
      {
        text: "Add a custom choice to begin shaping your story paths...",
        nextId: "custom_path_1",
        variableChanges: { score: 10 }
      }
    ]
  },
  custom_path_1: {
    id: "custom_path_1",
    speaker: "NPC GUIDE",
    text: "This is a secondary node path (ID: 'custom_path_1'). You can modify this text and route the player further back or to new outcomes.",
    pose: "neutral",
    choices: [
      {
        text: "Return to the entry sequence.",
        nextId: "start",
        variableChanges: { reset: true }
      }
    ]
  }
};
