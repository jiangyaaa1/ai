import React, { useState } from 'react';
import { useStore } from '../store';
import { BookOpen, Trash2, Plus, Code } from 'lucide-react';

export const SkillManager = () => {
  const { isSkillManagerActive, setSkillManagerActive, skills, addSkill, removeSkill } = useStore();
  const [newSkill, setNewSkill] = useState({ name: '', description: '', instruction: '' });

  if (!isSkillManagerActive) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.name.trim() && newSkill.instruction.trim()) {
      addSkill({
        name: newSkill.name.trim(),
        description: newSkill.description.trim(),
        instruction: newSkill.instruction.trim()
      });
      setNewSkill({ name: '', description: '', instruction: '' });
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-black/95 border border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex flex-col z-50 rounded-md overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-500/20 px-4 py-3 border-b border-blue-500/50">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold tracking-widest">
          <BookOpen size={18} className="animate-pulse" />
          SKILL_LIBRARY
        </div>
        <button onClick={() => setSkillManagerActive(false)} className="text-blue-400 hover:text-white transition-colors">✕</button>
      </div>
      
      {/* Skill List */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
        {skills.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-blue-500/50 font-mono text-xs text-center">
            <Code size={32} className="mb-2 opacity-50" />
            <p>NO SKILLS LEARNED</p>
            <p className="mt-1">Import skills to teach the AI new capabilities.</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="group flex flex-col gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded hover:border-blue-500/60 transition-colors relative">
              <div className="flex justify-between items-start">
                <div className="font-bold text-blue-300 text-sm">[{skill.name}]</div>
                <button 
                  onClick={() => removeSkill(skill.id)}
                  className="text-blue-500/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Forget Skill"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {skill.description && (
                <div className="text-xs text-blue-200/70 italic">{skill.description}</div>
              )}
              <div className="font-mono text-xs text-blue-200 leading-relaxed bg-black/50 p-2 rounded border border-blue-500/20">
                {skill.instruction}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-blue-500/30 bg-black">
        <form onSubmit={handleAddSkill} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Skill Name (e.g. System Cleanup)"
              className="flex-1 bg-blue-500/10 border border-blue-500/50 text-blue-200 text-xs p-2 outline-none focus:border-blue-400 font-mono placeholder-blue-500/50"
            />
            <input
              type="text"
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              placeholder="Description (Optional)"
              className="flex-1 bg-blue-500/10 border border-blue-500/50 text-blue-200 text-xs p-2 outline-none focus:border-blue-400 font-mono placeholder-blue-500/50"
            />
          </div>
          <div className="flex gap-2">
            <textarea
              value={newSkill.instruction}
              onChange={(e) => setNewSkill({ ...newSkill, instruction: e.target.value })}
              placeholder="Instructions / Commands for the AI to execute..."
              className="flex-1 bg-blue-500/10 border border-blue-500/50 text-blue-200 text-xs p-2 outline-none focus:border-blue-400 font-mono placeholder-blue-500/50 h-20 resize-none custom-scrollbar"
            />
            <button 
              type="submit"
              disabled={!newSkill.name.trim() || !newSkill.instruction.trim()}
              className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/50 px-4 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold tracking-wider"
            >
              <Plus size={16} /> IMPORT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
