import assert from "node:assert";
import { readFileSync } from "node:fs";

type Element = {
  id: number;
  value: number;
}

function decrypt(input: string, decryptionKey: number, numRounds: number): number {
  const elements: Array<Element> = input.split("\n").map((str, index) => {
    return { id: index, value: parseInt(str) * decryptionKey };
  });
  const arrayLength = elements.length;

  // Debug - check if all elements are unique
  // const elementSet = new Set();

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < arrayLength; i++) {
      // elementSet.add(element);
      const origPosition = elements.findIndex(e => e.id === i);
      const element = elements[origPosition];
      const newPosition = (origPosition + element.value) % (arrayLength - 1);
      // if (newPosition === 0) newPosition = -1;
      // console.log(`Move ${element} from ${origPosition} to ${newPosition}`);
      elements.splice(origPosition, 1);
      elements.splice(newPosition, 0, element);
      // console.log(elements);
    }
  }

  // assert(elementSet.size === arrayLength, "Duplicate elements in array!");
  assert(elements.length === arrayLength, "Array length mismatch!!");

  const zeroPosition = elements.findIndex(e => e.value === 0);
  console.log(`${arrayLength} ${zeroPosition} ${elements.at((zeroPosition + 1000) % arrayLength)?.value}`)
  return (elements.at((zeroPosition + 1000) % arrayLength)?.value ?? 0) 
    + (elements.at((zeroPosition + 2000) % arrayLength)?.value ?? 0)
    + (elements.at((zeroPosition + 3000) % arrayLength)?.value ?? 0);
}

function runDay20Logic(input: string): [number, number] {
  return [decrypt(input, 1, 1), decrypt(input, 811589153, 10)];
}

const day20TestData =
  `1
2
-3
3
-2
0
4`;

function day20Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [3, 1623178306];
  const answer = runDay20Logic(day20TestData);
  
  const part1TestPass = answer[0] === answerKey[0];
  const part2TestPass = answer[1] === answerKey[1];

  part1TestPass
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  part2TestPass
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);

  return part1TestPass && part2TestPass;
}

function day20() {
  const input = readFileSync("./input20.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay20Logic(input.trimEnd()));
}

day20Test() && day20();
