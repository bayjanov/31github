import { 
  getImageForType, 
  getTypeForImage, 
  // isAdjacentToEdge,
  isAdjacentToWater,
  isAdjacentToMountain,
  isAdjacentToVillage,
  getAdjacentTerrainTypes,
  shuffleElements,
 } from "./Utils.js";


// Shuffle and pick the first four missions for this game
// let selectedMissions = shuffleElements([...missions]).slice(0, 4);
selectedMissions = missions.slice(0, 4);


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
        const scoreSpan = document.querySelector(`.mission-points-${selectedMissions.indexOf("edge_of_the_forest")}`); // Assuming "3" is the index for "Watering Potatoes"
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
        // Check if the mission is active
        if (!this.isActive) {
          return 0;
        }
        let score = 0;
        const grid = document.getElementById("mapGrid");
        const cells = grid.getElementsByClassName("grid-cell");
        for (let i = 0; i < 11; i++) {
          let forestCount = 0;
          let maxForestCount = 0;
          for (let j = 0; j < 11; j++) {
            const cell = cells[i * 11 + j];
            if (
              cell.style.backgroundImage === `url("${getImageForType("forest")}")`
            ) {
              forestCount++;
            }
          }
          if (forestCount > maxForestCount) {
            maxForestCount = forestCount;
          }
          score += maxForestCount * 2;
        }
        return score;
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
        for (let i = 0; i < 11; i++) {
          let farmCount = 0;
          let waterCount = 0;
          for (let j = 0; j < 11; j++) {
            const cell = cells[i * 11 + j];
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
        for (let i = 0; i < 11; i++) {
          for (let j = 0; j < 11; j++) {
            const cell = cells[i * 11 + j];
            if (
              cell.style.backgroundImage ===
              `url("${getImageForType("village")}")`
            ) {
              if (getAdjacentTerrainTypes(i, j).size >= 3) {
                score += 3;
              }
            }
          }
        }
        return score;
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
              cell.style.backgroundImage === `url("${getImageForType("water")}")`
            ) {
              if (isAdjacentToMountain(i, j)) {
                score += 3;
              }
            }
          }
        }
        return score;
      },
    },
    {
      isActive: false,
      id: "empty_site",
      title: "Empty site",
      description:
        "You get two points for empty fields adjacent to your village fields.",
      seasons: ["Spring", "Summer", "Autumn", "Winter"],
      // 4. Implementing mission logic for empty site: "You get two points for empty fields adjacent to your village fields."
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
            if (cell.style.backgroundImage === "") {
              if (isAdjacentToVillage(i, j)) {
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
      id: "terraced_house",
      title: "Terraced house",
      description:
        "For each field in the longest village fields that are horizontally uninterrupted and contiguous you will get two points.",
      seasons: ["Spring", "Summer", "Autumn", "Winter"],
      // 3. Implementing mission logic for terraced house: "For each field in the longest village fields that are horizontally uninterrupted and contiguous you will get two points."
      calculateScore: function () {
        // Check if the mission is active
        if (!this.isActive) {
          return 0;
        }
        let score = 0;
        const grid = document.getElementById("mapGrid");
        const cells = grid.getElementsByClassName("grid-cell");
        for (let i = 0; i < 11; i++) {
          let villageCount = 0;
          let maxVillageCount = 0;
          for (let j = 0; j < 11; j++) {
            const cell = cells[i * 11 + j];
            if (
              cell.style.backgroundImage ===
              `url("${getImageForType("village")}")`
            ) {
              villageCount++;
            } else {
              if (villageCount > maxVillageCount) {
                maxVillageCount = villageCount;
              }
              villageCount = 0;
            }
          }
          if (villageCount > maxVillageCount) {
            maxVillageCount = villageCount;
          }
          score += maxVillageCount * 2;
        }
        return score;
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
      calculateScore: function () {
        // Check if the mission is active
        if (!this.isActive) {
          return 0;
        }
        let score = 0;
        const grid = document.getElementById("mapGrid");
        const cells = grid.getElementsByClassName("grid-cell");
        for (let i = 0; i < 11; i++) {
          let farmCount = 0;
          for (let j = 0; j < 11; j++) {
            const cell = cells[i * 11 + j];
            if (
              cell.style.backgroundImage === `url("${getImageForType("farm")}")`
            ) {
              farmCount++;
            }
          }
          if (farmCount % 2 === 1) {
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
      calculateScore: function () {
        // Check if the mission is active
        if (!this.isActive) {
          return 0;
        }
        let score = 0;
        let terrainTypes = new Set();
        const grid = document.getElementById("mapGrid");
        const cells = grid.getElementsByClassName("grid-cell");
  
        for (let i = 0; i < 11; i++) {
          terrainTypes.clear();
          for (let j = 0; j < 11; j++) {
            const cell = cells[i * 11 + j];
            if (cell.style.backgroundImage !== "") {
              terrainTypes.add(getTypeForImage(cell.style.backgroundImage));
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
  
  export function setupMissionsDisplay() {
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

export { selectedMissions, missionScores, missions}