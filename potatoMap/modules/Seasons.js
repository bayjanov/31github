import { selectedMissions } from "./Missions.js";
// import { seasonScores, currentSeasonIndex, seasons } from "./GameState.js";

//  ============================== SEASON export functionS ====================================


export function checkSeasonEnd() {
    if (currentTimeUnits >= (currentSeasonIndex + 1) * 7) {
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
              console.log(`Active mission in ${seasonName}:  ${mission.id} score: ${mission.calculateScore()}`);
              }
          });
  
      // Update the season display
      updateSeasonDisplay();
    }
  }
  
  export function updateSeasonDisplay() {
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
  
  
  export function calculateSeasonScore(season) {
    let score = 0;
    selectedMissions.forEach((mission) => {
      if (mission.isActive) {
          if (mission.seasons && mission.seasons.includes(season)) {
            score += mission.calculateScore();
            console.log(
              `Season ${season} End: Mission ${
                mission.id
              } score: ${mission.calculateScore()}`
            );
          }
      }
    });
    return score;
  }
  
  // export function updateSeasonDisplay() {
  //   // Update the UI with the current season
  //   document.querySelector(
  //     ".current-season h3"
  //   ).textContent = `Current season: ${seasons[currentSeasonIndex]} (BC)`;
  // }
  
  
  
  
  // ============================== TIME & OBSERVANT FUNCTIONS ====================================
  