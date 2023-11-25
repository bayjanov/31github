// =============================== GAME STATE (RESOURCES/CONSTANTS) ======================================
// Global variables to track the game state
let finalScore = 0;
let currentTimeUnits = 0;
const maxTimeUnits = 28;
let currentSeasonIndex = 0;
const seasons = ["Spring", "Summer", "Autumn", "Winter"];
let seasonScores = { Spring: 0, Summer: 0, Autumn: 0, Winter: 0 };
let missionScores = {
  edge_of_the_forest: 0,
  sleepy_valley: 0,
  watering_potatoes: 0,
  borderlands: 0,
  tree_line: 0,
  watering_canal: 0,
  wealthy_town: 0,
  magicians_valley: 0,
  empty_site: 0,
  terraced_house: 0,
  odd_numbered_silos: 0,
  rich_countryside: 0,
};

// Missions for the game
const missions = [
  {
    isActive: false,
    id: "edge_of_the_forest",
    title: "Edge of the forest",
    description:
      "You get one point for each forest field adjacent to the edge of your map.",
    // 12. Implementing mission logic for edge of the forest: "You get one point for each forest field adjacent to the edge of your map."
    calculateScore: function () {
      // Check if the mission is active
      if (!this.isActive) {
        return 0;
      }
      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      // Function to check if a cell is a forest cell and return the corresponding score
      const isForestCell = (cell) =>
        cell.style.backgroundImage === `url("${getImageForType("forest")}")`
          ? 1
          : 0;

      // Process top and bottom rows
      for (let col = 0; col < 11; col++) {
        score += isForestCell(cells[col]); // Top row
        score += isForestCell(cells[10 * 11 + col]); // Bottom row
      }

      // Process left and right columns, excluding corners already counted
      for (let row = 1; row < 10; row++) {
        score += isForestCell(cells[row * 11]); // Left column
        score += isForestCell(cells[row * 11 + 10]); // Right column
      }

      // Update the global score for this mission
      missionScores["edge_of_the_forest"] += score;

      // Update the score in the HTML
      const scoreSpan = document.querySelector(
        `.mission-points-${selectedMissions.indexOf("edge_of_the_forest")}`
      ); // Assuming "3" is the index for "Watering Potatoes"
      if (scoreSpan) {
        scoreSpan.textContent = `(${missionScores["edge_of_the_forest"]} points)`;
      }

      console.log(`Score for mission ${this.id}: ${score}`);

      return score;
    },
  },
  {
    isActive: false,
    id: "sleepy_valley",
    title: "Sleepy valley",
    description: "For every row with three forest fields, you get four points.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 11. Implementing mission logic for sleepy valley: "For every row with three forest fields, you get four points."
    calculateScore: function () {
      // Check if the mission is active
      if (!this.isActive) {
        return 0;
      }
      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");
      for (let row = 0; row < 11; row++) {
        let forestCount = 0;
        for (let col = 0; col < 11; col++) {
          const cell = cells[row * 11 + col];
          if (
            cell.style.backgroundImage === `url("${getImageForType("forest")}")`
          ) {
            forestCount++;
          }
        }
        if (forestCount === 3) {
          score += 4;
        }
      }
      return score;
    },
  },
  {
    isActive: false,
    id: "watering_potatoes",
    title: "Watering potatoes",
    description:
      "You get two points for each water field adjacent to your farm fields.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 10. Implementing mission logic for watering potatoes: "You get two points for each water field adjacent to your farm fields."
    calculateScore: function () {
      // Check if the mission is active
      if (!this.isActive) {
        return 0;
      }
      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");
      for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
          const cell = cells[i * 11 + j];
          if (
            cell.style.backgroundImage === `url("${getImageForType("farm")}")`
          ) {
            if (isAdjacentToWater(i, j)) {
              score += 2;
            }
          }
        }
      }
      return score;
    },
  },
  {
    isActive: false,
    id: "borderlands",
    title: "Borderlands",
    description: "For each full row or column, you get six points.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 9. Implementing mission logic for borderlands: "For each full row or column, you get six points."
    calculateScore: function () {
      // Check if the mission is active
      if (!this.isActive) {
        return 0;
      }
      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");
      for (let row = 0; row < 11; row++) {
        let filledCells = 0;
        // Check for full rows
        for (let col = 0; col < 11; col++) {
          const cell = cells[row * 11 + col];
          // if cell is not empty
          if (cell.style.backgroundImage !== "") {
            filledCells++;
          }
        }
        if (filledCells === 11) {
          score += 6;
        }
      }

      // Check for full columns
      for (let col = 0; col < 11; col++) {
        let filledCells = 0;
        // Check for full rows
        for (let row = 0; row < 11; row++) {
          const cell = cells[row * 11 + col];
          // if cell is not empty
          if (cell.style.backgroundImage !== "") {
            filledCells++;
          }
        }
        if (filledCells === 11) {
          score += 6;
        }
      }

      return score;
    },
  },
  {
    isActive: false,
    id: "tree_line",
    title: "Tree line",
    description:
      "You get two points for each of the fields in the longest vertically uninterrupted continuous forest. " +
      "If there are two or more tree lines with the same longest length, only one counts.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 8. Implementing mission logic for tree line: "You get two points for each of the fields in the longest vertically uninterrupted continuous forest. If there are two or more tree lines with the same longest length, only one counts."
    calculateScore: function () {
      if (!this.isActive) {
        return 0;
      }

      let maxForestLineLength = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      for (let col = 0; col < 11; col++) {
        let currentForestLineLength = 0;

        for (let row = 0; row < 11; row++) {
          const cell = cells[row * 11 + col];
          if (
            cell.style.backgroundImage === `url("${getImageForType("forest")}")`
          ) {
            currentForestLineLength++;
            maxForestLineLength = Math.max(
              maxForestLineLength,
              currentForestLineLength
            );
          } else {
            currentForestLineLength = 0;
          }
        }
      }

      return maxForestLineLength * 2;
    },
  },
  {
    isActive: false,
    id: "watering_canal",
    title: "Watering canal",
    description:
      "For each column of your map that has the same number of farm and water fields, you will receive four points. " +
      "You must have at least one field of both terrain types in your column to score points.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 7. Implementing mission logic for watering canal: "For each column of your map that has the same number of farm and water fields, you will receive four points. You must have at least one field of both terrain types in your column to score points."
    calculateScore: function () {
      // Check if the mission is active
      if (!this.isActive) {
        return 0;
      }
      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");
      for (let col = 0; col < 11; col++) {
        let farmCount = 0;
        let waterCount = 0;
        for (let row = 0; row < 11; row++) {
          const cell = cells[row * 11 + col];
          if (
            cell.style.backgroundImage === `url("${getImageForType("farm")}")`
          ) {
            farmCount++;
          } else if (
            cell.style.backgroundImage === `url("${getImageForType("water")}")`
          ) {
            waterCount++;
          }
        }
        if (farmCount === waterCount && farmCount > 0 && waterCount > 0) {
          score += 4;
        }
      }
      return score;
    },
  },
  {
    isActive: false,
    id: "wealthy_town",
    title: "Wealthy town",
    description:
      "You get three points for each of your village fields adjacent to at least three different terrain types.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 6. Implementing mission logic for wealthy town: "You get three points for each of your village fields adjacent to at least three different terrain types."
    calculateScore: function () {
      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      // Iterate through each cell in the grid
      for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
          const cell = cells[i * 11 + j];
          if (
            cell.style.backgroundImage ===
            `url("${getImageForType("village")}")`
          ) {
            const adjacentTypes = getAdjacentTerrainTypes(j, i);
            if (adjacentTypes.size >= 3) {
              cell.style.backgroundImage = `url("./assets/tiles/village_tile_3p.png")`;
              missionScores[this.id] += 3; // Add three points for each qualifying village cell
              // outline the cell
            }
          }
        }
      }
      return missionScores[this.id];
    },
  },
  {
    isActive: false,
    id: "magicians_valley",
    title: "Magicians' valley",
    description:
      "You get three points for your water fields adjacent to your mountain fields.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 5. Implementing mission logic for magicians valley: "You get three points for your water fields adjacent to your mountain fields."
    calculateScore: function () {
      if (!this.isActive) {
        return 0;
      }

      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
          const cell = cells[i * 11 + j];
          if (
            cell.style.backgroundImage ===
            `url("${getImageForType("mountain")}")`
          ) {
            const adjacentWaterCells = getWaterToMountain(j, i);
            adjacentWaterCells.forEach((cellIndex) => {
              cells[
                cellIndex
              ].style.backgroundImage = `url("./assets/tiles/water_tile_3p.png")`;
              missionScores[this.id] += 3;
            });
          }
        }
      }

      return missionScores[this.id];
    },
  },
  {
    isActive: false,
    id: "empty_site",
    title: "Empty site",
    description:
      "You get two points for empty fields adjacent to your village fields.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    countedCells: new Set(),

    calculateScore: function () {
      if (!this.isActive) return missionScores[this.id];

      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
          const cellIndex = i * 11 + j;
          const cell = cells[cellIndex];

          if (
            cell.style.backgroundImage ===
            `url("${getImageForType("village")}")`
          ) {
            const adjacentIndices = getAdjacentIndices(j, i);
            adjacentIndices.forEach((adjIndex) => {
              if (
                !this.countedCells.has(adjIndex) &&
                cells[adjIndex].style.backgroundImage === ""
              ) {
                cells[
                  adjIndex
                ].style.backgroundImage = `url("./assets/tiles/empty_tile_2p.png")`;
                cells[adjIndex].style.backgroundSize = "cover";
                missionScores[this.id] += 2;
                this.countedCells.add(adjIndex);
              }
            });
          }
        }
      }

      return missionScores[this.id];
    },
  },
  {
    isActive: false,
    id: "terraced_house",
    title: "Terraced house",
    description:
      "For each field in the longest village fields that are horizontally uninterrupted and contiguous you will get two points.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 3. Implementing mission logic for terraced house: "For each field in the longest village fields that are horizontally uninterrupted and contiguous you will get two points."
    calculateScore: function () {
      if (!this.isActive) {
        return 0;
      }

      let maxForestLineLength = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      for (let row = 0; row < 11; row++) {
        let currentForestLineLength = 0;

        for (let col = 0; col < 11; col++) {
          const cell = cells[row * 11 + col];
          if (
            cell.style.backgroundImage ===
            `url("${getImageForType("village")}")`
          ) {
            currentForestLineLength++;
            maxForestLineLength = Math.max(
              maxForestLineLength,
              currentForestLineLength
            );
          } else {
            currentForestLineLength = 0;
          }
        }
      }

      return maxForestLineLength * 2;
    },
  },
  {
    isActive: false,
    id: "odd_numbered_silos",
    title: "Odd numbered silos",
    description:
      "For each of your odd numbered full columns you get 10 points.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    // 2. Implementing mission logic for odd numbered silos: "For each of your odd numbered full columns you get 10 points."
    // 2. Implementing mission logic for odd numbered silos: "For each of your odd numbered full columns you get 10 points."
    calculateScore: function () {
      if (!this.isActive) {
        return 0;
      }

      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      for (let col = 0; col < 11; col++) {
        let isFullColumn = true;

        for (let row = 0; row < 11; row++) {
          const cell = cells[row * 11 + col];
          // Check if the cell is empty or reserved (e.g., a mountain)
          if (
            cell.style.backgroundImage === "" ||
            cell.dataset.reserved === "true"
          ) {
            isFullColumn = false;
            break;
          }
        }

        // Check if the column is full and its number is odd
        if (isFullColumn && col % 2 === 0) {
          score += 10;
        }
      }

      return score;
    },
  },
  {
    isActive: false,
    id: "rich_countryside",
    title: "Rich countryside",
    description:
      "For each row with at least five different terrain types, you will receive four points.",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    //1. Implementing mission logic fr rich countryside: "For each row with at least five different terrain types, you will receive four points."
    // 1. Implementing mission logic for rich countryside: "For each row with at least five different terrain types, you will receive four points."
    calculateScore: function () {
      if (!this.isActive) {
        return 0;
      }

      let score = 0;
      const grid = document.getElementById("mapGrid");
      const cells = grid.getElementsByClassName("grid-cell");

      for (let row = 0; row < 11; row++) {
        let terrainTypes = new Set();

        for (let col = 0; col < 11; col++) {
          const cell = cells[row * 11 + col];
          if (
            cell.style.backgroundImage !== "" ||
            cell.dataset.reserved === "true"
          ) {
            // For reserved cells (mountains), manually add 'mountain' type
            if (cell.dataset.reserved === "true") {
              terrainTypes.add("mountain");
            } else {
              terrainTypes.add(getTypeForImage(cell.style.backgroundImage));
            }
          }
        }

        if (terrainTypes.size >= 5) {
          score += 4;
        }
      }

      return score;
    },
  },
];

// Mountains, reserved cells
const mountainCells = [
  { x: 1, y: 1 },
  { x: 8, y: 3 },
  { x: 3, y: 5 },
  { x: 9, y: 8 },
  { x: 5, y: 9 },
];

// // Elements given for the game
const elements = [
  {
    time: 2,
    type: "water",
    shape: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "farm",
    shape: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "forest",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "village",
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "forest",
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "farm",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "village",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "farm",
    shape: [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "farm",
    shape: [
      [1, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "village",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "village",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "water",
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "water",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "forest",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "forest",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "water",
    shape: [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
];

// The current element that is selected
let currentElement = null;

// The main game initialization function
// Global variable to store shuffled elements
let shuffledElements = [];

// Shuffle and pick the first four missions for this game
let selectedMissions = shuffleElements([...missions]).slice(0, 4);
// selectedMissions = missions.slice(8, 12);

//================================ UTILITY FUNCTIONS =============================================

function setupMissionsDisplay() {
  selectedMissions.forEach((mission, index) => {
    let missionImage = document.getElementsByClassName(
      `mission-image image-${index}`
    )[0];
    if (missionImage) {
      missionImage.src = `./assets/missions_eng/${mission.id}.png`;
      missionImage.alt = mission.title;
    } else {
      console.error(`Mission image not found for mission ${mission.id}`);
    }
  });
}

// Utility function to get type based on color
function getTypeForImage(color) {
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

// Utility function to check if a cell is adjacent to a village
function getAdjacentIndices(x, y) {
  // Return indices of adjacent cells
  return [
    (y - 1) * 11 + x, // Top
    (y + 1) * 11 + x, // Bottom
    y * 11 + x - 1, // Left
    y * 11 + x + 1, // Right
  ].filter((index) => index >= 0 && index < 121); // Filter out invalid indices
}

// Utility function to check if a cell is adjacent to a mountain
function getWaterToMountain(x, y) {
  const grid = document.getElementById("mapGrid");
  const cells = grid.getElementsByClassName("grid-cell");
  const adjacentWaterCells = [];
  const positions = [
    { dx: 0, dy: -1 }, // Top
    { dx: 0, dy: 1 }, // Bottom
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }, // Right
  ];

  positions.forEach((pos) => {
    const index = (y + pos.dy) * 11 + (x + pos.dx);
    if (
      index >= 0 &&
      index < cells.length &&
      cells[index].style.backgroundImage ===
        `url("${getImageForType("water")}")`
    ) {
      adjacentWaterCells.push(index);
    }
  });

  return adjacentWaterCells;
}

// Utility function to get adjacent terrain types
function getAdjacentTerrainTypes(x, y) {
  const grid = document.getElementById("mapGrid");
  const cells = grid.getElementsByClassName("grid-cell");
  let terrainTypes = new Set();

  // Define adjacent cell positions
  const positions = [
    { dx: 0, dy: -1 }, // Top
    { dx: 0, dy: 1 }, // Bottom
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }, // Right
  ];

  positions.forEach((pos) => {
    const index = (y + pos.dy) * 11 + (x + pos.dx);
    if (index >= 0 && index < cells.length) {
      const cell = cells[index];
      if (cell && cell.style.backgroundImage !== "") {
        terrainTypes.add(getTypeForImage(cell.style.backgroundImage));
      }
    }
  });

  return terrainTypes;
}

// Utility function to check if a cell is adjacent to water
function isAdjacentToWater(x, y) {
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

// Utility function to check if a cell is adjacent to edge
function isAdjacentToEdge(x, y) {
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
      cell && cell.style.backgroundImage === `url("${getImageForType("edge")}")`
  );
}

// Utility function to get image for type
function getImageForType(type) {
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

// Shuffle the elements array for random order
function shuffleElements(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ================================== GRID RENDERING FUNCTIONS ============================================

// Renders the 11x11 main grid
function renderMainGrid() {
  const grid = document.getElementById("mapGrid");
  grid.innerHTML = ""; // Clear any existing cells

  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.dataset.x = j;
      cell.dataset.y = i;

      // Check if the current cell is a mountain cell
      if (
        mountainCells.some((mountain) => mountain.x === j && mountain.y === i)
      ) {
        cell.classList.add("mountain");
        cell.style.backgroundImage = "url('./assets/tiles/mountain_tile.png')";
        cell.style.backgroundSize = "cover";
        // Set a property to mark this cell as non-placeable
        cell.dataset.reserved = "true";
      }

      cell.addEventListener("click", handleCellClick);
      grid.appendChild(cell);
    }
  }
}

// Renders the current element in the 3x3 grid
function renderElementGrid(element) {
  const elementGrid = document.getElementById("elementGrid");
  elementGrid.innerHTML = ""; // Clear any existing cells

  for (let i = 0; i < 3; i++) {
    // Assuming a 3x3 grid
    for (let j = 0; j < 3; j++) {
      const gridCell = document.createElement("div");
      gridCell.classList.add("element-cell");
      gridCell.dataset.x = j;
      gridCell.dataset.y = i;

      if (element.shape[i][j] === 1) {
        if (element.type === "forest") {
          gridCell.classList.add("filled");
          gridCell.style.backgroundImage =
            "url('./assets/tiles/forest_tile.png')";
        } else if (element.type === "farm") {
          gridCell.classList.add("filled");
          gridCell.style.backgroundImage =
            "url('./assets/tiles/farm_tile.png')";
        } else if (element.type === "water") {
          gridCell.classList.add("filled");
          gridCell.style.backgroundImage =
            "url('./assets/tiles/water_tile.png')";
        } else if (element.type === "village") {
          gridCell.classList.add("filled");
          gridCell.style.backgroundImage =
            "url('./assets/tiles/village_tile.png')";
        }
        gridCell.style.border = "1px solid #fff";
      } else {
        gridCell.classList.add("empty");
        gridCell.style.backgroundColor = `#fff`;
        gridCell.style.border = "none";
      }
      elementGrid.appendChild(gridCell);
    }
  }
}

// =============== ELEMENT MANIPULATION ======================

// Rotates the current element
function rotateElement(element) {
  const newShape = element.shape[0].map((val, index) =>
    element.shape.map((row) => row[index]).reverse()
  );
  element.shape = newShape;
  renderElementGrid(element);
}

// Mirrors the current element
function mirrorElement(element) {
  element.shape.forEach((row) => row.reverse());
  renderElementGrid(element);
}

// ================ GRID ELEMENT PLACING ======================

// Handles the click event on the main grid to place an element
function handleCellClick(event) {
  const x = parseInt(event.target.dataset.x, 10);
  const y = parseInt(event.target.dataset.y, 10);

  // Find the top-left filled cell of the element's shape
  const anchorPoint = findTopLeftFilledCell(currentElement);
  if (anchorPoint) {
    placeElement(x - anchorPoint.x, y - anchorPoint.y, currentElement);
  }
}

// Finds the top-left filled cell in the element's shape
function findTopLeftFilledCell(element) {
  for (let i = 0; i < element.shape.length; i++) {
    for (let j = 0; j < element.shape[i].length; j++) {
      if (element.shape[i][j] === 1) {
        return { x: j, y: i };
      }
    }
  }
  return null; // In case there are no filled cells
}

// Places an element on the main grid at the specified coordinates
function placeElement(x, y, element) {
  const grid = document.getElementById("mapGrid");
  const cells = grid.getElementsByClassName("grid-cell");

  let collisionDetected = false;

  // Check for collisions and reserved fields (such as mountains)
  element.shape.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 1) {
        const targetX = x + cellIndex;
        const targetY = y + rowIndex;
        // Calculate the index for 1D array representation
        const targetCellIndex = targetY * 11 + targetX;

        if (targetX >= 0 && targetX < 11 && targetY >= 0 && targetY < 11) {
          const targetCell = cells[targetCellIndex];
          // Check if the cell is already filled or is a reserved cell (mountain)
          let bgImage = targetCell.style.backgroundImage;

          // Check if the background image URL contains any of the tile names
          if (
            targetCell &&
            (bgImage.includes("farm_tile") ||
              bgImage.includes("water_tile") ||
              bgImage.includes("forest_tile") ||
              bgImage.includes("village_tile") ||
              bgImage.includes("mountain_tile") ||
              targetCell.dataset.reserved === "true")
          ) {
            collisionDetected = true;
            targetCell.style.outline = "4px solid #FF0000"; // Indicate collision or reserved cell
          }
        } else {
          // Part of the element is off-grid
          collisionDetected = true;
        }
      }
    });
  });

  if (collisionDetected) {
    // Visual feedback for collision or invalid placement
    element.shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 1) {
          const targetCellIndex = (y + rowIndex) * 11 + (x + cellIndex);
          if (targetCellIndex >= 0 && targetCellIndex < cells.length) {
            const targetCell = cells[targetCellIndex];
            if (
              targetCell &&
              !targetCell.dataset.reserved &&
              targetCell.style.backgroundImage === ""
            ) {
              targetCell.style.backgroundColor = "#E9BD90";
              targetCell.style.outline = "4px solid #FF0000";
            }
          }
        }
      });
      //   currentTimeUnits += element.time;
      //   document.getElementById(
      //     "elapsedTime"
      //   ).textContent = `${currentTimeUnits}/${maxTimeUnits}`;
    });

    // Remove temporary styles after a delay
    setTimeout(() => {
      Array.from(cells).forEach((cell) => {
        cell.style.backgroundColor = "";
        cell.style.outline = "";
      });
    }, 1500);

    // Do not proceed to the next element if there was a collision
  } else {
    // No collision detected, place the element
    element.shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 1) {
          const targetCellIndex = (y + rowIndex) * 11 + (x + cellIndex);
          if (targetCellIndex >= 0 && targetCellIndex < cells.length) {
            const targetCell = cells[targetCellIndex];
            if (targetCell) {
              targetCell.style.backgroundImage = `url(${getImageForType(
                element.type
              )})`;
              targetCell.style.backgroundSize = "cover";
              targetCell.style.border = ""; // Reset any temporary styles
            }
          }
        }
      });
    });

    // Update the game state after a successful placement
    if (shuffledElements.length > 0) {
      currentElement = shuffledElements.pop();
      renderElementGrid(currentElement);
    } else {
      // All elements have been placed - game over or next level
      console.log("All elements have been placed.");
      // Implement end-of-game or next level logic here
    }

    // After placing the element, update the time units
    currentTimeUnits += element.time;
    document.getElementById(
      "elapsedTime"
    ).textContent = `${currentTimeUnits}/${maxTimeUnits}`;
  }

  // DEBUGGING
  // Update the points for each mission
  selectedMissions.forEach((mission) => {
    if (mission.isActive) {
      document.querySelector(
        `.mission-points-${selectedMissions.indexOf(mission)}`
      ).textContent = `(${mission.calculateScore()} points)`;
    }
  });

  // Check if the season or the game should end
  //   console.log(`===========================================`);
  console.log(`Current element type: ${currentElement.type}`);
  //   console.log(`Current element time:  ${currentElement.time}`);
  //   console.log(`Current element shape: ${currentElement.shape[0]}`);
  //   console.log(`Current element shape: ${currentElement.shape[1]}`);
  //   console.log(`Current element shape: ${currentElement.shape[2]}`);
  //   console.log(`===========================================`);
  //   console.log(`Current Time Units ${currentTimeUnits}`);

  updateTimeCost();
  checkSeasonEnd();
  checkEndOfGame();

  //   console.log(`grid: ${grid}`);
  //   console.log(`cells: ${cells}`);
}

// END OF PLACE ELEMENT FUNCTION

//================================ GAME INITIALIZER =============================================

function initializeGame() {
  // Shuffle elements and pick the first one as the current element
  shuffledElements = shuffleElements([...elements]); 
  currentElement = shuffledElements.pop();

  // Render the main grid and the element grid
  renderMainGrid();
  renderElementGrid(currentElement);
  updateTimeCost();

  console.log(`Selected missions: ${selectedMissions.length}`);
  selectedMissions.forEach((mission) => {
    console.log("Selected mission: " + mission.id);
  });


  // Set up the missions display

  setupMissionsDisplay();

  // Update the season display for the start of the game
  updateSeasonDisplay();
}

//  ============================== SEASON FUNCTIONS ====================================



function updateSeasonDisplay() {
  const seasonName = seasons[currentSeasonIndex];

  // Determine which mission circles should be active based on the current season
  let activeMissionIndices;
  switch (seasonName) {
    case "Spring":
      activeMissionIndices = [0, 1];
      break;
    case "Summer":
      activeMissionIndices = [1, 2];
      break;
    case "Autumn":
      activeMissionIndices = [2, 3];
      break;
    case "Winter":
      activeMissionIndices = [3, 0];
      break;
    default:
      activeMissionIndices = [];
  }

  // Update the UI for the current season
  document.querySelector(
    ".current-season h3"
  ).textContent = `Current season: ${seasonName} (${activeMissionIndices
    .map((i) => String.fromCharCode(65 + i))
    .join(", ")})`;

  // Activate and deactivate mission circles and set isActive property
  selectedMissions.forEach((mission, index) => {
    let missionCircle = document.getElementsByClassName(`circle-${index}`)[0];
    let isActive = activeMissionIndices.includes(index);

    if (missionCircle) {
      if (isActive) {
        missionCircle.classList.remove("passive-circle");
        missionCircle.classList.add("active-circle");
      } else {
        missionCircle.classList.remove("active-circle");
        missionCircle.classList.add("passive-circle");
      }
    }

    // Set isActive property for each mission
    mission.isActive = isActive;
  });
}

let previousSeasonScore = 0; // Initialize at the start of the game

function calculateSeasonScore(season) {
    let seasonScore = 0;

    selectedMissions.forEach((mission, index) => {
        if (mission.isActive && mission.seasons.includes(season)) {
          
            seasonScore += mission.calculateScore();
            console.log(`Season ${season}: Mission ${mission.id} score: ${mission.calculateScore()}`);
        }
    });

    return seasonScore;
}




function calculateFinalScore() {
  let totalScore = 0;
  selectedMissions.forEach((mission) => {
    totalScore += mission.calculateScore(); // Add each mission's score to the total
  });
  return totalScore; // Return the cumulative total
}

function displayPopup() {
  console.log("Displaying popup");
  document.querySelector(".popup-overlay").style.display = "flex";
  document.querySelector(".final-score-display").textContent = `Final Score: ${calculateFinalScore()}`;
  document.querySelector(".play-again").addEventListener("click", () => {
     window.location.reload();
  });
  document.querySelector(".close-popup").addEventListener("click", () => {
     document.querySelector(".popup-overlay").style.display = "none";
  });
 }


function checkEndOfGame() {
  console.log("Checking end of game", currentTimeUnits, maxTimeUnits);
  if (currentTimeUnits >= maxTimeUnits) {
    // Game over
    displayPopup();
 

    alert("Game Over! Your final score is: " + calculateFinalScore());
    // disable game board, show results
    document.getElementById("mapGrid").style.pointerEvents = "none";
    document.getElementsByClassName("totalPoints").style.display = "block";


  }
}

function checkSeasonEnd() {
  if (currentTimeUnits >= (currentSeasonIndex + 1) * 7) {
    setTimeout(() => {
      endSeason();
    }, 1000);
    // Season has ended, calculate the score for the season
    let seasonName = seasons[currentSeasonIndex];
    seasonScores[seasonName] = calculateSeasonScore(seasonName);
    // Update the season score on the UI
    document.querySelector(
      `.season.${seasonName.toLowerCase()} .points-${seasonName.toLowerCase()}`
    ).textContent = `${seasonScores[seasonName]} points`;
    // Add up the total score
    let totalScore = calculateFinalScore();
    document.querySelector(".totalPoints").textContent = `${totalScore} points`;

    // Move to the next season
    currentSeasonIndex++;
    if (currentSeasonIndex >= seasons.length) {
      currentSeasonIndex = 0; // Loop back to the first season if needed
    }

    // DEBUGGING
    selectedMissions.forEach((mission) => {
      if (mission.isActive) {
        console.log(
          `Active mission in ${seasonName}:  ${
            mission.id
          } score: ${mission.calculateScore()}`
        );
      }
    });

    // Update the season display
    updateSeasonDisplay();
  }
}




// ============================== TIME & OBSERVANT FUNCTIONS ====================================

function updateTimeCost() {
  // Update the displayed time cost of the current element next to clock icon
  document.getElementById("timeCost").textContent = currentElement.time;
}

// Call the initializeGame function to start the game
document.addEventListener("DOMContentLoaded", initializeGame);

// Event listeners for the rotation and flip buttons
document.getElementById("rotateBtn").addEventListener("click", () => {
  rotateElement(currentElement);
});

document.getElementById("flipBtn").addEventListener("click", () => {
  mirrorElement(currentElement);
});
