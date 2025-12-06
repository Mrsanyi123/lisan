import React, { useState, useEffect } from "react";
import {
  Home,
  Compass,
  User as UserIcon,
  Zap,
  Heart,
  Gem,
  Globe,
  Star,
  MessageCircle,
  Lock,
  LogOut,
} from "lucide-react";
import {
  NovaMascot,
  Button,
  StatBadge,
  ProgressBar,
  VideoBackground,
} from "./components/ui";
import { LessonScreen } from "./screens/LessonScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { AuthScreen } from "./screens/AuthScreen";
import { Screen, UserStats, Lesson } from "./types";
import { useAuth } from "./hooks/useAuth";

// --- MOCK DATA ---
const LANGUAGES = [
  { id: "am", name: "Amharic", native: "አማርኛ", flag: "🇪🇹" },
  { id: "om", name: "Afaan Oromo", native: "Afaan Oromoo", flag: "🌳" },
  { id: "ti", name: "Tigrinya", native: "ትግርኛ", flag: "🏔️" },
  { id: "en", name: "English", native: "English", flag: "🇺🇸" },
];

const INITIAL_STATS: UserStats = {
  hearts: 5,
  gems: 450,
  streak: 3,
  xp: 1240,
  language: "Amharic",
};

const LESSON_PATH: Lesson[] = [
  {
    id: "1",
    title: "Basics 1",
    description: "Greetings",
    locked: false,
    completed: true,
    stars: 3,
    color: "green",
    position: "center",
  },
  {
    id: "2",
    title: "Basics 2",
    description: "Common Phrases",
    locked: false,
    completed: true,
    stars: 2,
    color: "green",
    position: "left",
  },
  {
    id: "3",
    title: "Food",
    description: "Ordering & Eating",
    locked: false,
    completed: false,
    stars: 0,
    color: "purple",
    position: "right",
  },
  {
    id: "4",
    title: "Animals",
    description: "Farm & Wild",
    locked: true,
    completed: false,
    stars: 0,
    color: "green",
    position: "center",
  },
  {
    id: "5",
    title: "Family",
    description: "Members",
    locked: true,
    completed: false,
    stars: 0,
    color: "green",
    position: "left",
  },
  {
    id: "6",
    title: "Travel",
    description: "Directions",
    locked: true,
    completed: false,
    stars: 0,
    color: "yellow",
    position: "right",
  },
];

export default function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>(Screen.WELCOME);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  // Handle authentication state changes
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize

    if (!user) {
      // User not authenticated, show welcome screen
      if (
        screen !== Screen.WELCOME &&
        screen !== Screen.LOGIN &&
        screen !== Screen.SIGNUP
      ) {
        setScreen(Screen.WELCOME);
      }
    } else {
      // User is authenticated
      if (
        screen === Screen.WELCOME ||
        screen === Screen.LOGIN ||
        screen === Screen.SIGNUP
      ) {
        // Check if user has selected a language (you might want to store this in user profile)
        setScreen(Screen.HOME);
      }
    }
  }, [user, authLoading, screen]);

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <VideoBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-10 animate-bounce-slow filter drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <NovaMascot emotion="happy" size="lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
            Loading...
          </h1>
        </div>
      </VideoBackground>
    );
  }

  // --- LANDING SCREEN (Previously WELCOME) ---
  if (screen === Screen.WELCOME) {
    return (
      <VideoBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-10 animate-bounce-slow filter drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <NovaMascot emotion="happy" size="lg" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
            Lisan
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-xs font-medium drop-shadow-md">
            Master Ethiopian languages with the future of learning.
          </p>
          <div className="w-full max-w-sm space-y-4">
            <Button
              fullWidth
              variant="primary"
              onClick={() => setScreen(Screen.SIGNUP)}
              className="shadow-lg shadow-blue-500/30 border-none"
            >
              GET STARTED
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setScreen(Screen.LOGIN)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
            >
              I ALREADY HAVE AN ACCOUNT
            </Button>
          </div>
        </div>
      </VideoBackground>
    );
  }

  // --- AUTHENTICATION SCREENS ---
  if (screen === Screen.LOGIN || screen === Screen.SIGNUP) {
    return (
      <AuthScreen
        mode={screen}
        onBack={() => setScreen(Screen.WELCOME)}
        onSwitchMode={() =>
          setScreen(screen === Screen.LOGIN ? Screen.SIGNUP : Screen.LOGIN)
        }
        onSuccess={() => {
          if (screen === Screen.SIGNUP) {
            setScreen(Screen.LANG_SELECT); // New users pick a language
          } else {
            setScreen(Screen.HOME); // Returning users go home
          }
        }}
      />
    );
  }

  // --- LANGUAGE SELECT SCREEN ---
  if (screen === Screen.LANG_SELECT) {
    return (
      <VideoBackground>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto mt-10">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setScreen(Screen.WELCOME)}
                className="mr-4 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
              >
                <Globe size={24} />
              </button>
              <h2 className="text-3xl font-bold text-white drop-shadow-md">
                Choose your path
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setStats({ ...stats, language: lang.name });
                    setScreen(Screen.HOME);
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-lg group"
                >
                  <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform">
                    {lang.flag}
                  </span>
                  <span className="font-bold text-white text-lg tracking-wide">
                    {lang.name}
                  </span>
                  <span className="text-sm text-blue-200">{lang.native}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </VideoBackground>
    );
  }

  // --- LESSON SCREEN WRAPPER ---
  if (screen === Screen.LESSON) {
    return (
      <LessonScreen
        hearts={stats.hearts}
        setHearts={(h) => setStats({ ...stats, hearts: h })}
        onExit={() => setScreen(Screen.HOME)}
        onComplete={(xp) => {
          setStats((prev) => ({
            ...prev,
            xp: prev.xp + xp,
            gems: prev.gems + 10,
          }));
          setScreen(Screen.HOME);
        }}
      />
    );
  }

  // --- CHAT SCREEN WRAPPER ---
  if (screen === Screen.CHAT) {
    return (
      <ChatScreen
        onBack={() => setScreen(Screen.HOME)}
        targetLanguage={stats.language}
      />
    );
  }

  // --- HOME / PROFILE DASHBOARD ---
  const isProfile = screen === Screen.PROFILE;

  return (
    <div className="min-h-screen bg-nova-bg pb-24 md:pb-0 md:pl-64">
      {/* SIDEBAR / TOPBAR NAV */}
      <nav className="fixed bottom-0 left-0 w-full md:w-64 md:h-screen bg-white border-t md:border-t-0 md:border-r border-gray-200 z-50 flex md:flex-col justify-around md:justify-start md:p-4">
        <div className="hidden md:flex items-center gap-2 mb-8 px-4">
          <NovaMascot size="sm" emotion="happy" />
          <span className="text-2xl font-extrabold text-nova-primary tracking-wide">
            NOVA
          </span>
        </div>

        <NavItem
          icon={Home}
          label="Learn"
          isActive={screen === Screen.HOME}
          onClick={() => setScreen(Screen.HOME)}
        />
        <NavItem
          icon={Compass}
          label="Explore"
          isActive={false} // Placeholder
          onClick={() => {}}
        />
        <NavItem
          icon={MessageCircle}
          label="AI Tutor"
          isActive={false}
          onClick={() => setScreen(Screen.CHAT)}
          badge="NEW"
        />
        <NavItem
          icon={UserIcon}
          label="Profile"
          isActive={screen === Screen.PROFILE}
          onClick={() => setScreen(Screen.PROFILE)}
        />
      </nav>

      {/* HEADER STATS */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 px-4 py-3 border-b border-gray-200 flex justify-between items-center max-w-4xl mx-auto shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedLanguage.flag}</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <StatBadge icon={Zap} value={stats.streak} color="text-orange-500" />
          <StatBadge icon={Gem} value={stats.gems} color="text-blue-500" />
          <StatBadge icon={Heart} value={stats.hearts} color="text-red-500" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {/* MAIN HOME CONTENT */}
        {!isProfile && (
          <div className="flex flex-col items-center space-y-8 py-8">
            {LESSON_PATH.map((lesson, idx) => (
              <LessonNode
                key={lesson.id}
                lesson={lesson}
                onClick={() => !lesson.locked && setScreen(Screen.LESSON)}
              />
            ))}
            <div className="h-24"></div> {/* Spacer */}
          </div>
        )}

        {/* PROFILE CONTENT */}
        {isProfile && (
          <div className="space-y-6">
            <div className="flex flex-col items-center border-b pb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden p-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <NovaMascot emotion="neutral" size="md" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.displayName || "Language Explorer"}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
              {user?.metadata?.creationTime && (
                <p className="text-gray-400 text-sm">
                  Joined {new Date(user.metadata.creationTime).getFullYear()}
                </p>
              )}
            </div>

            <Button
              fullWidth
              variant="danger"
              onClick={async () => {
                await logout();
                setScreen(Screen.WELCOME);
              }}
              className="flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h3 className="font-bold text-gray-600 mb-2">Total XP</h3>
                <div className="text-2xl font-black text-nova-primary">
                  {stats.xp}
                </div>
              </div>
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h3 className="font-bold text-gray-600 mb-2">Current Streak</h3>
                <div className="text-2xl font-black text-orange-500">
                  {stats.streak} Days
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-4">
              <h3 className="font-bold text-lg mb-4">Achievements</h3>
              <div className="space-y-4">
                <AchievementRow
                  title="Wildfire"
                  desc="Reach a 3 day streak"
                  level={1}
                  max={3}
                  icon="🔥"
                  color="bg-orange-500"
                />
                <AchievementRow
                  title="Sage"
                  desc="Earn 1000 XP"
                  level={3}
                  max={3}
                  icon="🎓"
                  color="bg-nova-secondary"
                />
                <AchievementRow
                  title="Scholar"
                  desc="Learn 50 new words"
                  level={2}
                  max={5}
                  icon="📚"
                  color="bg-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS FOR APP ---

const NavItem: React.FC<{
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: string;
}> = ({ icon: Icon, label, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex md:flex-row flex-col items-center md:gap-4 p-2 md:px-4 md:py-3 rounded-xl transition-colors relative
      ${
        isActive
          ? "bg-blue-50 text-nova-primary border-blue-200 md:border-2"
          : "text-gray-400 hover:bg-gray-100"
      }
    `}
  >
    <Icon className="w-6 h-6 md:w-5 md:h-5" strokeWidth={isActive ? 2.5 : 2} />
    <span
      className={`text-[10px] md:text-sm font-bold uppercase tracking-wide mt-1 md:mt-0`}
    >
      {label}
    </span>
    {badge && (
      <span className="absolute top-1 right-2 md:top-2 md:right-2 bg-nova-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

const LessonNode: React.FC<{ lesson: Lesson; onClick: () => void }> = ({
  lesson,
  onClick,
}) => {
  const getOffset = () => {
    if (lesson.position === "left") return "-translate-x-12";
    if (lesson.position === "right") return "translate-x-12";
    return "";
  };

  const getColor = () => {
    if (lesson.locked) return "bg-gray-200 border-gray-300";
    // Map old types to new theme
    if (lesson.color === "purple")
      return "bg-nova-secondary border-nova-secondaryDark"; // Black/Slate
    if (lesson.color === "yellow")
      return "bg-nova-accent border-nova-accentDark"; // Sky Blue
    return "bg-nova-primary border-nova-primaryDark"; // Main Blue
  };

  return (
    <div className={`relative ${getOffset()}`}>
      {/* Label Tooltip */}
      {!lesson.locked && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-2 border-gray-200 px-3 py-1 rounded-xl shadow-sm text-sm font-bold text-gray-600 whitespace-nowrap z-10">
          {lesson.title}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* Button Node */}
      <button
        onClick={onClick}
        className={`w-20 h-20 rounded-full flex items-center justify-center border-b-8 active:border-b-0 active:translate-y-2 transition-transform relative z-0
          ${getColor()}
        `}
      >
        {lesson.locked ? (
          <Lock className="text-gray-400" />
        ) : (
          <div className="text-3xl relative">
            {lesson.completed ? (
              <span className="text-4xl">👑</span>
            ) : (
              <Star className="text-white/40 w-10 h-10" fill="currentColor" />
            )}

            {/* Stars ring if completed */}
            {lesson.stars > 0 && (
              <div className="absolute -bottom-1 -right-1 flex">
                {[...Array(lesson.stars)].map((_, i) => (
                  <span key={i} className="text-yellow-300 text-xs">
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

const AchievementRow: React.FC<{
  title: string;
  desc: string;
  level: number;
  max: number;
  icon: string;
  color: string;
}> = ({ title, desc, level, max, icon, color }) => (
  <div className="flex items-center gap-4">
    <div
      className={`w-14 h-14 rounded-full ${
        level === max ? color : "bg-gray-200"
      } flex items-center justify-center text-2xl text-white`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-gray-700">{title}</h4>
        <span className="text-sm font-bold text-gray-400">
          {level}/{max}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{desc}</p>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${(level / max) * 100}%` }}
        ></div>
      </div>
    </div>
  </div>
);
