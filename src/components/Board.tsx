import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { TetrominoShape, TETROMINO_SHAPES } from "./Tetromino";
import { Controls } from "./Controls";

interface BoardProps {
  activeTetromino: TetrominoShape;
  setActiveTetromino: (tetromino: TetrominoShape) => void;
  nextTetromino: TetrominoShape;
  setNextTetromino: (tetromino: TetrominoShape) => void;
  stashedTetromino: TetrominoShape;
  setStashedTetromino: (tetromino: TetrominoShape) => void;
  tetrominoPosition: { x: number; y: number };
  setTetrominoPosition: (position: { x: number; y: number }) => void;
  tetrominoRotation: number;
  setTetrominoRotation: (rotation: number) => void;
  setGameOver: (gameOver: boolean) => void;
  score: number;
  setScore: (score: number) => void;
  level: number;
  setLevel: (level: number) => void;
  linesCleared: number;
  setLinesCleared: (lines: number) => void;
}

// Define the size of the board.
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Function to create an empty board.
const createEmptyBoard = () => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    new Array(BOARD_WIDTH).fill(0)
  );
};

// Function to calculate the score based on the number of lines cleared.
const calculateScore = (level: number, lines: number) => {
  if (lines === 0) return 0;
  const points = [40, 100, 300, 1200];
  return (level + 1) * points[lines - 1];
};

// Function to get a random tetromino.
export const getRandomTetromino = (): TetrominoShape => {
  const randomIndex = Math.floor(Math.random() * TETROMINO_SHAPES.length);
  return TETROMINO_SHAPES[randomIndex];
};

// Function to merge the tetromino with the board.
const mergeTetrominoWithBoard = (
  board: number[][],
  tetromino: number[][],
  position: { x: number; y: number }
): number[][] => {
  const mergedBoard = board.map((row) => row.slice());

  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      if (tetromino[y][x]) {
        mergedBoard[y + position.y][x + position.x] = tetromino[y][x];
      }
    }
  }
  return mergedBoard;
};

// Function to check for collisions between the tetromino and the board.
export const checkCollision = (
  position: { x: number; y: number },
  rotation: number,
  activeTetromino: TetrominoShape,
  board: number[][]
) => {
  // Get the rotated tetromino.
  const rotatedTetromino =
    activeTetromino.shape[rotation % activeTetromino.shape.length];
  // Loop through each cell of the tetromino shape and check for collisions
  for (let y = 0; y < rotatedTetromino.length; y++) {
    for (let x = 0; x < rotatedTetromino[y].length; x++) {
      // If the cell is not empty and it goes out of bounds or collides with an existing cell on the board, return true for a collision.
      if (
        rotatedTetromino[y][x] &&
        (board[y + position.y] === undefined ||
          board[y + position.y][x + position.x] === undefined ||
          board[y + position.y][x + position.x])
      ) {
        return true;
      }
    }
  }
  // If no collisions are found, return false.
  return false;
};

// Function to remove any full rows on the board.
const removeFullRows = (board: number[][]): [number[][], number] => {
  // Filter out any rows that have a cell with a value of 0 (empty cell).
  const newBoard = board.filter((row) => row.some((cell) => cell === 0));
  // Calculate the number of rows that were removed.
  const numberOfRowsRemoved = BOARD_HEIGHT - newBoard.length;
  // Add empty rows to the top of the board for the number of rows that were removed.
  for (let i = 0; i < numberOfRowsRemoved; i++) {
    newBoard.unshift(new Array(BOARD_WIDTH).fill(0));
  }
  // Return the new board state and the number of rows removed.
  return [newBoard, numberOfRowsRemoved];
};

// This is a functional component that represents the game board
// It takes in several props that define the state of the game
export const Board: React.FC<BoardProps> = ({
  activeTetromino, // the currently active tetromino piece
  setActiveTetromino, // a function to set the active tetromino piece
  stashedTetromino, // the currently active tetromino piece
  setStashedTetromino, // a function to set the active tetromino piece
  nextTetromino, // the currently active tetromino piece
  setNextTetromino, // a function to set the active tetromino piece
  tetrominoPosition, // the position of the active tetromino piece on the board
  setTetrominoPosition, // a function to set the position of the active tetromino piece
  tetrominoRotation, // the rotation of the active tetromino piece
  setTetrominoRotation, // a function to set the rotation of the active tetromino piece
  setGameOver, // a function to set the game over flag
  setScore, // a function to set the score
  score, // the current score
  level, // the current level
  setLevel, // a function to set the level
  linesCleared, // the number of lines cleared so far
  setLinesCleared, // a function to set the number of lines cleared
}) => {
  // Define the board state using the createEmptyBoard function
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());

  // Use an effect to check if the number of lines cleared is greater than or equal to 10
  // If it is, increase the level by 1 and reset the number of lines cleared to 0
  useEffect(() => {
    if (linesCleared >= 10) {
      setLevel(level + 1);
      setLinesCleared(0);
    }
  }, [linesCleared, setLevel, setLinesCleared]);

  // Use an effect to update the position of the active tetromino piece on the board
  // This effect runs every 500ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check if the tetromino piece can be moved down
      if (
        !checkCollision(
          { x: tetrominoPosition.x, y: tetrominoPosition.y + 1 },
          tetrominoRotation,
          activeTetromino,
          board
        )
      ) {
        // If it can, move the tetromino piece down one row
        setTetrominoPosition({
          x: tetrominoPosition.x,
          y: tetrominoPosition.y + 1,
        });
      } else {
        // If it can't, merge the tetromino piece with the board
        const newBoard = mergeTetrominoWithBoard(
          board,
          activeTetromino.shape[tetrominoRotation],
          tetrominoPosition
        );
        // Remove any full rows from the board and update the score
        const [updatedBoard, numberOfRowsRemoved] = removeFullRows(newBoard);
        setBoard(updatedBoard);
        setLinesCleared(linesCleared + numberOfRowsRemoved);
        setScore(score + calculateScore(level, numberOfRowsRemoved));
        // If the tetromino piece is at the top of the board, set the game over flag
        if (tetrominoPosition.y === 0) {
          setGameOver(true);
        } else {
          // Otherwise, reset the tetromino position and rotation, and set a new random tetromino piece
          setTetrominoPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
          setTetrominoRotation(0);
          setActiveTetromino(nextTetromino);
          setNextTetromino(getRandomTetromino());
        }
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [board, activeTetromino, tetrominoPosition, tetrominoRotation]);

  const activeTetrominoShape = activeTetromino.shape[tetrominoRotation];

  return (
    <div className="board">
      {board.map((row, y) =>
        row.map((cell, x) => {
          // Determine if the current cell is part of the active tetromino shape
          const isInActiveTetromino =
            y >= tetrominoPosition.y &&
            x >= tetrominoPosition.x &&
            y < tetrominoPosition.y + activeTetrominoShape.length &&
            x < tetrominoPosition.x + activeTetrominoShape[0].length &&
            activeTetrominoShape[y - tetrominoPosition.y][
              x - tetrominoPosition.x
            ] !== 0;
          // Determine the value of the cell based on whether it is part of the active tetromino shape or not
          const cellValue = isInActiveTetromino
            ? activeTetrominoShape[y - tetrominoPosition.y][
                x - tetrominoPosition.x
              ]
            : cell;
          // Return a Cell component for the current cell
          return <Cell key={`${x}-${y}`} value={cellValue} />;
        })
      )}
      {/* Render the controls for moving and rotating the active tetromino */}
      <Controls
        onMoveLeft={() => {
          // Check if moving left is a valid move
          if (
            !checkCollision(
              { x: tetrominoPosition.x - 1, y: tetrominoPosition.y },
              tetrominoRotation,
              activeTetromino,
              board
            )
          ) {
            setTetrominoPosition({
              x: tetrominoPosition.x - 1,
              y: tetrominoPosition.y,
            });
          }
        }}
        onMoveRight={() => {
          if (
            // Check if moving right is a valid move
            !checkCollision(
              { x: tetrominoPosition.x + 1, y: tetrominoPosition.y },
              tetrominoRotation,
              activeTetromino,
              board
            )
          ) {
            setTetrominoPosition({
              x: tetrominoPosition.x + 1,
              y: tetrominoPosition.y,
            });
          }
        }}
        onMoveDown={() => {
          // Check if moving down is a valid move
          if (
            !checkCollision(
              { x: tetrominoPosition.x, y: tetrominoPosition.y + 1 },
              tetrominoRotation,
              activeTetromino,
              board
            )
          ) {
            // Move the tetromino down one cell
            setTetrominoPosition({
              x: tetrominoPosition.x,
              y: tetrominoPosition.y + 1,
            });
          }
        }}
        onDrop={() => {
          let newY = tetrominoPosition.y;
          // Drop the tetromino down as far as it can go
          while (
            !checkCollision(
              { x: tetrominoPosition.x, y: newY + 1 },
              tetrominoRotation,
              activeTetromino,
              board
            )
          ) {
            newY++;
          }
          // Set the tetromino to its new position
          setTetrominoPosition({ x: tetrominoPosition.x, y: newY });
        }}
        onRotate={() => {
          const handleRotation = () => {
            // Calculate the new rotation value
            const newRotation = (tetrominoRotation + 1) % 4;
            const newPosition = {
              x: tetrominoPosition.x,
              y: tetrominoPosition.y,
            };
            // Check if the new rotation is valid
            if (
              !checkCollision(newPosition, newRotation, activeTetromino, board)
            ) {
              // Set the tetromino to its new rotation value
              setTetrominoRotation(newRotation);
            } else {
              // Attempt wall kick
              const wallKickOffset = [-1, 1, -2, 2];
              for (const offset of wallKickOffset) {
                newPosition.x = tetrominoPosition.x + offset;
                if (
                  !checkCollision(
                    newPosition,
                    newRotation,
                    activeTetromino,
                    board
                  )
                ) {
                  // If a wall kick is successful, set the tetromino to its new position and rotation
                  setTetrominoRotation(newRotation);
                  setTetrominoPosition(newPosition);
                  break;
                }
              }
            }
          };
          if (!(activeTetromino.type === "O")) {
            handleRotation();
          }
        }}
        onStash={() => {
          if (
            !checkCollision(
              { x: tetrominoPosition.x - 1, y: tetrominoPosition.y },
              tetrominoRotation,
              activeTetromino,
              board
            )
          ) {
            if (!stashedTetromino) {
              setStashedTetromino(activeTetromino);
              setActiveTetromino(nextTetromino);
              setNextTetromino(getRandomTetromino());
            } else {
              const tempTetromino = activeTetromino;
              setActiveTetromino(stashedTetromino);
              setStashedTetromino(tempTetromino);
            }
          }
        }}
      />
    </div>
  );
};
