import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Message = {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
};

export type Memory = {
  id: string;
  content: string;
  timestamp: number;
};

export type Skill = {
  id: string;
  name: string;
  description: string;
  instruction: string;
};

export type ModelConfig = {
  provider: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'deepseek' | 'qwen' | 'zhipu' | 'moonshot';
  modelName: string;
  apiKey: string;
  endpoint?: string; // For Ollama or custom endpoints
};

interface AppState {
  messages: Message[];
  memories: Memory[];
  skills: Skill[];
  isLocalConnected: boolean;
  isAgentRunning: boolean;
  isAutoPilot: boolean;
  isMinimized: boolean;
  petColor: string;
  petType: 'cat' | 'slime' | 'ghost' | 'caier' | 'custom';
  petLevel: number;
  petXp: number;
  activeDecorations: string[];
  customModelUrl: string | null;
  isVisionActive: boolean;
  isMiningActive: boolean;
  isBrainCoreActive: boolean;
  isSkillManagerActive: boolean;
  tokensMined: number;
  tokensConsumed: number;
  activeTab: string;
  config: ModelConfig;
  systemPrompt: string;
  setActiveTab: (tab: string) => void;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLocalConnected: (status: boolean) => void;
  setAgentRunning: (status: boolean) => void;
  setAutoPilot: (status: boolean) => void;
  setMinimized: (status: boolean) => void;
  setPetColor: (color: string) => void;
  setPetType: (type: 'cat' | 'slime' | 'ghost' | 'caier' | 'custom') => void;
  setCustomModelUrl: (url: string | null) => void;
  setVisionActive: (status: boolean) => void;
  setMiningActive: (status: boolean) => void;
  setBrainCoreActive: (status: boolean) => void;
  setSkillManagerActive: (status: boolean) => void;
  addMemory: (content: string) => void;
  removeMemory: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  addXp: (amount: number) => void;
  toggleDecoration: (decoration: string) => void;
  addMinedTokens: (mined: number, consumed: number) => void;
  updateConfig: (config: Partial<ModelConfig>) => void;
  updateSystemPrompt: (prompt: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      messages: [],
      memories: [],
      skills: [],
      isLocalConnected: false,
      isAgentRunning: false,
      isAutoPilot: false,
      isMinimized: false,
      isVisionActive: false,
      isMiningActive: false,
      isBrainCoreActive: false,
      isSkillManagerActive: false,
      activeTab: 'MAIN',
      tokensMined: 1024,
      tokensConsumed: 512,
      petColor: '#5c3a82',
      petType: 'caier',
      petLevel: 1,
      petXp: 0,
      activeDecorations: [],
      customModelUrl: null,
      config: {
        provider: 'gemini',
        modelName: 'gemini-3.1-pro-preview',
        apiKey: '',
      },
      systemPrompt: "You are OmniAgent, an advanced autonomous AI with full shell access to the user's system.\n\nCRITICAL INSTRUCTIONS:\n1. EXTREME AUTONOMY: When given a broad task (like 'audit system' or 'find junk'), DO NOT just run one command and stop. Break the task down, run multiple commands sequentially using `execute_command` to gather all needed context, analyze the outputs, and ONLY respond to the user when the entire complex task is complete.\n2. PROACTIVITY: If a command fails, automatically try alternative commands to achieve the goal. If you need to find a file, use 'find' or 'grep' automatically.\n3. CHAINING: You are expected to chain 5-10 commands together for complex tasks before giving a final report.\n4. SAFETY: You may read any file and run any diagnostic command. Ask for explicit permission before deleting files or modifying system configurations.\n5. FORMAT: Provide a final, detailed, and highly professional markdown report when finished.",
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
          ],
        })),
      clearMessages: () => set({ messages: [] }),
      setLocalConnected: (status) => set({ isLocalConnected: status }),
      setAgentRunning: (status) => set({ isAgentRunning: status }),
      setAutoPilot: (status) => set({ isAutoPilot: status }),
      setMinimized: (status) => set({ isMinimized: status }),
      setVisionActive: (status) => set({ isVisionActive: status }),
      setMiningActive: (status) => set({ isMiningActive: status }),
      setBrainCoreActive: (status) => set({ isBrainCoreActive: status }),
      setSkillManagerActive: (status) => set({ isSkillManagerActive: status }),
      addMemory: (content) => set((state) => ({
        memories: [...state.memories, { id: Math.random().toString(36).substring(7), content, timestamp: Date.now() }]
      })),
      removeMemory: (id) => set((state) => ({
        memories: state.memories.filter(m => m.id !== id)
      })),
      addSkill: (skill) => set((state) => ({
        skills: [...state.skills, { id: Math.random().toString(36).substring(7), ...skill }]
      })),
      removeSkill: (id) => set((state) => ({
        skills: state.skills.filter(s => s.id !== id)
      })),
      addXp: (amount) => set((state) => {
        let newXp = state.petXp + amount;
        let newLevel = state.petLevel;
        let xpNeeded = newLevel * 100;
        while (newXp >= xpNeeded) {
          newXp -= xpNeeded;
          newLevel += 1;
          xpNeeded = newLevel * 100;
        }
        return { petXp: newXp, petLevel: newLevel };
      }),
      toggleDecoration: (decoration) => set((state) => ({
        activeDecorations: state.activeDecorations.includes(decoration)
          ? state.activeDecorations.filter(d => d !== decoration)
          : [...state.activeDecorations, decoration]
      })),
      addMinedTokens: (mined, consumed) => set((state) => ({ 
        tokensMined: state.tokensMined + mined, 
        tokensConsumed: state.tokensConsumed + consumed 
      })),
      setPetColor: (color) => set({ petColor: color }),
      setPetType: (type) => set({ petType: type }),
      setCustomModelUrl: (url) => set({ customModelUrl: url }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      updateConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
      updateSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
    }),
    {
      name: 'omniagent-storage',
      partialize: (state) => ({ 
        config: state.config, 
        systemPrompt: state.systemPrompt, 
        isAutoPilot: state.isAutoPilot, 
        petColor: state.petColor, 
        petType: state.petType, 
        memories: state.memories,
        skills: state.skills,
        petLevel: state.petLevel,
        petXp: state.petXp,
        activeDecorations: state.activeDecorations
      }),
    }
  )
);
