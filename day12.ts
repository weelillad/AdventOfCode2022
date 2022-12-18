import { readFileSync } from "node:fs";

type Coords = {
  x: number;
  y: number;
}

function coordsToString(c: Coords): string {
  return `${c.x},${c.y}`;
}

function strToCoords(str: string): Coords {
  const [x, y] = str.split(",").map(val => parseInt(val));
  return { x, y }; 
}

type MapSquare = {
  height: number;
  minDistFromE: number;
}

function runDay12Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];

  let start: Coords = { x: 0, y: 0 }, end: Coords = { x: 0, y: 0 };
  const heightMap: Array<Array<MapSquare>> = input.split("\n").map((row, yIndex) => row.split("").map((char, xIndex) => {
    if (char === "S") {
      start = { x: xIndex, y: yIndex };
      return { height: 0, minDistFromE: 9999 };
    } else if (char === "E") {
      end = { x: xIndex, y: yIndex };
      return { height: 25, minDistFromE: 0 };
    } else {
      return { height: char.charCodeAt(0) - "a".charCodeAt(0), minDistFromE: 9999 };
    }
  }));
  
  // heightMap.forEach(row => console.log(row));

  //Part 1

  const routeScan: Set<string> = new Set([coordsToString(end)]);
  for (const square of routeScan.values()) {
    const { x, y } = strToCoords(square);
    const { height, minDistFromE } = heightMap[y][x];

    if (y + 1 < heightMap.length) {
      const { height: adjHeight, minDistFromE: adjDistFromE } = heightMap[y + 1][x];
      if (adjHeight >= height - 1) {
        heightMap[y + 1][x].minDistFromE = Math.min(minDistFromE + 1, adjDistFromE);
        routeScan.add(coordsToString({ x, y: y + 1 }));
      }
    }
    if (y - 1 >= 0) {
      const { height: adjHeight, minDistFromE: adjDistFromE } = heightMap[y - 1][x];
      if (adjHeight >= height - 1) {
        heightMap[y - 1][x].minDistFromE = Math.min(minDistFromE + 1, adjDistFromE);
        routeScan.add(coordsToString({ x, y: y - 1 }));
      }
    }
    if (x + 1 < heightMap[0].length) {
      const { height: adjHeight, minDistFromE: adjDistFromE } = heightMap[y][x + 1];
      if (adjHeight >= height - 1) {
        heightMap[y][x + 1].minDistFromE = Math.min(minDistFromE + 1, adjDistFromE);
        routeScan.add(coordsToString({ x: x + 1, y }));
      }
    }
    if (x - 1 >= 0) {
      const { height: adjHeight, minDistFromE: adjDistFromE } = heightMap[y][x - 1];
      if (adjHeight >= height - 1) {
        heightMap[y][x - 1].minDistFromE = Math.min(minDistFromE + 1, adjDistFromE);
        routeScan.add(coordsToString({ x: x - 1, y }));
      }
    }
  }

  // heightMap.forEach(row => console.log(row));

  result[0] = heightMap[start.y][start.x].minDistFromE;

  // Part 2

  result[1] = result[0];
  heightMap.forEach(row => row.forEach(square => {
    if (square.height === 0) {
      result[1] = Math.min(result[1], square.minDistFromE);
    }
  }));

  return result;
}

const day12TestData = 
  `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

function day12Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [31, 29];
  const answer = runDay12Logic(day12TestData);
  
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

function day12() {
  const input = readFileSync("./input12.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay12Logic(input.trimEnd()));
}

day12Test() && day12();
