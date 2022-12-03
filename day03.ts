import { readFileSync } from "node:fs";

function getItemPriority(char: string): number {
  const asciiValue = char.charCodeAt(0);
  if (asciiValue >= 97) {
    return asciiValue - 96;
  } else {
    return asciiValue - 38;
  }
}

function runDay3Logic(input: string): [number, number] {
  const rucksacks = input.split("\n");
  const result: [number, number] = [0, 0];

  // Part 1
  for (const rucksack of rucksacks) {
    const halfSize = rucksack.length / 2;
    const itemMap: Map<string, boolean> = new Map();
    for (let i = 0; i < halfSize; i++) {
      itemMap.set(rucksack.charAt(i), true);
    }
    for (let j = halfSize; j < rucksack.length; j++) {
      const char = rucksack.charAt(j);
      if (itemMap.get(char)) {
        result[0] += getItemPriority(char);
        break;
      }
    }
  }

  // Part 2
  for (let k = 0; k < rucksacks.length; k += 3) {
    for (const packOneItem of rucksacks[k]) {
      if (rucksacks[k + 1].includes(packOneItem) && rucksacks[k + 2].includes(packOneItem)) {
        result[1] += getItemPriority(packOneItem);
        break;
      }
    }
  }

  return result;
}

const day3TestData =
  `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function day3Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [157, 70];

  const answer = runDay3Logic(day3TestData);

  answer[0] === answerKey[0]
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  answer[1] === answerKey[1]
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);

  return answer[0] === answerKey[0] && answer[1] === answerKey[1];
}

function day3() {
  const input = readFileSync("./input03.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay3Logic(input.trimEnd()));
}

day3Test() && day3();
