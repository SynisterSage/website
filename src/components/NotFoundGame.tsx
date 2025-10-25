import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, X } from 'lucide-react'

interface Obstacle {
  x: number
  width: number
  height: number
}

interface NotFoundGameProps {
  isActive: boolean
  onClose?: () => void
}

export default function NotFoundGame({ isActive, onClose }: NotFoundGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const raw = localStorage.getItem('soundEnabled')
      return raw === null ? false : raw === 'false'
    } catch {
      return false
    }
  })
  const gameLoopRef = useRef<number | undefined>(undefined)
  
  // Audio refs
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null)
  const scoreSoundRef = useRef<HTMLAudioElement | null>(null)
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null)
  
  // Game state
  const playerRef = useRef({
    x: 50,
    y: 200,
    width: 40,
    height: 50,
    velocityY: 0,
    jumping: false,
    gravity: 0.7,
    jumpStrength: -13
  })
  
  const obstaclesRef = useRef<Obstacle[]>([])
  const groundY = 250
  const gameSpeed = useRef(6)
  const scoreRef = useRef(0)
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const isActiveRef = useRef(isActive)
  const isMutedRef = useRef(isMuted)

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('404-game-high-score')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10))
    }
  }, [])

  // Initialize audio
  useEffect(() => {
    // Create simple audio using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Jump sound - short beep
    const createJumpSound = () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 400
      oscillator.type = 'square'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
    
    // Score sound - higher pitched beep
    const createScoreSound = () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.15)
    }
    
    // Game over sound - descending tone
    const createGameOverSound = () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3)
      oscillator.type = 'sawtooth'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
    
    // Store sound functions
    jumpSoundRef.current = { play: createJumpSound } as any
    scoreSoundRef.current = { play: createScoreSound } as any
    gameOverSoundRef.current = { play: createGameOverSound } as any
    
    return () => {
      audioContext.close()
    }
  }, [])

  // Sync refs with state
  useEffect(() => {
    gameOverRef.current = gameOver
  }, [gameOver])

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  // Listen for global sound toggle (same-window) and storage changes (other tabs)
  useEffect(() => {
    const handler = (e: Event | StorageEvent) => {
      try {
        // CustomEvent from same-window
        const detail = (e as CustomEvent).detail
        if (typeof detail !== 'undefined') {
          setIsMuted(!detail)
          return
        }
        // StorageEvent from other tabs
        const se = e as StorageEvent
        if (se.key === 'soundEnabled') {
          setIsMuted(se.newValue === 'false')
        }
      } catch {}
    }

    window.addEventListener('sound-toggle', handler as EventListener)
    window.addEventListener('storage', handler as EventListener)
    return () => {
      window.removeEventListener('sound-toggle', handler as EventListener)
      window.removeEventListener('storage', handler as EventListener)
    }
  }, [])

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (!isMutedRef.current && soundRef.current) {
      try {
        soundRef.current.play()
      } catch (e) {
        // Ignore audio errors
      }
    }
  }

  const handleClose = () => {
    // Cancel game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
      gameLoopRef.current = undefined
    }
    
    // Reset game state
    gameStartedRef.current = false
    gameOverRef.current = false
    setGameOver(false)
    setScore(0)
    scoreRef.current = 0
    obstaclesRef.current = []
    
    // Call parent close handler
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleJump = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return
      
      e.preventDefault()
      
      if (gameOverRef.current) {
        resetGame()
        return
      }
      
      if (!gameStartedRef.current) {
        gameStartedRef.current = true
        resetGame()
        return
      }
      
      const player = playerRef.current
      if (!player.jumping) {
        player.velocityY = player.jumpStrength
        player.jumping = true
        playSound(jumpSoundRef)
      }
    }

    const handleClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      if (gameOverRef.current) {
        resetGame()
        return
      }
      
      const player = playerRef.current
      if (!player.jumping) {
        player.velocityY = player.jumpStrength
        player.jumping = true
        playSound(jumpSoundRef)
      }
    }

    window.addEventListener('keydown', handleJump)
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('touchstart', handleClick)

    // Start game loop immediately when active (only once)
    if (!gameStartedRef.current) {
      gameStartedRef.current = true
      resetGame()
    }

    return () => {
      window.removeEventListener('keydown', handleJump)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('touchstart', handleClick)
      // Don't cancel animation frame on unmount to preserve game state
    }
  }, [isActive]) // Only depend on isActive

  const resetGame = () => {
    const player = playerRef.current
    player.y = 200
    player.velocityY = 0
    player.jumping = false
    obstaclesRef.current = []
    gameSpeed.current = 6
    scoreRef.current = 0
    setScore(0)
    setGameOver(false)
    gameOverRef.current = false
    gameStartedRef.current = true
    
    // Cancel any existing loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
      gameLoopRef.current = undefined
    }
    
    // Start new loop
    requestAnimationFrame(gameLoop)
  }

  const spawnObstacle = () => {
    const obstacles = obstaclesRef.current
    const lastObstacle = obstacles[obstacles.length - 1]
    
    // Adjust spawn distance based on score - gets tighter after 100
    let minDistance = 200
    let maxDistance = 400
    
    if (scoreRef.current >= 100) {
      // Comically impossible mode - very tight spacing
      minDistance = 80
      maxDistance = 120
    } else if (scoreRef.current >= 50) {
      // Getting harder
      minDistance = 150
      maxDistance = 250
    }
    
    if (!lastObstacle || lastObstacle.x < maxDistance - Math.random() * minDistance) {
      // Vary obstacle height - taller after 100
      let minHeight = 30
      let maxHeight = 40
      
      if (scoreRef.current >= 100) {
        // Much taller obstacles in impossible mode
        minHeight = 50
        maxHeight = 80
      } else if (scoreRef.current >= 50) {
        minHeight = 35
        maxHeight = 60
      }
      
      const height = minHeight + Math.random() * (maxHeight - minHeight)
      obstacles.push({
        x: 600,
        width: 25,
        height
      })
    }
  }

  const gameLoop = () => {
    if (!isActiveRef.current || gameOverRef.current) {
      // Still continue loop to check state, but don't update game
      gameLoopRef.current = requestAnimationFrame(gameLoop)
      return
    }
    
    const canvas = canvasRef.current
    if (!canvas) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
      return
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const player = playerRef.current
    const obstacles = obstaclesRef.current

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get theme colors from CSS
    const isDark = document.documentElement.classList.contains('dark')
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8660a9'
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || (isDark ? '#ffffff' : '#111827')
    const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || (isDark ? '#9ca3af' : '#6b7280')

    // Draw grid background (like your pages)
    ctx.strokeStyle = accentColor + '15' // 15 = ~8% opacity
    ctx.lineWidth = 1
    const gridSize = 40
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw ground line
    ctx.strokeStyle = mutedColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, groundY)
    ctx.lineTo(canvas.width, groundY)
    ctx.stroke()

    // Update player physics
    player.velocityY += player.gravity
    player.y += player.velocityY

    // Ground collision
    if (player.y + player.height >= groundY) {
      player.y = groundY - player.height
      player.velocityY = 0
      player.jumping = false
    }

    // Draw player (designer character - simple geometric shape)
    ctx.fillStyle = accentColor
    ctx.shadowBlur = 10
    ctx.shadowColor = accentColor
    
    // Body
    ctx.fillRect(player.x, player.y, player.width, player.height)
    
    // Reset shadow
    ctx.shadowBlur = 0

    // Spawn obstacles
    if (gameStartedRef.current && !gameOverRef.current) {
      spawnObstacle()
    }

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i]
      
      if (gameStartedRef.current && !gameOverRef.current) {
        obstacle.x -= gameSpeed.current
      }

      // Draw obstacle (geometric cactus-like shape)
      ctx.fillStyle = textColor
      ctx.fillRect(
        obstacle.x,
        groundY - obstacle.height,
        obstacle.width,
        obstacle.height
      )

      // Collision detection
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y + player.height > groundY - obstacle.height
      ) {
        setGameOver(true)
        gameOverRef.current = true
        gameStartedRef.current = false
        playSound(gameOverSoundRef)
        return // Stop the loop
      }

      // Remove off-screen obstacles and increment score
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(i, 1)
        scoreRef.current += 1
        setScore(scoreRef.current)
        playSound(scoreSoundRef)
        
        // Update high score
        if (scoreRef.current > highScore) {
          const newHighScore = scoreRef.current
          setHighScore(newHighScore)
          localStorage.setItem('404-game-high-score', newHighScore.toString())
        }
        
        // Increase difficulty - gets crazy after 100
        if (scoreRef.current >= 100) {
          // Impossible mode - speed increases every point
          gameSpeed.current += 0.3
        } else if (scoreRef.current >= 50) {
          // Hard mode - speed increases every 3 points
          if (scoreRef.current % 3 === 0) {
            gameSpeed.current += 0.5
          }
        } else {
          // Normal mode - speed increases every 5 points
          if (scoreRef.current % 5 === 0) {
            gameSpeed.current += 0.5
          }
        }
      }
    }

    // Draw score
    ctx.fillStyle = mutedColor
    ctx.font = 'bold 20px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${scoreRef.current}`, 20, 30)

    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }

  if (!isActive) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          {/* Control buttons */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-[var(--bg)] border border-[var(--muted)] rounded-lg hover:bg-[var(--accent)]/10 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[var(--muted)]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[var(--accent)]" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-2 bg-[var(--bg)] border border-[var(--muted)] rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-colors group"
              aria-label="Close game"
            >
              <X className="w-4 h-4 text-[var(--muted)] group-hover:text-red-500" />
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="border-2 border-[var(--muted)] rounded-lg bg-[var(--bg)] cursor-pointer max-w-full"
            style={{ 
              imageRendering: 'crisp-edges',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
          
          {gameOver && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm rounded-lg cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                resetGame()
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
                resetGame()
              }}
            >
              <div className="text-center pointer-events-none">
                <p className="text-3xl font-bold text-accent mb-2">Game Over!</p>
                <p className="text-xl text-[var(--text)] mb-1">Score: {score}</p>
                {highScore > 0 && (
                  <p className="text-lg text-[var(--muted)] mb-4">
                    High Score: <span className="text-accent font-semibold">{highScore}</span>
                  </p>
                )}
                <p className="text-sm text-[var(--muted)]">
                  <span className="hidden md:inline">Press <kbd className="px-2 py-1 bg-[var(--accent)]/20 rounded">SPACE</kbd> or </span>
                  <kbd className="px-2 py-1 bg-[var(--accent)]/20 rounded">
                    <span className="md:hidden">Tap</span>
                    <span className="hidden md:inline">Click</span>
                  </kbd>{' '}to restart
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
