import React, { useState } from 'react';
import { DiscoveryTopic } from '../types';
import { DISCOVERIES_DATA } from '../data/discoveries';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Tag,
  ChevronRight,
  Award
} from 'lucide-react';

interface DiscoveriesProps {
  completedDiscoveryIds: string[];
  onCompleteTopic: (topicId: string) => void;
  onAddXp: (xp: number, achievementId?: string) => void;
}

export const Discoveries: React.FC<DiscoveriesProps> = ({
  completedDiscoveryIds,
  onCompleteTopic,
  onAddXp,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('solar-nebula');
  const [checkAnswerIndex, setCheckAnswerIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);

  const topic = DISCOVERIES_DATA.find(d => d.id === selectedTopicId) || DISCOVERIES_DATA[0];
  const isCompleted = completedDiscoveryIds.includes(topic.id);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCheckAnswerIndex(null);
    setIsAnswerChecked(false);
  };

  const handleCheckAnswer = () => {
    if (checkAnswerIndex === null) return;
    setIsAnswerChecked(true);

    if (checkAnswerIndex === topic.quickCheck.correctIndex && !isCompleted) {
      onCompleteTopic(topic.id);
      onAddXp(50, 'curious_mind');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-cyan-500/15 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>Cosmic Discoveries & Scientific Foundations</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Peer-reviewed astronomical knowledge: planetary origins, stellar thermodynamics, small bodies, dwarf planets, and astrobiology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Topic Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {DISCOVERIES_DATA.map((t, idx) => {
            const isSelected = t.id === topic.id;
            const completed = completedDiscoveryIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(t.id)}
                className={`w-full flex items-start justify-between p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400/50 shadow-md shadow-cyan-500/15'
                    : 'bg-slate-900/60 border-white/5 hover:bg-slate-900/90 hover:border-white/10'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold block">
                    {t.category}
                  </span>
                  <span className="text-sm font-bold text-white block leading-tight">
                    {idx + 1}. {t.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{t.readTimeMin} min read</span>
                  </div>
                </div>

                {completed && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Article & Knowledge Check Hub (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <article className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="border-b border-white/5 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                  {topic.category}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topic.readTimeMin} min read</span>
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">{topic.title}</h2>
              <p className="text-sm text-cyan-300/90 font-medium">{topic.subtitle}</p>
            </div>

            {/* Summary Callout */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <strong className="text-white block mb-1">Executive Summary:</strong>
              {topic.summary}
            </div>

            {/* Article Sections */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {topic.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight">{sec.heading}</h3>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{sec.body}</p>

                  {sec.keyPoints && (
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 space-y-1 my-2">
                      <span className="text-[11px] font-bold text-amber-300 uppercase block font-mono">
                        Key Takeaways:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                        {sec.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Terms Glossary */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Astrophysical Vocabulary & Key Terms</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topic.keyTerms.map((term, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                    <span className="font-bold text-white block">{term.term}</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Knowledge Check */}
            <div className="pt-6 border-t border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Knowledge Check (+50 XP)</span>
                </h4>
                {isCompleted && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Module Completed
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-200">
                {topic.quickCheck.question}
              </p>

              <div className="space-y-2">
                {topic.quickCheck.options.map((opt, idx) => {
                  const isSelected = checkAnswerIndex === idx;
                  const isCorrect = idx === topic.quickCheck.correctIndex;

                  let style = 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-cyan-400/40';
                  if (isAnswerChecked) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-cyan-950/60 border-cyan-400 text-cyan-200';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isAnswerChecked && setCheckAnswerIndex(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswerChecked && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isAnswerChecked && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/25 text-xs text-slate-300 space-y-1">
                  <strong className={checkAnswerIndex === topic.quickCheck.correctIndex ? 'text-emerald-400' : 'text-rose-400'}>
                    {checkAnswerIndex === topic.quickCheck.correctIndex ? 'Correct!' : 'Incorrect.'}
                  </strong>
                  <p>{topic.quickCheck.explanation}</p>
                </div>
              )}

              {!isAnswerChecked && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleCheckAnswer}
                    disabled={checkAnswerIndex === null}
                    className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Verify Answer
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
