import { selectedMissions } from "./Mission.js";
import { checkSeasonEnd } from "./Seasons.js";
import { getImageForType } from "./Utils.js";
import {  checkEndOfGame } from "./GameControl.js";
import { mountainCells, shuffledElements, currentElement, currentTimeUnits, maxTimeUnits, } from "./GameState.js";


// ================================== GRID RENDERING FUNCTIONS ============================================

// Renders the 11x11 main grid
export function renderMainGrid() {
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
export function renderElementGrid(element) {
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
  export  function rotateElement(element) {
    const newShape = element.shape[0].map((val, index) =>
      element.shape.map((row) => row[index]).reverse()
    );
    element.shape = newShape;
    renderElementGrid(element);
  }
  
  // Mirrors the current element
  export function mirrorElement(element) {
    element.shape.forEach((row) => row.reverse());
    renderElementGrid(element);
  }
  
  //  ====== TIME STATUS UPDATE ======

  export function updateTimeCost() {
    // Update the displayed time cost of the current element next to clock icon
    document.getElementById("timeCost").textContent = currentElement.time;
  }
  
  
  
  
  
  // ================ GRID ELEMENT PLACING ======================
  
  
  // Handles the click event on the main grid to place an element
  export function handleCellClick(event) {
    const x = parseInt(event.target.dataset.x, 10);
    const y = parseInt(event.target.dataset.y, 10);
  
    // Find the top-left filled cell of the element's shape
    const anchorPoint = findTopLeftFilledCell(currentElement);
    if (anchorPoint) {
      placeElement(x - anchorPoint.x, y - anchorPoint.y, currentElement);
    }
  }
  
  // Finds the top-left filled cell in the element's shape
  export function findTopLeftFilledCell(element) {
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
  export function placeElement(x, y, element) {
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
            if (
              targetCell &&
              (targetCell.style.backgroundImage !== "" ||
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
          // console.log(`Active mission ${mission.id} score: ${mission.calculateScore()}`);
          // console.log(`${mission.title}'s index is ${selectedMissions.indexOf(mission)}`);
          // update the points for the mission with class .mission-points-{missionIndex}
          document.querySelector(`.mission-points-${selectedMissions.indexOf(mission)}`).textContent = `(${mission.calculateScore()} points)`;
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
