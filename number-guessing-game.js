#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");

// Tạo interface để nhận input từ dòng lệnh
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Hàm tiện ích: Đặt câu hỏi và chờ câu trả lời từ người dùng
function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

// Hàm lưu điểm cao
function saveHighScore(difficulty, attempts, time) {
  try {
    let highScores = {};
    if (fs.existsSync("highscores.json")) {
      highScores = JSON.parse(fs.readFileSync("highscores.json"));
    }
    
    const difficultyName = difficulty === "1" ? "Easy" : difficulty === "2" ? "Medium" : "Hard";
    if (!highScores[difficultyName] || attempts < highScores[difficultyName].attempts) {
      highScores[difficultyName] = {
        attempts: attempts,
        time: time,
        date: new Date().toISOString()
      };
      fs.writeFileSync("highscores.json", JSON.stringify(highScores, null, 2));
    }
  } catch (error) {
    console.log("Error saving high score:", error);
  }
}

// Hàm hiển thị điểm cao
function displayHighScores() {
  try {
    if (fs.existsSync("highscores.json")) {
      const highScores = JSON.parse(fs.readFileSync("highscores.json"));
      console.log("\n=== High Scores ===");
      Object.entries(highScores).forEach(([difficulty, score]) => {
        console.log(`${difficulty}: ${score.attempts} attempts in ${score.time} seconds`);
      });
      console.log("==================\n");
    }
  } catch (error) {
    console.log("Error reading high scores:", error);
  }
}

// Hàm tạo gợi ý
function generateHint(target, guess, attempts, chances) {
  const difference = Math.abs(target - guess);
  const remainingChances = chances - attempts;
  
  // Gợi ý về khoảng cách
  let distanceHint = "";
  if (difference <= 5) {
    distanceHint = "You're extremely close!";
  } else if (difference <= 10) {
    distanceHint = "You're very close!";
  } else if (difference <= 25) {
    distanceHint = "You're getting warmer!";
  } else if (difference <= 50) {
    distanceHint = "You're quite far from the target.";
  } else {
    distanceHint = "You're very far from the target.";
  }

  // Gợi ý về số lần còn lại
  let chancesHint = "";
  if (remainingChances <= 1) {
    chancesHint = "This is your last chance!";
  } else if (remainingChances <= 2) {
    chancesHint = `Only ${remainingChances} chances left!`;
  } else {
    chancesHint = `You still have ${remainingChances} chances.`;
  }

  // Gợi ý về hướng tìm kiếm
  let directionHint = "";
  if (guess > target) {
    directionHint = "Try a lower number.";
  } else {
    directionHint = "Try a higher number.";
  }

  // Gợi ý về khoảng số có thể
  let rangeHint = "";
  if (difference <= 10) {
    rangeHint = `The number is within ${difference} units of your guess.`;
  } else if (difference <= 25) {
    rangeHint = `The number is within 25 units of your guess.`;
  } else {
    rangeHint = "The number is more than 25 units away from your guess.";
  }

  // Gợi ý đặc biệt cho lần đoán đầu tiên
  if (attempts === 0) {
    return "Since this is your first guess, try a number in the middle of the range (around 50) to narrow down the possibilities quickly.";
  }

  // Gợi ý đặc biệt cho lần đoán cuối
  if (remainingChances === 1) {
    return `${distanceHint} ${directionHint} ${chancesHint} Make your final guess count!`;
  }

  // Gợi ý thông thường
  return `${distanceHint} ${directionHint} ${rangeHint} ${chancesHint}`;
}

// Hàm chính của trò chơi
async function startGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("You have a limited number of chances to guess the correct number.\n");
  
  console.log("=== How to Play ===");
  console.log("1. Enter a number between 1 and 100 to make your guess");
  console.log("2. Type 'hint' to get helpful hints about your guess");
  console.log("3. Hints will tell you:");
  console.log("   - How close you are to the target");
  console.log("   - Whether to guess higher or lower");
  console.log("   - How many chances you have left");
  console.log("   - The approximate range of the target number");
  console.log("==================\n");

  console.log("Please select the difficulty level:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");

  let difficulty = await askQuestion("Enter your choice: ");
  let chances;
  switch (difficulty.trim()) {
    case "1":
      chances = 10;
      console.log("\nGreat! You have selected the Easy difficulty level.");
      break;
    case "2":
      chances = 5;
      console.log("\nGreat! You have selected the Medium difficulty level.");
      break;
    case "3":
      chances = 3;
      console.log("\nGreat! You have selected the Hard difficulty level.");
      break;
    default:
      console.log("Invalid choice. Defaulting to Medium difficulty (5 chances).");
      chances = 5;
      break;
  }

  console.log("Let's start the game!\n");

  // Máy tính chọn một số ngẫu nhiên từ 1 đến 100
  const target = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let guessedCorrectly = false;
  const startTime = Date.now();

  // Vòng lặp cho đến khi hết số lần đoán hoặc đoán đúng
  while (attempts < chances && !guessedCorrectly) {
    let guessStr = await askQuestion("Enter your guess (or 'hint' for a hint): ");
    
    if (guessStr.trim().toLowerCase() === "hint") {
      const lastGuess = attempts > 0 ? parseInt(guessStr, 10) : 50;
      console.log(`\nHint: ${generateHint(target, lastGuess, attempts, chances)}\n`);
      continue;
    }

    let guess = parseInt(guessStr, 10);
    if (isNaN(guess)) {
      console.log("Please enter a valid number.\n");
      continue;
    }
    
    attempts++;
    if (guess === target) {
      const timeSpent = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `Congratulations! You guessed the correct number in ${attempts} attempt${
          attempts > 1 ? "s" : ""
        } in ${timeSpent} seconds.\n`
      );
      guessedCorrectly = true;
      saveHighScore(difficulty, attempts, timeSpent);
    } else if (guess > target) {
      console.log(`Incorrect! The number is less than ${guess}.\n`);
    } else {
      console.log(`Incorrect! The number is greater than ${guess}.\n`);
    }
  }

  if (!guessedCorrectly) {
    console.log(
      `Sorry, you've run out of chances. The correct number was ${target}.\n`
    );
  }

  displayHighScores();

  // Hỏi người dùng có muốn chơi lại hay không
  let playAgain = await askQuestion("Would you like to play again? (yes/no): ");
  if (playAgain.trim().toLowerCase().startsWith("y")) {
    console.log("\nStarting a new game...\n");
    startGame(); // Gọi lại hàm startGame để chơi vòng mới
  } else {
    console.log("Thank you for playing! Goodbye!");
    rl.close();
  }
}

startGame();
