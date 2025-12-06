import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Mic, Volume2, RotateCcw } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';
import { Button, Card, ProgressBar, NovaMascot } from '../components/ui';
import { Question, QuestionType } from '../types';

interface LessonScreenProps {
  onComplete: (xp: number) => void;
  onExit: () => void;
  hearts: number;
  setHearts: (h: number) => void;
}

// Mock Data for a demo lesson
const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'How do you say "Hello" in Amharic?',
    options: ['Selam (ሰላም)', 'Ameseginalehu (አመሰግናለሁ)', 'Ow (አዎ)', 'Ay (አይ)'],
    correctAnswer: 'Selam (ሰላም)',
    audioText: 'Selam'
  },
  {
    id: '2',
    type: 'translate',
    question: 'Translate: "The coffee is good"',
    options: ['Buna', 'Tiru', 'New', 'Wuh', 'Bet'],
    correctAnswer: ['Buna', 'Tiru', 'New'],
  },
  {
    id: '3',
    type: 'multiple-choice',
    question: 'Which of these is "Water" in Afaan Oromo?',
    options: ['Bishaan', 'Aannan', 'Muka', 'Dhagaa'],
    correctAnswer: 'Bishaan',
  },
  {
    id: '4',
    type: 'listen',
    question: 'What did you hear?',
    audioText: 'Ameseginalehu', // Mock audio
    options: ['Thank you', 'Hello', 'Goodbye', 'Yes'],
    correctAnswer: 'Thank you',
  },
  {
    id: '5',
    type: 'speak',
    question: 'Tap to speak this phrase:',
    audioText: 'Selam', // Text to read
    options: ['seh-lam'], // Phonetic guide
    correctAnswer: 'Selam', // Expected spoken text
  }
];

export const LessonScreen: React.FC<LessonScreenProps> = ({ onComplete, onExit, hearts, setHearts }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // For translate drag/drop style
  const [spokenText, setSpokenText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [progress, setProgress] = useState(0);

  const currentQ = MOCK_QUESTIONS[currentQIndex];

  useEffect(() => {
    setProgress((currentQIndex / MOCK_QUESTIONS.length) * 100);
  }, [currentQIndex]);

  const handleCheck = () => {
    let isCorrect = false;

    if (currentQ.type === 'translate') {
      const answerString = selectedWords.join(' ');
      if (Array.isArray(currentQ.correctAnswer)) {
         isCorrect = answerString === currentQ.correctAnswer.join(' ');
      }
    } else if (currentQ.type === 'speak') {
      // Fuzzy match for speaking
      const expected = (currentQ.correctAnswer as string).toLowerCase();
      const actual = spokenText.toLowerCase();
      isCorrect = actual.includes(expected) || actual === expected;
    } else {
      isCorrect = selectedOption === currentQ.correctAnswer;
    }

    if (isCorrect) {
      setStatus('correct');
      const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/correct-1.mp3`); // Mock sound
      audio.play().catch(() => {});

      // Celebration Logic
      const neonColors = ['#2563EB', '#38BDF8', '#F472B6', '#FACC15'];

      if (currentQIndex === MOCK_QUESTIONS.length - 1) {
        // --- BIG CELEBRATION FOR LESSON COMPLETE ---
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: neonColors,
            shapes: ['star', 'circle']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: neonColors,
            shapes: ['star', 'circle']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      } else {
        // --- BURST FOR CORRECT ANSWER ---
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: neonColors,
          disableForReducedMotion: true,
          scalar: 0.8,
          shapes: ['circle']
        });
      }

    } else {
      setStatus('wrong');
      if (hearts > 0) setHearts(hearts - 1);
      // Play wrong sound
      // const audio = new Audio(...); 
    }
  };

  const handleNext = () => {
    if (currentQIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setSelectedWords([]);
      setSpokenText('');
      setStatus('idle');
    } else {
      onComplete(20); // 20 XP reward
    }
  };

  const playTTS = (text: string) => {
    // Mock TTS - in production use Web Speech API SpeechSynthesis
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to set voice if available (mock)
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (status === 'correct') return;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
       // Fallback for environment without speech API
       setIsListening(true);
       setSpokenText('');
       
       // Simulate listening delay
       setTimeout(() => {
         setIsListening(false);
         const mockResult = currentQ.correctAnswer as string;
         setSpokenText(mockResult);
         
         // Auto-check for fallback
         setStatus('correct');
         const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/correct-1.mp3`);
         audio.play().catch(() => {});
       }, 2000);
       return;
    }

    // Real Speech API
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Using English/Transliteration for demo stability
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setSpokenText('');

    recognition.start();

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        
        // Auto-check if close match
        if (transcript.toLowerCase().includes((currentQ.correctAnswer as string).toLowerCase())) {
             setStatus('correct');
             const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/correct-1.mp3`);
             audio.play().catch(() => {});
             
             // Confetti for voice match
             confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#2563EB', '#38BDF8']
            });
        }
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech error", event.error);
        setIsListening(false);
        setSpokenText("Didn't catch that. Try again!");
    };

    recognition.onend = () => {
        setIsListening(false);
    };
  };

  // Render content based on question type
  const renderQuestionContent = () => {
    switch (currentQ.type) {
      case 'multiple-choice':
      case 'listen':
        return (
          <div className="grid grid-cols-1 gap-4 mt-8">
            {currentQ.type === 'listen' && (
               <div className="flex justify-center mb-8">
                 <button 
                  onClick={() => playTTS(currentQ.audioText || '')} 
                  className="bg-nova-secondary rounded-full w-28 h-28 flex items-center justify-center border-4 border-nova-primary shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-transform"
                 >
                   <Volume2 className="text-white w-12 h-12" />
                 </button>
               </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options?.map((opt, idx) => (
                <Card 
                  key={idx} 
                  selected={selectedOption === opt} 
                  onClick={() => status === 'idle' && setSelectedOption(opt)}
                  className="text-lg font-bold text-center py-6 text-slate-200"
                >
                  {opt}
                </Card>
              ))}
            </div>
          </div>
        );
      case 'translate':
        return (
          <div className="mt-8 space-y-8">
             {/* Drop Zone */}
             <div className="min-h-[80px] bg-slate-900 border-2 border-slate-700 rounded-xl flex flex-wrap gap-2 p-4 items-center">
                {selectedWords.length === 0 && <span className="text-slate-600 italic">Tap words below to translate...</span>}
                {selectedWords.map((word, idx) => (
                  <Button key={`${word}-${idx}`} variant="secondary" className="py-2 px-4 text-sm" onClick={() => setSelectedWords(prev => prev.filter((_, i) => i !== idx))}>
                    {word}
                  </Button>
                ))}
             </div>

             {/* Word Bank */}
             <div className="flex flex-wrap gap-2 justify-center">
                {currentQ.options?.map((word, idx) => {
                  const isSelected = selectedWords.includes(word);
                  return (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className={`py-2 px-4 border-slate-600 text-slate-300 hover:bg-slate-800 ${isSelected ? 'opacity-0' : 'opacity-100'}`}
                      disabled={isSelected}
                      onClick={() => setSelectedWords([...selectedWords, word])}
                    >
                      {word}
                    </Button>
                  )
                })}
             </div>
          </div>
        );
      case 'speak':
        return (
          <div className="flex flex-col items-center justify-center mt-6 space-y-8 w-full">
            {/* Target Phrase Visualizer */}
            <div className="relative w-full">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 p-6 rounded-3xl w-full text-center border-2 border-slate-800 bg-slate-900 shadow-inner">
                {currentQ.audioText}
              </div>
              {/* Phonetic Helper Hint */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-blue-200 text-xs px-3 py-1 rounded-full border border-slate-700">
                Tap mic and say this
              </div>
            </div>
      
            {/* Mic Button & Visualizer */}
            <div className="relative group">
              {isListening && (
                 <>
                  {/* Visualizer Rings */}
                  <div className="absolute inset-0 bg-nova-primary/40 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-pulse delay-75 duration-1000"></div>
                  <div className="absolute -inset-4 bg-transparent border-2 border-nova-primary/30 rounded-full animate-spin-slow border-dashed"></div>
                 </>
              )}
              <button
                onClick={startListening}
                disabled={status === 'correct'}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all active:scale-95 border-4 z-10
                  ${isListening ? 'bg-nova-primary text-white border-blue-300' : 'bg-slate-800 text-nova-primary border-slate-700 group-hover:border-nova-primary/50 group-hover:text-blue-400'}
                  ${status === 'correct' ? 'bg-green-600 text-white border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : ''}
                  ${status === 'wrong' ? 'border-red-500 text-red-500 bg-red-950/30' : ''}
                `}
              >
                <Mic size={56} strokeWidth={isListening ? 3 : 2} className={isListening ? "animate-pulse" : ""} />
              </button>
            </div>
      
            {/* Real-time Feedback Text */}
            <div className={`h-12 flex items-center justify-center font-bold text-xl transition-colors
               ${status === 'correct' ? 'text-green-400' : 'text-slate-400'}
               ${status === 'wrong' ? 'text-red-400' : ''}
            `}>
              {isListening ? (
                <span className="flex items-center gap-1">
                  <span className="w-1 h-4 bg-nova-primary animate-bounce"></span>
                  <span className="w-1 h-6 bg-nova-primary animate-bounce delay-75"></span>
                  <span className="w-1 h-3 bg-nova-primary animate-bounce delay-150"></span>
                  <span className="ml-2">Listening...</span>
                </span>
              ) : (spokenText || "Tap microphone to start")}
            </div>
          </div>
        );
      default: 
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-slate-950 sm:border-x border-slate-800 text-white overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-nova-primary/5 blur-3xl pointer-events-none rounded-b-full"></div>

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center space-x-4">
        <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors">
          <X size={28} />
        </button>
        <ProgressBar progress={progress} />
        <div className="flex items-center text-red-500 font-bold text-lg drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
          <Heart fill="currentColor" className="w-6 h-6 mr-1" /> {hearts}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 flex flex-col items-center">
         <div className="w-full max-w-lg">
            <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">{currentQ.question}</h2>
            
            {/* Mascot Helper */}
            {status === 'idle' && (
              <div className="flex mb-4 animate-bounce-slow">
                 <NovaMascot emotion="neutral" size="sm" />
                 <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none ml-2 text-blue-200 text-sm self-center border border-slate-700 shadow-lg">
                    {currentQ.type === 'speak' ? 'Speak clearly!' : 'You got this!'}
                 </div>
              </div>
            )}
            
            {renderQuestionContent()}
         </div>
      </div>

      {/* Footer / Feedback Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={status}
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          transition={{ type: "spring", damping: 20 }}
          className={`
            p-4 sm:p-6 border-t-2 w-full relative z-20 backdrop-blur-md
            ${status === 'correct' ? 'bg-green-950/80 border-green-500/30' : ''}
            ${status === 'wrong' ? 'bg-red-950/80 border-red-500/30' : ''}
            ${status === 'idle' ? 'bg-slate-900 border-slate-800' : ''}
          `}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
             {status === 'correct' && (
               <div className="flex items-center justify-between gap-4 w-full">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/20">
                     <span className="text-2xl">✓</span>
                   </div>
                   <div>
                     <div className="font-extrabold text-2xl text-green-400">Excellent!</div>
                     {/* Speaking Bonus Feedback */}
                     {currentQ.type === 'speak' && (
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-green-300/80">You said it perfectly:</span>
                          <span className="font-mono text-green-200 text-sm border border-green-500/30 px-2 rounded">{currentQ.audioText}</span>
                          <button onClick={() => playTTS(currentQ.audioText!)} className="p-1 hover:bg-green-500/20 rounded-full text-green-300">
                            <Volume2 size={14} />
                          </button>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             )}
             
             {status === 'wrong' && (
               <div className="flex flex-col w-full gap-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                       <X size={24} />
                    </div>
                    <div className="font-extrabold text-xl text-red-400">Correct Solution:</div>
                 </div>
                 
                 <div className="ml-12 p-3 bg-red-900/20 rounded-xl border border-red-500/20">
                    <div className="text-lg text-red-100 font-bold mb-1">
                      {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(' ') : currentQ.correctAnswer}
                    </div>
                    {/* Pronunciation Guide for Speak/Listen errors */}
                    {(currentQ.type === 'speak' || currentQ.type === 'listen') && (
                      <div className="flex items-center gap-3 mt-2 border-t border-red-500/20 pt-2">
                        {currentQ.options?.[0] && (
                           <span className="text-sm text-red-300 italic font-mono">"{currentQ.options[0]}"</span>
                        )}
                        <button 
                          onClick={() => playTTS(currentQ.audioText || (currentQ.correctAnswer as string))} 
                          className="flex items-center gap-1 text-xs font-bold text-red-300 hover:text-white uppercase tracking-wider bg-red-500/20 px-2 py-1 rounded-lg hover:bg-red-500/40 transition-colors"
                        >
                          <Volume2 size={14} /> Play Sound
                        </button>
                      </div>
                    )}
                 </div>
               </div>
             )}

             <div className="w-full">
               {status === 'idle' ? (
                 <Button 
                    fullWidth 
                    variant="primary" 
                    onClick={handleCheck}
                    className="py-4 text-lg"
                    disabled={
                      (!selectedOption && currentQ.type !== 'translate' && currentQ.type !== 'speak') || 
                      (currentQ.type === 'translate' && selectedWords.length === 0) ||
                      (currentQ.type === 'speak' && spokenText === '')
                    }
                  >
                   CHECK
                 </Button>
               ) : (
                 <Button 
                    fullWidth 
                    variant={status === 'correct' ? 'primary' : 'danger'}
                    onClick={handleNext}
                    className={`py-4 text-lg ${status === 'correct' ? 'bg-green-600 border-green-700 hover:bg-green-500 shadow-lg shadow-green-600/20' : ''}`}
                  >
                   CONTINUE
                 </Button>
               )}
             </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
