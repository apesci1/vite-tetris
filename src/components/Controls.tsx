import React, { useRef, useEffect } from "react";

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onStash: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onDrop,
  onStash,
}) => {
  const pressedKeys = useRef(new Set<string>());

  const handleRotate = () => {
    if (!pressedKeys.current.has("ArrowUp")) {
      onRotate();
      pressedKeys.current.add("ArrowUp");
    }
  };

  const handleStash = (key: string) => {
    if (!pressedKeys.current.has(key)) {
      onStash();
      pressedKeys.current.add(key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const actions: { [key: string]: () => void } = {
        ArrowLeft: onMoveLeft,
        ArrowRight: onMoveRight,
        ArrowDown: onMoveDown,
        ArrowUp: handleRotate,
        " ": onDrop,
        z: () => handleStash("z"),
        Z: () => handleStash("Z"),
      };

      const action = actions[event.key];
      if (action) {
        action();
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "z" || event.key === "Z") {
        pressedKeys.current.delete(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onMoveLeft, onMoveRight, onMoveDown, onRotate, onDrop, onStash]);

  return null;
};
