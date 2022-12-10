import { readFileSync } from "node:fs";

function renderImage(imageArray: Array<boolean>) {
  let imageRow = "START";
  for (let i = 0; i < imageArray.length; i++) {
    if (i % 40 === 0) {
      console.log(imageRow);
      imageRow = "";
    }
    imageRow += imageArray[i] ? "#" : ".";
  }
  console.log(imageRow);
}

function runDay10Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];
  const instructions: Array<string> = input.split("\n");

  const cyclesOfConcern = [20, 60, 100, 140, 180, 220];
  let regX = 1, cycle = 1;
  const pixelArray: Array<boolean> = new Array(240).fill(false);

  function incrementCycle() {
    // process current cycle drawing first
    const pixelPos = (cycle - 1) % 240;
    // pixelArray[pixelPos] = (Math.abs(pixelPos - regX) > 1) ? false : true;
    if (Math.abs(pixelPos % 40 - regX) <= 1) pixelArray[pixelPos] = true;
    cycle++;
  }

  function processAddX(amount: number) {
    incrementCycle();
    if (cyclesOfConcern.includes(cycle)) {
      result[0] += cycle * regX;
    }
    incrementCycle();
    regX += amount;
  }

  for (const instruction of instructions) {
    const instr = instruction.split(" ");
    if (cyclesOfConcern.includes(cycle)) {
      result[0] += cycle * regX;
    }
    switch (instr[0]) {
      case "noop":
        incrementCycle();
        break;
      case "addx":
        processAddX(parseInt(instr[1]));
        break;
    }
  }

  renderImage(pixelArray);
  
  return result;
}

const day10TestData =
  `noop
addx 3
addx -5`;

const day10TestData2 = 
  `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

function day10Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [13140, 0, 0];
  const answer = runDay10Logic(day10TestData2);
  // const answer2 = runDay10Logic(day10TestData);
  
  const part1TestPass = answer[0] === answerKey[0];
  // const part2TestPass = answer[1] === answerKey[1] && answer2[0] === answerKey[2];

  part1TestPass
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  // part2TestPass
  //   ? console.log("Part 2 Test passed!!")
  //   : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}, ${answerKey[2]}. Received answer: ${answer[1]}, ${answer2[0]}`);

  return part1TestPass;// && part2TestPass;
}

function day10() {
  const input = readFileSync("./input10.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay10Logic(input.trimEnd()));
}

day10Test() && day10();
