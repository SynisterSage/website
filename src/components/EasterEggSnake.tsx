import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { gameAudio } from '../utils/gameAudio';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: number;
  id?: string;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120; // Sweet spot - responsive but not too fast (was 250)
const SPEED_INCREMENT = 1.5; // Subtle but noticeable increase (was 0.8)
const MIN_SPEED = 70; // Can get a bit faster for challenge (was 150)

// Get random direction
const getRandomDirection = (): Direction => {
  const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  return directions[Math.floor(Math.random() * directions.length)];
};

// Get random spawn position (not too close to edges)
const getRandomSpawnPosition = (): Position => {
  return {
    x: Math.floor(Math.random() * (GRID_SIZE - 6)) + 3,
    y: Math.floor(Math.random() * (GRID_SIZE - 6)) + 3,
  };
};

export default function EasterEggSnake({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('snakeHighScore') || '0');
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [username, setUsername] = useState(() => {
    try {
      return sessionStorage.getItem('snakeUsername') || '';
    } catch {
      return '';
    }
  });
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);

  // Game state refs (not reactive, updated in game loop)
  const initialSpawn = useRef(getRandomSpawnPosition());
  const initialDirection = useRef(getRandomDirection());
  const snake = useRef<Position[]>([initialSpawn.current]);
  const direction = useRef<Direction>(initialDirection.current);
  const nextDirection = useRef<Direction>(initialDirection.current);
  const food = useRef<Position>({ x: 15, y: 15 });
  const gameLoopRef = useRef<number | null>(null);
  const speedRef = useRef(INITIAL_SPEED);
  const isPausedRef = useRef(false); // Use ref to avoid recreating gameLoop

  // Sync isPaused state with ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Try localStorage first (for local development)
      const localScores = localStorage.getItem('snakeLeaderboard');
      if (localScores) {
        const parsed = JSON.parse(localScores);
        // Filter to only show highest score per user
        const uniqueScores = parsed.reduce((acc: LeaderboardEntry[], current: LeaderboardEntry) => {
          const existing = acc.find(entry => entry.username.toLowerCase() === current.username.toLowerCase());
          if (!existing) {
            acc.push(current);
          } else if (current.score > existing.score) {
            // Replace with higher score
            const index = acc.indexOf(existing);
            acc[index] = current;
          }
          return acc;
        }, []);
        uniqueScores.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
        setLeaderboard(uniqueScores.slice(0, 10));
      }

      // Also try API (for production)
      const response = await fetch('/api/snake-leaderboard');
      if (response.ok) {
        const data = await response.json();
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      }
    } catch (error) {
      console.log('Using local leaderboard storage');
    }
  };

  const submitScore = async () => {
    if (!username.trim() || score === 0) return;

    setSubmittingScore(true);
    try {
      // Save username to session
      sessionStorage.setItem('snakeUsername', username.trim());

      const newEntry: LeaderboardEntry = {
        username: username.trim(),
        score,
        timestamp: Date.now(),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Try API first (for production)
      try {
        const response = await fetch('/api/snake-leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), score }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.leaderboard) {
            setLeaderboard(data.leaderboard);
            setShowUsernameInput(false);
            // Don't auto-show leaderboard on auto-submit
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using local storage');
      }

      // Fallback to localStorage (for local development)
      const localScores = localStorage.getItem('snakeLeaderboard');
      let scores: LeaderboardEntry[] = localScores ? JSON.parse(localScores) : [];
      
      // Check if user already has a score
      const existingEntry = scores.find(entry => entry.username.toLowerCase() === username.trim().toLowerCase());
      
      // Only update if new score is higher OR user doesn't exist
      if (!existingEntry || score > existingEntry.score) {
        // Remove any existing entries for this user
        scores = scores.filter(entry => entry.username.toLowerCase() !== username.trim().toLowerCase());
        
        // Add new score
        scores.push(newEntry);
        
        // Sort and keep top 50 for storage
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 50);
        
        localStorage.setItem('snakeLeaderboard', JSON.stringify(scores));
      }
      
      // Always fetch and display the latest leaderboard
      await fetchLeaderboard();
      setShowUsernameInput(false);
      // Don't auto-show leaderboard on auto-submit
    } catch (error) {
      console.error('Failed to submit score:', error);
    } finally {
      setSubmittingScore(false);
    }
  };

  // Generate random food position
  const generateFood = useCallback((): Position => {
    const newFood: Position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Make sure food doesn't spawn on snake
    const onSnake = snake.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    return onSnake ? generateFood() : newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snake.current.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Main game loop
  const gameLoop = useCallback(() => {
    // Use ref to check pause state to avoid recreating callback
    if (gameOver || isPausedRef.current) {
      // Clear any scheduled loops when paused or game over
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // Update direction
    direction.current = nextDirection.current;

    // Calculate new head position
    const head = { ...snake.current[0] };
    switch (direction.current) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check collision
    if (checkCollision(head)) {
      setGameOver(true);
      gameAudio.gameOver();
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('snakeHighScore', score.toString());
        } catch {}
      }
      // Show username input if score > 0 and user hasn't set username
      if (score > 0 && !username.trim()) {
        setShowUsernameInput(true);
      } else if (score > 0 && username.trim()) {
        // Auto-submit if username exists
        submitScore();
      }
      return;
    }

    // Add new head
    snake.current.unshift(head);

    // Check if snake ate food
    if (head.x === food.current.x && head.y === food.current.y) {
      setScore(prev => prev + 10);
      food.current = generateFood();
      gameAudio.eatFood();
      // Speed up slightly (more gradual progression)
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
    } else {
      // Remove tail if no food eaten
      snake.current.pop();
    }

    // Draw game
    draw();

    // Schedule next frame
    gameLoopRef.current = window.setTimeout(gameLoop, speedRef.current);
  }, [gameOver, score, highScore, checkCollision, generateFood, username, submitScore]);

  // Draw game on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get accent color from CSS variable
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food with glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = accentColor;
    ctx.fillStyle = accentColor;
    ctx.fillRect(
      food.current.x * CELL_SIZE + 2,
      food.current.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );
    ctx.shadowBlur = 0;

    // Draw snake with gradient
    snake.current.forEach((segment, index) => {
      const opacity = 1 - (index / snake.current.length) * 0.5;
      
      // Parse RGB from hex
      const r = parseInt(accentColor.slice(1, 3), 16);
      const g = parseInt(accentColor.slice(3, 5), 16);
      const b = parseInt(accentColor.slice(5, 7), 16);
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      // Head gets extra glow
      if (index === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.fillStyle = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 1)`;
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
        ctx.shadowBlur = 0;
      }
    });
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (gameOver && e.key === ' ') {
        // Restart game with random spawn
        const newSpawn = getRandomSpawnPosition();
        const newDir = getRandomDirection();
        snake.current = [newSpawn];
        direction.current = newDir;
        nextDirection.current = newDir;
        food.current = generateFood();
        speedRef.current = INITIAL_SPEED;
        setScore(0);
        setGameOver(false);
        setShowUsernameInput(false);
        setShowLeaderboard(false);
        gameAudio.gameStart();
        return;
      }

      if (gameOver) return;

      // Pause/unpause
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      // Change direction (prevent 180° turns)
      const newDirection =
        e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' ? 'UP' :
        e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' ? 'DOWN' :
        e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ? 'LEFT' :
        e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' ? 'RIGHT' :
        null;

      if (newDirection) {
        const opposite = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        };
        if (opposite[newDirection] !== direction.current) {
          nextDirection.current = newDirection;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, gameOver, generateFood]);

  // Touch/swipe controls for mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameOver) return;
      
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 30; // Minimum swipe distance in pixels
      
      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        // Horizontal swipe
        const newDirection = deltaX > 0 ? 'RIGHT' : 'LEFT';
        const opposite = { LEFT: 'RIGHT', RIGHT: 'LEFT', UP: 'DOWN', DOWN: 'UP' };
        if (opposite[newDirection] !== direction.current) {
          nextDirection.current = newDirection;
        }
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
        // Vertical swipe
        const newDirection = deltaY > 0 ? 'DOWN' : 'UP';
        const opposite = { LEFT: 'RIGHT', RIGHT: 'LEFT', UP: 'DOWN', DOWN: 'UP' };
        if (opposite[newDirection] !== direction.current) {
          nextDirection.current = newDirection;
        }
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [gameOver]);

  // Start game loop
  useEffect(() => {
    gameAudio.gameStart();
    gameLoopRef.current = window.setTimeout(gameLoop, speedRef.current);
    
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Resume/pause game loop when isPaused changes
  useEffect(() => {
    if (!isPaused && !gameOver && gameLoopRef.current === null) {
      // Resume - restart the game loop
      gameLoopRef.current = window.setTimeout(gameLoop, speedRef.current);
    } else if (isPaused && gameLoopRef.current) {
      // Pause - stop the game loop
      clearTimeout(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, [isPaused, gameOver, gameLoop]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative glass rounded-2xl p-4 sm:p-8 max-w-[95vw] sm:max-w-none mx-4"
          style={{
            background: 'rgba(20, 20, 30, 0.85)',
            border: '1px solid rgba(136, 120, 238, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--accent)' }}
                title="Leaderboard"
              >
                <Trophy size={20} className="sm:w-6 sm:h-6" />
              </button>
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-1 sm:gap-2" style={{ 
                color: 'var(--accent)',
                textShadow: '0 2px 8px rgba(136, 120, 238, 0.5)'
              }}>
                <span className="text-xl sm:text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(136, 120, 238, 0.5))' }}>🐍</span>
                <span>Snake Game</span>
              </h2>
              <button
                onClick={onClose}
                className="p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              <div>Score: <span className="font-bold" style={{ color: 'var(--accent)' }}>{score}</span></div>
              <div>High Score: <span className="font-bold" style={{ color: 'var(--accent)' }}>{highScore}</span></div>
            </div>
          </div>

          {/* Game canvas */}
          <div className="relative flex justify-center">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="rounded-lg max-w-full h-auto"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                maxWidth: '400px',
                width: '100%',
              }}
            />

            {/* Game over overlay */}
            {gameOver && !showUsernameInput && !showLeaderboard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-center px-4">
                  <div className="text-4xl mb-4">💀</div>
                  <div className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
                    Game Over!
                  </div>
                  <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                    Score: {score}
                  </div>
                  {score > 0 && (
                    <button
                      onClick={() => setShowLeaderboard(true)}
                      className="text-xs mb-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
                      View Leaderboard
                    </button>
                  )}
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    <span className="hidden sm:inline">Press SPACE to restart</span>
                    <span className="sm:hidden">Tap to restart</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Username input overlay */}
            {gameOver && showUsernameInput && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-center px-6 max-w-xs">
                  <div className="text-2xl mb-3">🏆</div>
                  <div className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Great Score!
                  </div>
                  <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                    Score: {score}
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitScore();
                      if (e.key === 'Escape') setShowUsernameInput(false);
                    }}
                    placeholder="Enter your name..."
                    maxLength={20}
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg mb-3 text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(136, 120, 238, 0.3)',
                      color: 'var(--accent)',
                      outline: 'none',
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitScore}
                      disabled={!username.trim() || submittingScore}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      style={{
                        background: 'var(--accent)',
                        color: '#fff',
                      }}
                    >
                      {submittingScore ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      onClick={() => setShowUsernameInput(false)}
                      className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                      style={{ color: 'var(--muted)' }}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Leaderboard overlay */}
            {gameOver && showLeaderboard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-center px-4 w-full max-w-sm">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Trophy size={20} style={{ color: 'var(--accent)' }} />
                    <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                      Leaderboard
                    </div>
                  </div>
                  <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
                    {leaderboard.length === 0 ? (
                      <div className="text-xs py-4" style={{ color: 'var(--muted)' }}>
                        No scores yet. Be the first!
                      </div>
                    ) : (
                      leaderboard.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="flex justify-between items-center px-3 py-2 rounded text-xs"
                          style={{
                            background: index === 0 ? 'rgba(136, 120, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text)',
                            border: index === 0 ? '1px solid rgba(136, 120, 238, 0.3)' : 'none',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span style={{ 
                              color: index === 0 ? 'var(--accent)' : 'var(--muted)',
                              fontWeight: index === 0 ? 'bold' : 'normal'
                            }}>
                              {index === 0 ? '🏆' : `${index + 1}.`}
                            </span>
                            <span className="font-medium">{entry.username}</span>
                          </div>
                          <span style={{ 
                            color: 'var(--accent)',
                            fontWeight: index === 0 ? 'bold' : 'normal'
                          }}>{entry.score}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="text-xs px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--muted)' }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

            {/* Pause overlay */}
            {isPaused && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 font-bold" style={{ color: 'var(--accent)' }}>
                    ⏸
                  </div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                    Paused
                  </div>
                  <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                    Press SPACE to resume
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls hint */}
          <div className="text-center mt-4 text-[10px] sm:text-xs" style={{ color: 'var(--muted)', paddingTop: '2px' }}>
            <div className="mb-1 hidden sm:block">Arrow Keys or WASD to move</div>
            <div className="mb-1 sm:hidden">Swipe to move</div>
            <div className="hidden sm:block">SPACE to pause • ESC to exit</div>
            <div className="sm:hidden">Tap outside to exit</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
