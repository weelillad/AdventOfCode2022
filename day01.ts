import { readFileSync } from "node:fs";

function runDay1Logic(input: string): [number, number] {
  const calorieArray: Array<number> = input.split("\n\n").map(oneElf =>
    oneElf.split("\n").reduce((calorieSum, str) => {
      return calorieSum + parseInt(str);
    }, 0)
  );

  const sortedCalorieArray = calorieArray.sort((a, b) => b - a);

  return [sortedCalorieArray[0], sortedCalorieArray[0] + sortedCalorieArray[1] + sortedCalorieArray[2]];
}

const day1TestData =
  `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

function day1Test() {
  console.log("\nTEST\n");

  const answerKey = [24000, 45000];

  const answer = runDay1Logic(day1TestData);

  answer[0] === answerKey[0]
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  answer[1] === answerKey[1]
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);
}

function day1() {
  const input = readFileSync("./input01.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay1Logic(input.trimEnd()));
}

day1Test();
day1();
