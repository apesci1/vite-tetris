// Import the React library
import React from "react";

// Define an array of colors for each possible value of the cell
const COLORS = [
  "transparent",
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red",
];

// Define the CellProps interface to define the props passed to the Cell component
interface CellProps {
  value: number;
}

// Define the Cell component as a functional component that takes in a value prop
const Cell: React.FC<CellProps> = ({ value }) => {
  return (
    // Render a div with the cell class and the background color corresponding to the cell's value
    <div
      className="cell"
      style={{
        backgroundColor: COLORS[value],
      }}
    ></div>
  );
};

export default React.memo(Cell);
