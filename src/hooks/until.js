export const calculateCellWidth = (col, gap) => {
  const screenWidth = window.innerWidth;
  const cellWidth = (screenWidth - gap * (col - 1)) / col;
  return cellWidth;
};

export const calCol = (col) => {
  if (col == 26) {
    return 18;
  }
  if (col == 12) {
    return 30;
  }
  if (col == 6) {
    return 62;
  }
  if (col == 4) {
    return 90;
  }
  return 0;
};
