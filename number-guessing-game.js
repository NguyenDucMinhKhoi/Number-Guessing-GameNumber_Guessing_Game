#!/usr/bin/env node

const readline = require("readline");

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

// Hàm chính của trò chơi
async function startGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log(
    "You have a limited number of chances to guess the correct number.\n"
  );

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
      console.log(
        "Invalid choice. Defaulting to Medium difficulty (5 chances)."
      );
      chances = 5;
      break;
  }

  console.log("Let's start the game!\n");

  // Máy tính chọn một số ngẫu nhiên từ 1 đến 100
  const target = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let guessedCorrectly = false;

  // Vòng lặp cho đến khi hết số lần đoán hoặc đoán đúng
  while (attempts < chances && !guessedCorrectly) {
    let guessStr = await askQuestion("Enter your guess: ");
    let guess = parseInt(guessStr, 10);
    if (isNaN(guess)) {
      console.log("Please enter a valid number.\n");
      continue;
    }
    attempts++;
    if (guess === target) {
      console.log(
        `Congratulations! You guessed the correct number in ${attempts} attempt${
          attempts > 1 ? "s" : ""
        }.\n`
      );
      guessedCorrectly = true;
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
