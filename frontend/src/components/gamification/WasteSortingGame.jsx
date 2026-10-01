import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  Flame, 
  Info,
  Apple,
  Milk,
  BatteryCharging,
  Newspaper,
  Wine,
  Utensils,
  AlertTriangle,
  Package
} from 'lucide-react';
import { SORTING_ITEMS } from '../../data/mockAwareness';
import { Button } from '../common/Button';
import { apiService } from '../../services/api';

export const WasteSortingGame = () => {
  const [items, setItems] = useState(SORTING_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    apiService.getQuiz().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setItems(res.data);
      }
    }).catch(() => {});
  }, []);

  const currentItem = items[currentIndex] || items[0] || SORTING_ITEMS[0];

  const categories = [
    { id: 'Wet', label: 'Wet Waste', color: 'border-emerald-300 hover:bg-emerald-50 text-emerald-800' },
    { id: 'Dry', label: 'Dry Waste', color: 'border-sky-300 hover:bg-sky-50 text-sky-800' },
    { id: 'Recyclable', label: 'Recyclable', color: 'border-teal-300 hover:bg-teal-50 text-teal-800' },
    { id: 'Hazardous', label: 'Hazardous', color: 'border-rose-300 hover:bg-rose-50 text-rose-800' }
  ];

  const handleSelect = (category) => {
    if (selectedCategory) return; // Prevent double select

    setSelectedCategory(category);
    const isCorrect = currentItem.acceptedIn.includes(category);

    if (isCorrect) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedCategory(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedCategory(null);
    setScore(0);
    setStreak(0);
    setCompleted(false);
  };

  const isCurrentCorrect = selectedCategory && currentItem.acceptedIn.includes(selectedCategory);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
      
      {/* Game Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/40 text-[10px] font-bold uppercase tracking-wider">
              Interactive Civic Simulator
            </span>
            <span className="text-xs text-slate-300">
              Item {currentIndex + 1} of {items.length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            Sort the Waste Challenge
          </h3>
          <p className="text-xs text-slate-300">
            Select the correct municipal disposal stream for the item shown.
          </p>
        </div>

        {/* Live Score & Streak */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300">Score:</span>
            <span className="text-sm font-bold text-white font-mono">{score}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-300">Streak:</span>
            <span className="text-sm font-bold text-orange-300 font-mono">{streak}</span>
          </div>
        </div>
      </div>

      {/* Game Body */}
      <div className="p-6 sm:p-8">
        {!completed ? (
          <div className="space-y-6">
            
            {/* Target Item Card */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-soft shrink-0">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center sm:text-left space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Item Under Test
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  {currentItem.name}
                </h4>
                <p className="text-sm text-slate-600">
                  Which category does this belong to?
                </p>
              </div>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const isAccepted = currentItem.acceptedIn.includes(cat.id);

                let buttonStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50';

                if (selectedCategory) {
                  if (isSelected) {
                    buttonStyle = isAccepted
                      ? 'bg-emerald-600 border-emerald-600 text-white font-bold ring-4 ring-emerald-100'
                      : 'bg-rose-600 border-rose-600 text-white font-bold ring-4 ring-rose-100';
                  } else if (isAccepted) {
                    buttonStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                  } else {
                    buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={cat.id}
                    disabled={Boolean(selectedCategory)}
                    onClick={() => handleSelect(cat.id)}
                    className={`p-4 rounded-2xl border text-sm font-semibold transition-all duration-200 shadow-soft flex flex-col items-center justify-center text-center gap-2 ${buttonStyle}`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Panel */}
            {selectedCategory && (
              <div
                className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-200 ${
                  isCurrentCorrect
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/90 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1 flex-1">
                    <h5 className="text-sm font-bold">
                      {isCurrentCorrect ? 'Correct! +10 Points' : `Incorrect. Belongs in: ${currentItem.category}`}
                    </h5>
                    <p className="text-xs leading-relaxed opacity-90">
                      {currentItem.fact}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={isCurrentCorrect ? 'primary' : 'outline'}
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={handleNext}
                    className="shrink-0"
                  >
                    Next Item
                  </Button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Game Completed State */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-soft ring-8 ring-emerald-50">
              <Trophy className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-slate-900">
                Sorting Challenge Complete!
              </h4>
              <p className="text-sm text-slate-600">
                You scored <strong className="text-primary font-mono text-base">{score} / {items.length * 10} points</strong>!
              </p>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your community awareness activity has been rewarded on your Community Eco-Score profile (+15 awareness points logged).
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <Button variant="primary" icon={RotateCcw} onClick={handleRestart}>
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
