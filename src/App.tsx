import React, { useState, useEffect } from "react";
import "./App.css";
import { TetrominoShape, TETROMINO_SHAPES } from "./components/Tetromino";
import { Board } from "./components/Board";
import { StashedTetromino, NextTetromino } from "./components/TetrominoPreview";

const getRandomTetromino = () => {
  const randomIndex = Math.floor(Math.random() * TETROMINO_SHAPES.length);
  return TETROMINO_SHAPES[randomIndex];
};

const App: React.FC = () => {
  const [activeTetromino, setActiveTetromino] = useState(getRandomTetromino());
  const [tetrominoPosition, setTetrominoPosition] = useState({ x: 4, y: 0 });
  const [tetrominoRotation, setTetrominoRotation] = useState(0);
  const [stashedTetromino, setStashedTetromino] = useState(getRandomTetromino());
  const [level, setLevel] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [nextTetromino, setNextTetromino] = useState(getRandomTetromino());

  const spawnNewTetromino = () => {
    setActiveTetromino(getRandomTetromino());
    setTetrominoPosition({ x: 4, y: 0 });
    setTetrominoRotation(0);
  };

  useEffect(() => {
    spawnNewTetromino();
  }, []);

  return (
    <div className="App">
      <div>
        <NextTetromino NextTetromino={nextTetromino} />
        <StashedTetromino StashedTetromino={stashedTetromino} />
      </div>
      <div>
        <div className="level-container">level: {level}</div>
        <Board
          {...{
            activeTetromino,
            nextTetromino,
            stashedTetromino,
            tetrominoPosition,
            tetrominoRotation,
            setActiveTetromino,
            setNextTetromino,
            setStashedTetromino,
            setTetrominoPosition,
            setTetrominoRotation,
            setGameOver,
            score,
            setScore,
            level,
            setLevel,
            linesCleared,
            setLinesCleared,
          }}
        />
        <div className="score-container">Score: {score}</div>
      </div>
      {gameOver && (
        <div className="overlay">
          <div className="game-over">Game Over</div>
        </div>
      )}
    </div>
  );
};

export default App;
