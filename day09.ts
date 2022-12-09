import { readFileSync } from "node:fs";

type Move = {
  direction: string; // "L" | "R" | "U" | "D"
  magnitude: number;
};

type Coords = {
  x: number;
  y: number;
};

function coordsToString(coords: Coords): string {
  return `${coords.x},${coords.y}`;
}

type Rope = Array<Coords>;

function moveRope(rope: Rope, direction: string): Rope {
  switch (direction) {
    case "L":
      rope[0].x -= 1;
      break;
    case "R":
      rope[0].x += 1;
      break;
    case "U":
      rope[0].y += 1;
      break;
    case "D":
      rope[0].y -= 1;
      break;
    default: 
      throw Error(`Invalid direction ${direction}`);
  }

  // move remaining knots
  for (let i = 1; i < rope.length; i++) {
    if (Math.abs(rope[i - 1].y - rope[i].y) > 1 || Math.abs(rope[i - 1].x - rope[i].x) > 1) {
      if (rope[i - 1].y > rope[i].y) rope[i].y++;
      else if (rope[i - 1].y < rope[i].y) rope[i].y--;

      if (rope[i - 1].x > rope[i].x) rope[i].x++;
      else if (rope[i - 1].x < rope[i].x) rope[i].x--;
    }
  }

  return rope;
}

function runDay9Logic(input: string): [number, number] {
  let result: [number, number] = [0, 0];
  const moves: Array<Move> = input.split("\n").map(line => {
    const [dir, mag] = line.split(" ");
    return { direction: dir, magnitude: parseInt(mag) };
  });

  const tailMarks1: Map<string, boolean> = new Map();
  const tailMarks2: Map<string, boolean> = new Map();
  tailMarks1.set(coordsToString({ x: 0, y: 0 }), true);
  tailMarks2.set(coordsToString({ x: 0, y: 0 }), true);

  let rope1 = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  let rope2 = new Array<Coords>();
  for (let i = 0; i < 10; i++) {
    rope2.push({ x: 0, y: 0 });
  }

  for (const move of moves) {
    for (let i = 0; i < move.magnitude; i++) {
      rope1 = moveRope(rope1, move.direction);
      // console.log(rope1);
      tailMarks1.set(coordsToString(rope1[1]), true);

      rope2 = moveRope(rope2, move.direction);
      // console.log(rope2);
      tailMarks2.set(coordsToString(rope2[9]), true);
    }
  }

  result = [tailMarks1.size, tailMarks2.size];
  
  return result;
}

const day9TestData =
  `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const day9TestData2 = 
  `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

function day9Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [13, 1, 36];
  const answer = runDay9Logic(day9TestData);
  const answer2 = runDay9Logic(day9TestData2);
  
  const part1TestPass = answer[0] === answerKey[0];
  const part2TestPass = answer[1] === answerKey[1] && answer2[1] === answerKey[2];

  part1TestPass
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  part2TestPass
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}, ${answerKey[2]}. Received answer: ${answer[1]}, ${answer2[1]}`);

  return part1TestPass && part2TestPass;
}

function day9() {
  const input = readFileSync("./input09.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay9Logic(input.trimEnd()));
}

day9Test() && day9();
