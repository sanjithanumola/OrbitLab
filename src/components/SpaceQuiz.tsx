import React, { useState, useMemo } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

interface SpaceQuizProps {
  onAddXp: (xp: number, achievementId?: string) => void;
  highScore: number;
  onSaveHighScore: (category: string, score: number) => void;
}

export const SpaceQuiz: React.FC<SpaceQuizProps> = ({
  onAddXp,
  highScore,
  onSaveHighScore,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [quizLength, setQuizLength] = useState<number>(5);

  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ question: QuizQuestion; chosen: number; isCorrect: boolean }[]>([]);

  // Filter and shuffle questions
  const activeQuestions = useMemo(() => {
    let pool = QUIZ_QUESTIONS;
    if (selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === selectedDifficulty);
    }
    // Random shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(quizLength, shuffled.length));
  }, [selectedCategory, selectedDifficulty, quizLength, isQuizActive]);

  const currentQuestion = activeQuestions[currentIndex];

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsFinished(false);
    setUserAnswers([]);
    setIsQuizActive(true);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      onAddXp(20);
    } else {
      setStreak(0);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuestion,
        chosen: selectedOption,
        isCorrect,
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQuestion.correctIndex ? 1 : 0);
      const pct = Math.round((finalScore / activeQuestions.length) * 100);

      onAddXp(50); // Completion bonus
      if (pct === 100) {
        onAddXp(100, 'quiz_ace');
      }

      onSaveHighScore(selectedCategory, finalScore);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'planets', label: 'Planetary Facts' },
    { id: 'moons', label: 'Moons & Satellites' },
    { id: 'mechanics', label: 'Orbital Mechanics' },
    { id: 'distances', label: 'Distances & Light Time' },
    { id: 'missions', label: 'Space Missions' },
    { id: 'stars', label: 'Sun & Stellar Life' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Difficulties' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'astrophysicist', label: 'Astrophysicist' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-cyan-500/15 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span>Solar System Astronomy Quiz Challenge</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test your knowledge of planetary science, orbital dynamics, deep-space missions, and astronomical metrics.
          </p>
        </div>

        {highScore > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Personal Best: {highScore} pts</span>
          </div>
        )}
      </div>

      {!isQuizActive ? (
        /* Quiz Setup Screen */
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Configure Your Challenge</h2>
            <p className="text-xs text-slate-400">
              Earn XP, build answer streaks, and unlock the Cosmic Scholar achievement!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Difficulty selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold block">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {difficulties.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Count Pills */}
          <div className="flex justify-center items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Length:</span>
            {[5, 10, 15].map(n => (
              <button
                key={n}
                onClick={() => setQuizLength(n)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  quizLength === n
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                    : 'bg-slate-900/60 text-slate-400 border-white/5'
                }`}
              >
                {n} Questions
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105"
            >
              <span>Begin Astronomy Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !isFinished && currentQuestion ? (
        /* Active Question Card */
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Progress & Stats Bar */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">
                Question {currentIndex + 1} / {activeQuestions.length}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 uppercase text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-white/5">
                {currentQuestion.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {streak > 1 && (
                <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{streak}x Streak</span>
                </div>
              )}
              <span className="text-emerald-400 font-bold">Score: {score}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;

              let style = 'bg-slate-900/60 border-white/5 hover:border-cyan-400/40 text-slate-200';
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-900/30 border-white/5 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Answer Explanation */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/25 space-y-1.5 animate-fade-in text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                {selectedOption === currentQuestion.correctIndex ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer! (+20 XP)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
              {currentQuestion.sourceRef && (
                <span className="text-[10px] text-slate-500 font-mono block pt-1">
                  Reference: {currentQuestion.sourceRef}
                </span>
              )}
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>{currentIndex + 1 < activeQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
            <Award className="w-8 h-8 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Challenge Complete!</h2>
            <p className="text-xs text-slate-400 mt-1">
              You scored <strong className="text-cyan-300 font-mono text-base">{score} / {activeQuestions.length}</strong> ({Math.round((score / activeQuestions.length) * 100)}%)
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Earned +{score * 20 + 50} Explorer XP</span>
          </div>

          {/* Review Mistakes Section */}
          {userAnswers.some(a => !a.isCorrect) && (
            <div className="text-left space-y-3 pt-4 border-t border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Review Incorrect Answers
              </h3>
              <div className="space-y-2">
                {userAnswers.filter(a => !a.isCorrect).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                    <p className="font-semibold text-white">{item.question.question}</p>
                    <p className="text-rose-400">
                      Your answer: {item.question.options[item.chosen]}
                    </p>
                    <p className="text-emerald-400">
                      Correct answer: {item.question.options[item.question.correctIndex]}
                    </p>
                    <p className="text-slate-400 text-[11px] pt-1">{item.question.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
            <button
              onClick={() => setIsQuizActive(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-xs transition-colors"
            >
              Change Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
