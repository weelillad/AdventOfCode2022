import { readFileSync } from "node:fs";

type Coords = {
  row: number;
  col: number;
}

function runDay22Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];

  const [mapStr, pathStr] = input.split("\n\n");
  const mapLines = mapStr.split("\n");

  const location: Coords = { col: mapLines[0].indexOf("."), row: 0 };
  let facing = "right";

  const move = (stepCount: number): number => {
    switch (facing) {
      case "right":
        while (stepCount > 0 && mapLines[location.row]?.charAt(location.col + 1) === ".") {
          stepCount--;
          location.col += 1;
        }
        if (mapLines[location.row]?.charAt(location.col + 1) === "#") stepCount = 0;
        break;
      case "down":
        while (stepCount > 0 && mapLines[location.row + 1]?.charAt(location.col) === ".") {
          stepCount--;
          location.row += 1;
        }
        if (mapLines[location.row + 1]?.charAt(location.col) === "#") stepCount = 0;
        break;
      case "left":
        while (stepCount > 0 && mapLines[location.row]?.charAt(location.col - 1) === ".") {
          stepCount--;
          location.col -= 1;
        }
        if (mapLines[location.row]?.charAt(location.col - 1) === "#") stepCount = 0;
        break; 
      case "up":
        while (stepCount > 0 && mapLines[location.row - 1]?.charAt(location.col) === ".") {
          stepCount--;
          location.row -= 1;
        }
        if (mapLines[location.row - 1]?.charAt(location.col) === "#") stepCount = 0;
        break;
    }
    return stepCount
  };

  const wrap = () => {
    const wrapLoc = { row: location.row, col: location.col }
    switch (facing) {
      case "right":
        while (/[.#]/.test(mapLines[wrapLoc.row]?.charAt(wrapLoc.col - 1) ?? "")) {
          wrapLoc.col -= 1;
        }
        break;
      case "down":
        while (/[.#]/.test(mapLines[wrapLoc.row - 1]?.charAt(wrapLoc.col) ?? "")) {
          wrapLoc.row -= 1;
        }
        break;
      case "left":
        while (/[.#]/.test(mapLines[wrapLoc.row]?.charAt(wrapLoc.col + 1) ?? "")) {
          wrapLoc.col += 1;
        }
        break; 
      case "up":
        while (/[.#]/.test(mapLines[wrapLoc.row + 1]?.charAt(wrapLoc.col) ?? "")) {
          wrapLoc.row += 1;
        }
        break;
    }
    return wrapLoc;
  };

  const pathArr = pathStr.match(/(?:\d+)|L|R/g) ?? [];
  for (const step of pathArr) {
    // console.log(`Processing step ${step}`)
    if (!isNaN(+step)) {
      // move forward by n steps
      let stepCount = parseInt(step);
      stepCount = move(stepCount);
      while (stepCount > 0) {
        const wrapLoc = wrap();
        if (mapLines[wrapLoc.row][wrapLoc.col] === "#") {
          break;
        } else {
          stepCount--;
          location.col = wrapLoc.col;
          location.row = wrapLoc.row;
        }
        stepCount = move(stepCount);
      }
    } else {
      // change facing
      switch (facing) {
        case "right":
          facing = step === "L" ? "up" : "down";
          break;
        case "down":
          facing = step === "L" ? "right" : "left";
          break;
        case "left":
          facing = step === "L" ? "down" : "up";
          break;
        case "up":
          facing = step === "L" ? "left" : "right";
          break;
        default:
          throw Error(`Invalid facing ${facing}`);
      }
    }
    // console.log(location, facing);
  }

  const facingScore = facing === "right" 
    ? 0
    : facing === "down"
      ? 1
      : facing === "left"
        ? 2
        : 3; // "up"
  result[0] = 1000 * (location.row + 1) + 4 * (location.col + 1) + facingScore;

  return result;
}

const day22TestData =
  `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

function day22Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [6032, 0];
  const answer = runDay22Logic(day22TestData);
  
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

function day22() {
  const input = readFileSync("./input22.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay22Logic(input.trimEnd()));
}

day22Test() && day22();
