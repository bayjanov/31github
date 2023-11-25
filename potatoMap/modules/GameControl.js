import { seasonScores } from "./GameState.js";

export function checkEndOfGame() {
    // console.log("Checking end of game", currentTimeUnits, maxTimeUnits);
    if (currentTimeUnits >= maxTimeUnits) {
      // Game over
      alert("Game Over! Your final score is: " + calculateFinalScore());
      // disable game board, show results
      document.getElementById("mapGrid").style.pointerEvents = "none";
      document.getElementsByClassName("totalPoints").style.display = "block";
    }
  }
  
export function calculateFinalScore() {
    let finalScore = Object.values(seasonScores).reduce((a, b) => a + b, 0);
    return finalScore;
  }
  

  