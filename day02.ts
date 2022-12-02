import { readFileSync } from "node:fs";

const winScore = 6, drawScore = 3, loseScore = 0;

function calculateRoundScore(opponentInput: string, ownInput: string): number {
  let playScore: number;
  switch (ownInput) {
    case "X":
      playScore = 1;
      switch (opponentInput) {
        case "A":
          return playScore + drawScore;
        case "B":
          return playScore + loseScore;
        case "C":
          return playScore + winScore;
        default:
          return 0;
      }
    case "Y":
      playScore = 2;
      switch (opponentInput) {
        case "A":
          return playScore + winScore;
        case "B":
          return playScore + drawScore;
        case "C":
          return playScore + loseScore;
        default:
          return 0;
      }
    case "Z":
      playScore = 3;
      switch (opponentInput) {
        case "A":
          return playScore + loseScore;
        case "B":
          return playScore + winScore;
        case "C":
          return playScore + drawScore;
        default:
          return 0;
      }
    default:
      return 0;
  }
}

function calculateResultScore(opponentInput: string, intendedResult: string): number {
  switch (intendedResult) {
    case "X": // lose
      switch (opponentInput) {
        case "A":
          return 3;
        case "B":
          return 1;
        case "C":
          return 2;
        default:
          return 0;
      }
    case "Y": // draw
      switch (opponentInput) {
        case "A":
          return drawScore + 1;
        case "B":
          return drawScore + 2;
        case "C":
          return drawScore + 3;
        default:
          return 0;
      }
    case "Z": // win
      switch (opponentInput) {
        case "A":
          return winScore + 2;
        case "B":
          return winScore + 3;
        case "C":
          return winScore + 1;
        default:
          return 0;
      }
    default:
      return 0;
  }
}

function runDay2Logic(input: string): [number, number] {
  const score: [number, number] = input.split("\n").reduce((currScore, round) => {
    const play: Array<string> = round.split(' ');
    return [currScore[0] + calculateRoundScore(play[0], play[1]), currScore[1] + calculateResultScore(play[0], play[1])];
  }, [0, 0]);

  return score;
}

const day2TestData =
  `A Y
B X
C Z`;

function day2Test() {
  console.log("\nTEST\n");

  const answerKey = [15, 12];

  const answer = runDay2Logic(day2TestData);

  answer[0] === answerKey[0]
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  answer[1] === answerKey[1]
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);
}

function day2() {
  const input = readFileSync("./input02.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay2Logic(input.trimEnd()));
}

day2Test();
day2();
