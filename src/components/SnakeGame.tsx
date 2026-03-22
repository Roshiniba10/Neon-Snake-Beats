import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Point, Direction } from '../types';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 100;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 ||
          newHead.x >= CANVAS_SIZE / GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= CANVAS_SIZE / GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Food - Matrix Green Square
    ctx.fillStyle = '#00FF41';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00FF41';
    ctx.fillRect(food.x * GRID_SIZE + 4, food.y * GRID_SIZE + 4, GRID_SIZE - 8, GRID_SIZE - 8);

    // Snake - Glowing Green
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00FF41' : 'rgba(0, 255, 65, 0.4)';
      ctx.shadowBlur = index === 0 ? 15 : 0;
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black border-4 border-magenta-500 shadow-[8px_8px_0_#f0f,-8px_-8px_0_#0ff]">
      <div className="flex justify-between w-full font-mono text-xs">
        <div className="flex flex-col">
          <span className="text-[#00FF41] opacity-50 uppercase tracking-widest">DATA_HARVESTED</span>
          <span className="text-3xl text-[#00FF41] terminal-glow">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#00FF41] opacity-50 uppercase tracking-widest">PEAK_EFFICIENCY</span>
          <span className="text-3xl text-[#00FF41] terminal-glow">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-2 border-[#00FF41]/30">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black"
        />
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 transition-all duration-300">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-[#00FF41] mb-4 terminal-glow">SYSTEM_FAILURE</h2>
                <p className="text-[#00FF41]/70 mb-8">RECOVERY_INDEX: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                >
                  REBOOT_CORE
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-[#00FF41] mb-8 terminal-glow">HALT_COMMAND</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                >
                  RESUME_PROCESS
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between w-full text-[10px] font-mono text-cyan-900">
        <span>INPUT_VECTORS: ARROWS</span>
        <span>INTERRUPT: SPACE</span>
      </div>
    </div>
  );
};
