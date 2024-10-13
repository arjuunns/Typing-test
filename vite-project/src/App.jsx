import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { AlertCircle, RefreshCcw, Sun, Moon } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const sampleText = "The quick brown fox jumps over the lazy dog. This sentence is often used to test typing speed because it contains every letter of the alphabet. Typing tests are a great way to improve your keyboard skills and increase your productivity. As you practice, you'll find that your fingers start to memorize common words and patterns, allowing you to type faster and more accurately. It's important to focus on accuracy as well as speed, as making too many mistakes can slow you down in the long run. Keep practicing and you'll see improvement in no time! Pack my box with five dozen liquor jugs. This pangram contains every letter of the alphabet, making it perfect for typing practice. When you're learning to type, it's crucial to maintain good posture and hand positioning. Keep your wrists straight and your fingers curved over the home row keys. As you become more comfortable, try to look at the screen instead of your hands. This will help you develop muscle memory and increase your typing speed. Remember, consistent practice is key to becoming a proficient typist.";

const wordOptions = [10, 25, 50, 100, 200];

const TypingTest = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [testActive, setTestActive] = useState(false);
  const [wordCount, setWordCount] = useState(50);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    newTest();
  }, [wordCount]);

  useEffect(() => {
    if (testActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [testActive]);

  const newTest = () => {
    const words = sampleText.split(' ');
    const selectedText = words.slice(0, wordCount).join(' ');
    setText(selectedText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setTestActive(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const startTest = () => {
    setStartTime(new Date());
    setTestActive(true);
  };

  const endTest = () => {
    setEndTime(new Date());
    setTestActive(false);
    calculateResults();
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (!testActive) {
      startTest();
    }

    // Calculate accuracy
    const correctChars = value.split('').filter((char, index) => char === text[index]).length;
    setAccuracy(Math.round((correctChars / value.length) * 100) || 100);

    // Check if test is complete (user has typed as many characters as the original text)
    if (value.length >= text.length) {
      endTest();
    }
  };

  const calculateResults = () => {
    const timeInMinutes = timeElapsed / 60;
    const wordsTyped = userInput.trim().split(/\s+/).length;
    setWpm(Math.round(wordsTyped / timeInMinutes));
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let color = darkMode ? 'text-gray-400' : 'text-gray-600';
      if (index < userInput.length) {
        color = userInput[index] === char 
          ? (darkMode ? 'text-green-400' : 'text-green-600')
          : (darkMode ? 'text-red-400' : 'text-red-600');
      }
      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Typing Speed Test</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-900'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <label htmlFor="wordCount" className="font-medium">Word Count:</label>
            <select
              id="wordCount"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
              disabled={testActive}
            >
              {wordOptions.map(option => (
                <option key={option} value={option}>{option} words</option>
              ))}
            </select>
          </div>
          <button
            onClick={newTest}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            disabled={testActive}
          >
            <RefreshCcw className="mr-2" size={18} />
            New Test
          </button>
        </div>
        
        <div className={`p-4 rounded-lg shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="text-lg font-medium leading-relaxed">{renderText()}</p>
        </div>
        
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInput}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
          }`}
          placeholder="Start typing here..."
          rows={5}
          disabled={!testActive && endTime !== null}
        />
        
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <p className="text-lg"><strong>Time:</strong> {timeElapsed}s</p>
            <p className="text-lg"><strong>WPM:</strong> {wpm}</p>
            <p className="text-lg"><strong>Accuracy:</strong> {accuracy}%</p>
          </div>
        </div>
        
        {/* {endTime && (
          // <Alert className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
          //   <AlertCircle className="h-4 w-4" />
          //   <AlertTitle>Test Completed!</AlertTitle>
          //   <AlertDescription>
          //     You completed the {wordCount}-word test in {timeElapsed} seconds, typing at {wpm} WPM with {accuracy}% accuracy.
          //   </AlertDescription>
          // </Alert>
        )} */}
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <TypingTest />
  </ThemeProvider>
);

export default App;