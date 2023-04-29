import React from "react";
import { TetrominoShape } from "./Tetromino";

interface TetrominoPreviewProps {
  tetromino: TetrominoShape;
  title: string;
}

const TetrominoPreview: React.FC<TetrominoPreviewProps> = ({
  tetromino,
  title,
}) => {
  const paddingLeft =
    {
      I: 20,
      L: 20,
      J: 20,
      T: 10,
    }[tetromino.type] || 0;

  return (
    <div className="tetromino-preview-container">
      <div className="tetromino-preview-title">{title}</div>
      <div className="tetromino-preview" style={{ paddingLeft }}>
        {tetromino.shape[0].map((row, i) => (
          <div key={i} className="tetromino-preview-row">
            {row.map((cell, j) => (
              <div
                key={j}
                className="tetromino-preview-cell"
                style={{
                  backgroundColor: tetromino.color,
                  visibility: cell ? "visible" : "hidden",
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const StashedTetromino: React.FC<{
  StashedTetromino: TetrominoShape;
}> = ({ StashedTetromino }) => (
  <TetrominoPreview tetromino={StashedTetromino} title="Stashed Tetromino:" />
);

export const NextTetromino: React.FC<{ NextTetromino: TetrominoShape }> = ({
  NextTetromino,
}) => <TetrominoPreview tetromino={NextTetromino} title="Next Tetromino:" />;
