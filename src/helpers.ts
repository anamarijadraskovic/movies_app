import { headerHeight, initialCardWidth, initialRowHeight } from "./constants";

export function getCardWidth() {
  const availableWidth = window.innerWidth;
  const availableColumns = Math.floor(availableWidth / initialCardWidth);
  return availableWidth / availableColumns;
}

export function getRowHeight() {
  const availableHeight = window.innerHeight - headerHeight;
  const availableRows = Math.floor(availableHeight / initialRowHeight);
  return availableHeight / availableRows;
}

export function handleKeyNavigation(
  event: React.KeyboardEvent<HTMLLIElement>,
  row: number,
  col: number,
  rowLength: number,
  colLength: number,
): { row: number; col: number } {
  switch (event.key) {
    case "ArrowRight": {
      col = Math.min(col + 1, colLength - 1);
      break;
    }
    case "ArrowLeft": {
      col = Math.max(col - 1, 0);
      break;
    }
    case "ArrowDown": {
      row = Math.min(row + 1, rowLength - 1);
      break;
    }
    case "ArrowUp": {
      row = Math.max(row - 1, 0);
      break;
    }
    default:
      break;
  }
  return { row, col };
}
