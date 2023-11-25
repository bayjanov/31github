import { shuffleElements } from "./Utils.js";
import { renderMainGrid, renderElementGrid, updateTimeCost, rotateElement, mirrorElement } from "./GridRendering.js";
import { updateSeasonDisplay } from "./Seasons.js";
import { setupMissionsDisplay } from "./Mission.js";


// =============================== GAME STATE (RESOURCES/CONSTANTS) ======================================



// Global variables to track the game state
let currentTimeUnits = 0;
const maxTimeUnits = 28;
let currentSeasonIndex = 0;
const seasons = ["Spring", "Summer", "Autumn", "Winter"];
let seasonScores = { Spring: 0, Summer: 0, Autumn: 0, Winter: 0 };


// Mountains, reserved cells
const mountainCells = [
  { x: 1, y: 1 },
  { x: 8, y: 3 },
  { x: 3, y: 5 },
  { x: 9, y: 8 },
  { x: 5, y: 9 },
];

// Elements given for the game
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


export { currentTimeUnits, maxTimeUnits, currentSeasonIndex, seasons, seasonScores, mountainCells, elements, currentElement, shuffledElements}


//================================ GAME INITIALIZER =============================================


function initializeGame() {
    // Shuffle elements and pick the first one as the current element
    shuffledElements = shuffleElements([...elements]); // Using a copy of the elements array
    currentElement = shuffledElements.pop();
  
    // Render the main grid and the element grid
    renderMainGrid();
    renderElementGrid(currentElement);
    updateTimeCost();
  
  
    //   console.log(`Number of selected missions: ${selectedMissions.length}`);
  
    //   selectedMissions.forEach((mission) => {
    //     console.log(`Selected mission: ${mission.id}`);
    //     // console.log(`Selected mission: ${selectedMissions.indexOf(mission)}`);
    //   });
  
    //   const grid = document.getElementById("mapGrid");
    //   const cells = grid.getElementsByClassName("grid-cell");
  
    //   console.log(`grid: ${typeof grid}`);
    //   console.log(`cells: ${typeof cells}`);
  
    //   console.log(`Current element type: ${currentElement.type}`);
    //   console.log(`Current element time:  ${currentElement.time}`);
    //   console.log(`Current element mirrored: ${currentElement.mirrored}`);
    //   console.log(`Current element shape: ${currentElement.shape[0]}`);
    //   console.log(`Current element shape: ${currentElement.shape[1]}`);
    //   console.log(`Current element shape: ${currentElement.shape[2]}`);
  
    // Set up the missions display
  
    setupMissionsDisplay();
  
    // Update the season display for the start of the game
    updateSeasonDisplay();
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
