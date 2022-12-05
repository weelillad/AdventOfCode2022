import assert from "node:assert";
import { readFileSync } from "node:fs";

function parseStartingLayout(layout: string) {
  const layoutStrings = layout.split("\n");

  const crateStacks: Array<Array<string>> = [];
  assert(layoutStrings.length > 0);
  layoutStrings.pop()!.trim().split(/\s+/).forEach(() => crateStacks.push([]));

  let stackRow = layoutStrings.pop();
  while (stackRow && stackRow.length > 0) {
    // Assume crate labels are all length 1
    for (let i = 0; i < crateStacks.length; i++) {
      const columnStart = 4 * i;
      const crateLabel = stackRow.substring(1 + columnStart, 2 + columnStart);
      if (crateLabel && crateLabel !== " ") crateStacks[i].push(crateLabel);
    }

    stackRow = layoutStrings.pop();
  }

  return crateStacks;
}

function runSteps(layout: string, steps: Array<string>, isPartTwo: boolean): Array<Array<string>> {
  const crateStacks = parseStartingLayout(layout);
  for (const step of steps) {
    const stepParts = step.split(" ");
    const amount = parseInt(stepParts[1] || "");
    const sourceStack = crateStacks[parseInt(stepParts[3] || "") - 1];
    const destStack = crateStacks[parseInt(stepParts[5] || "") - 1];

    const cratesToMove = sourceStack.splice(sourceStack.length - amount, amount);
    !isPartTwo && cratesToMove.reverse();
    destStack.push(...cratesToMove);
  }

  return crateStacks;
}

function runDay5Logic(input: string): [string, string] {
  const [startingLayout, stepsString] = input.split("\n\n");
  const steps = stepsString.split("\n");
  const result: [string, string] = ["", ""];

  const crateStacksPart1 = runSteps(startingLayout, steps, false);
  for (const stack of crateStacksPart1) {
    result[0] += stack.pop() || "";
  }

  const crateStacksPart2 = runSteps(startingLayout, steps, true);
  for (const stack of crateStacksPart2) {
    result[1] += stack.pop() || "";
  }

  return result;
}

const day5TestData =
  `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

function day5Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = ["CMZ", "MCD"];

  const answer = runDay5Logic(day5TestData);

  answer[0] === answerKey[0]
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  answer[1] === answerKey[1]
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);

  return answer[0] === answerKey[0] && answer[1] === answerKey[1];
}

function day5() {
  const input = readFileSync("./input05.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay5Logic(input.trimEnd()));
}

day5Test() && day5();
