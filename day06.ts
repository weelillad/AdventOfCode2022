import { readFileSync } from "node:fs";

function hasDuplicateLetters(input: string): boolean {
  const charSet = new Set(Array.from(input));
  return charSet.size !== input.length;
}

function runDay6Logic(input: string): [Array<number>, Array<number>] {
  const buffers = input.split("\n");
  const result: [Array<number>, Array<number>] = [[], []];

  for (const buffer of buffers) {
    // Part 1
    for (let i = 4; i < buffer.length; i++) {
      if (!hasDuplicateLetters(buffer.substring(i - 4, i))) {
        result[0].push(i);
        break;
      }
    }

    // Part 2
    for (let i = 14; i < buffer.length; i++) {
      if (!hasDuplicateLetters(buffer.substring(i - 14, i))) {
        result[1].push(i);
        break;
      }
    }
  }

  return result;
}

const day6TestData =
  `mjqjpqmgbljsphdztnvjfqwrcgsmlb
bvwbjplbgvbhsrlpgdmjqwftvncz
nppdvjthqldpwncqszvftbrmjlhg
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`;

function day6Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [[7, 5, 6, 10, 11], [19, 23, 23, 29, 26]];

  const answer = runDay6Logic(day6TestData);
  
  const part1TestPass = answer[0].length === answerKey[0].length && answer[0].every((val, idx) => val === answerKey[0][idx]);
  const part2TestPass = answer[1].length === answerKey[1].length && answer[1].every((val, idx) => val === answerKey[1][idx]);
  part1TestPass
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  part2TestPass
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);

  return part1TestPass && part2TestPass;
}

function day6() {
  const input = readFileSync("./input06.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay6Logic(input.trimEnd()));
}

day6Test() && day6();
