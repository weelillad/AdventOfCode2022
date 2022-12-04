import { readFileSync } from "node:fs";

type SectAssignment = {
  start: number,
  end: number
}

type PairAssignments = {
  first: SectAssignment,
  second: SectAssignment
}

function parsePairAssignments(assignmentsStr: string): PairAssignments {
  const assignments = assignmentsStr.split(",");
  const firstAssignment = assignments[0].split("-");
  const secondAssignment = assignments[1].split("-");
  return {
    first: {
      start: parseInt(firstAssignment[0]),
      end: parseInt(firstAssignment[1])
    },
    second: {
      start: parseInt(secondAssignment[0]),
      end: parseInt(secondAssignment[1])
    }
  }
}

function hasFullOverlap(assignments: PairAssignments): boolean {
  return (assignments.first.start <= assignments.second.start && assignments.first.end >= assignments.second.end)
    || (assignments.first.start >= assignments.second.start && assignments.first.end <= assignments.second.end)
}

function hasPartialOverlap(assignments: PairAssignments): boolean {
  return !(assignments.first.start > assignments.second.end || assignments.second.start > assignments.first.end)
}

function runDay4Logic(input: string): [number, number] {
  const pairAssignments = input.split("\n");
  const result: [number, number] = [0, 0];

  for (const assignments of pairAssignments) {
    const pairAssignments = parsePairAssignments(assignments);
    // Part 1
    hasFullOverlap(pairAssignments) && result[0]++;
    // Part 2
    hasPartialOverlap(pairAssignments) && result[1]++;
  }

  return result;
}

const day4TestData =
  `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

function day4Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [2, 4];

  const answer = runDay4Logic(day4TestData);

  answer[0] === answerKey[0]
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  answer[1] === answerKey[1]
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);

  return answer[0] === answerKey[0] && answer[1] === answerKey[1];
}

function day4() {
  const input = readFileSync("./input04.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay4Logic(input.trimEnd()));
}

day4Test() && day4();
