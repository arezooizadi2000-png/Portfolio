export interface DialogChoice {
  text: string;
  nextId: string;
  variableChanges?: { [key: string]: any };
}

export interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  pose?: string;
  choices: DialogChoice[];
}

export interface ScriptLine {
  type: 'action' | 'dialogue' | 'slugline' | 'parenthetical';
  character?: string;
  text: string;
}

export interface BarkRow {
  trigger: string;
  context: string;
  dialogue: string;
  variantCount: number;
}

export interface LoreSection {
  title: string;
  subtitle?: string;
  body: string[];
}

export interface WritingSample {
  id: string;
  title: string;
  category: 'Screenplay' | 'World Lore' | 'Npc Barks';
  description: string;
  genre: string;
  formattedContent: {
    script?: ScriptLine[];
    lore?: LoreSection[];
    barks?: BarkRow[];
  };
}

export interface QuestNode {
  id: string;
  title: string;
  type: 'start' | 'core' | 'choice' | 'outcome-good' | 'outcome-bitter';
  description: string;
  questLore: string;
  choices?: string[];
  x: number; // For clean svg visual drawing positions
  y: number;
}

export interface QuestConnection {
  from: string;
  to: string;
  label?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
  skills: string[];
  highlight: string;
  description: string;
}

export interface GameVariableState {
  [key: string]: any;
}
