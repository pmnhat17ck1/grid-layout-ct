import React, { useEffect, useState } from "react";

export default function useLayout(setCol) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateCellCount = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      if (screenWidth >= 1200) {
        setCol(26);
      } else if (screenWidth >= 992) {
        setCol(14);
      } else if (screenWidth >= 768) {
        setCol(6);
      } else if (screenWidth >= 576) {
        setCol(4);
      } else {
        setCol(2);
      }
      setHeight(prev=> screenHeight> prev ? screenHeight : prev)
      setWidth(prev=> screenWidth> prev ? screenWidth : prev)
    };
    window.addEventListener("resize", updateCellCount);
    updateCellCount()
    return () => {
      window.removeEventListener("resize", updateCellCount);
    };
  }, []);

  return {
    width,
    height,
    setWidth,
    setHeight,
  };
}
