
//================================ UTILITY export functionS =============================================

  // Utility export function to get image for type
  export function getImageForType(type) {
    switch (type) {
      case "water":
        return "./assets/tiles/water_tile.png";
      case "farm":
        return "./assets/tiles/farm_tile.png";
      case "forest":
        return "./assets/tiles/forest_tile.png";
      case "mountain":
        return "./assets/tiles/mountain_tile.png";
      case "village":
        return "./assets/tiles/village_tile.png";
      default:
        return "./assets/tiles/base_tile.png";
    }
  }
  
  // Utility export function to get type based on color
  export function getTypeForImage(color) {
    switch (color) {
      case `url("${getImageForType("water")}")`:
        return "water";
      case `url("${getImageForType("farm")}")`:
        return "farm";
      case `url("${getImageForType("forest")}")`:
        return "forest";
      case `url("${getImageForType("farm")}")`:
        return "farm";
      default:
        return "base";
    }
  }
  
  // Utility export function to check if a cell is adjacent to a village
  export function isAdjacentToVillage(x, y) {
    const grid = document.getElementById("mapGrid");
    const cells = grid.getElementsByClassName("grid-cell");
    const adjacentCells = [
      cells[(y - 1) * 11 + x],
      cells[(y + 1) * 11 + x],
      cells[y * 11 + x - 1],
      cells[y * 11 + x + 1],
    ];
    return Array.from(adjacentCells).some(
      (cell) =>
        cell &&
        cell.style.backgroundImage === `url("${getImageForType("village")}")`
    );
  }
  
  // Utility export function to check if a cell is adjacent to a mountain
  export function isAdjacentToMountain(x, y) {
    const grid = document.getElementById("mapGrid");
    const cells = grid.getElementsByClassName("grid-cell");
    const adjacentCells = [
      cells[(y - 1) * 11 + x],
      cells[(y + 1) * 11 + x],
      cells[y * 11 + x - 1],
      cells[y * 11 + x + 1],
    ];
    return Array.from(adjacentCells).some(
      (cell) =>
        cell &&
        cell.style.backgroundImage === `url("${getImageForType("mountain")}")`
    );
  }
  
  // Utility export function to get adjacent terrain types
  export function getAdjacentTerrainTypes(x, y) {
    const grid = document.getElementById("mapGrid");
    const cells = grid.getElementsByClassName("grid-cell");
    const adjacentCells = [
      cells[(y - 1) * 11 + x],
      cells[(y + 1) * 11 + x],
      cells[y * 11 + x - 1],
      cells[y * 11 + x + 1],
    ];
    let terrainTypes = new Set();
    Array.from(adjacentCells).forEach((cell) => {
      if (cell && cell.style.backgroundImage !== "") {
        terrainTypes.add(getTypeForImage(cell.style.backgroundImage));
      }
    });
    return terrainTypes;
  }
  
  // Utility export function to check if a cell is adjacent to water
  export function isAdjacentToWater(x, y) {
    const grid = document.getElementById("mapGrid");
    const cells = grid.getElementsByClassName("grid-cell");
    const adjacentCells = [
      cells[(y - 1) * 11 + x],
      cells[(y + 1) * 11 + x],
      cells[y * 11 + x - 1],
      cells[y * 11 + x + 1],
    ];
    return Array.from(adjacentCells).some(
      (cell) =>
        cell &&
        cell.style.backgroundImage === `url("${getImageForType("water")}")`
    );
  }
  
  // // Utility export function to check if a cell is adjacent to edge
  // export function isAdjacentToEdge(x, y) {
  //   const grid = document.getElementById("mapGrid");
  //   const cells = grid.getElementsByClassName("grid-cell");
  //   const adjacentCells = [
  //     cells[(y - 1) * 11 + x],
  //     cells[(y + 1) * 11 + x],
  //     cells[y * 11 + x - 1],
  //     cells[y * 11 + x + 1],
  //   ];
  //   return Array.from(adjacentCells).some(
  //     (cell) =>
  //       cell && cell.style.backgroundImage === `url("${getImageForType("edge")}")`
  //   );
  // }
  

  
  
  // Shuffle the elements array for random order
  export function shuffleElements(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  