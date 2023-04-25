import React, { useState } from "react";
import { calculateCellWidth, calCol } from "../hooks/until";
import "./GridLayout/style.css";
const PanelCell = ({ col = 26, width = 1, height = 1, color = "#CCCCCC" }) => {
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const cellWidth = calculateCellWidth(col, 10) - calCol(col);

  const style = {
    width: `${cellWidth * width + 10 * (width - 1)}px`,
    height: `${height * 96}px`,
    backgroundColor: `${color}`,
    borderRadius: "10px",
    boxShadow: `${
      hovered
        ? "rgb(38, 57, 77) 0px 20px 30px -10px"
        : "rgba(0, 0, 0, 0.24) 0px 3px 8px"
    }`,
    opacity: `${hovered ? 0.7 : 1}`,
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div
      className="placeholder-cell"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    ></div>
  );
};
export default PanelCell;
