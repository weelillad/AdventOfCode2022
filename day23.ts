import { readFileSync } from "node:fs";

type Coords = {
  row: number;
  col: number;
}

function coordsToString(c: Coords) {
  return `${c.row},${c.col}`;
}

type Elf = {
  pos: Coords;
  moveTo: Coords;
}

// returns [numRows, numCols]
function calcMapSize(elves: Map<string, Elf>): [number, number] {
  // find bounds
  let rowMin = 0, rowMax = 0, colMin = 0, colMax = 0;
  for (const elf of elves.values()) {
    rowMin = Math.min(rowMin, elf.pos.row);
    rowMax = Math.max(rowMax, elf.pos.row);

    colMin = Math.min(colMin, elf.pos.col);
    colMax = Math.max(colMax, elf.pos.col);
  }
  return [rowMax - rowMin + 1, colMax - colMin + 1];
}

function printElvesMap(elves: Map<string, Elf>) {
  // find bounds
  let rowMin = 0, rowMax = 0, colMin = 0, colMax = 0;
  for (const elf of elves.values()) {
    rowMin = Math.min(rowMin, elf.pos.row);
    rowMax = Math.max(rowMax, elf.pos.row);

    colMin = Math.min(colMin, elf.pos.col);
    colMax = Math.max(colMax, elf.pos.col);
  }

  const mapString: Array<string> = [];
  for (let i = rowMin; i <= rowMax; i++) {
    mapString.push("".padEnd(colMax - colMin + 1, "."));
  }

  for (const elf of elves.values()) {
    const rowStr = mapString[elf.pos.row - rowMin];
    mapString[elf.pos.row - rowMin] = rowStr.substring(0, elf.pos.col - colMin) + "#" + rowStr.substring(elf.pos.col - colMin + 1);
  }

  for (const rowStr of mapString) {
    console.log(rowStr);
  }
}

function runDay23Logic(input: string, numRounds: number): [number, number] {
  const result: [number, number] = [0, 0];

  const mapRows = input.split("\n");
  const elves: Map<string, Elf> = new Map();
  mapRows.forEach((rowStr, rowIndex) => {
    rowStr.split("").forEach((char, colIndex) => {
      if (char === "#") {
        elves.set(coordsToString({ row: rowIndex, col: colIndex }), { pos: { row: rowIndex, col: colIndex }, moveTo: { row: rowIndex, col: colIndex } });
      }
    })
  });
  // console.log(elves);

  const dirArray = ["N", "S", "W", "E"];
  const moveMap: Map<string, Array<Elf>> = new Map();

  function addElfToMoveMap(elf: Elf, pos: Coords) {
    const posStr = coordsToString(pos);
    if (moveMap.has(posStr)) {
      moveMap.get(posStr)!.push(elf);
    } else {
      moveMap.set(coordsToString(pos), [elf])
    }
  }

  function calculateMove(elf: Elf) {
    const eastCell = elves.get(coordsToString({ row: elf.pos.row, col: elf.pos.col + 1 }));
    const southeastCell = elves.get(coordsToString({ row: elf.pos.row + 1, col: elf.pos.col + 1 }));
    const southCell = elves.get(coordsToString({ row: elf.pos.row + 1, col: elf.pos.col }));
    const southwestCell = elves.get(coordsToString({ row: elf.pos.row + 1, col: elf.pos.col - 1 }));
    const westCell = elves.get(coordsToString({ row: elf.pos.row, col: elf.pos.col - 1 }));
    const northwestCell = elves.get(coordsToString({ row: elf.pos.row - 1, col: elf.pos.col - 1 }));
    const northCell = elves.get(coordsToString({ row: elf.pos.row - 1, col: elf.pos.col }));
    const northeastCell = elves.get(coordsToString({ row: elf.pos.row - 1, col: elf.pos.col + 1 }));
    // Check for surrounding company
    if (eastCell || southeastCell || southCell || southwestCell || westCell || northwestCell || northCell || northeastCell) {
      // calculate proposed move
      for (const dir of dirArray) {
        if (dir === "N" && !northwestCell && !northCell && !northeastCell) {
          elf.moveTo = { row: elf.pos.row - 1, col: elf.pos.col };
          break;
        } else if (dir === "S" && !southwestCell && !southCell && !southeastCell) {
          elf.moveTo = { row: elf.pos.row + 1, col: elf.pos.col };
          break;
        } else if (dir === "E" && !northeastCell && !eastCell && !southeastCell) {
          elf.moveTo = { row: elf.pos.row, col: elf.pos.col + 1 };
          break;
        } else if (dir === "W" && !northwestCell && !westCell && !southwestCell) {
          elf.moveTo = { row: elf.pos.row, col: elf.pos.col - 1 };
          break;
        }
      }
    }

    addElfToMoveMap(elf, elf.moveTo);
  }

  function performMoves(): boolean {
    let elfMoved = false;
    for (const elfArray of moveMap.values()) {
      if (elfArray.length === 0) continue;
      else if (elfArray.length === 1) {
        const [elf] = elfArray;
        if (elf.pos.row !== elf.moveTo.row || elf.pos.col !== elf.moveTo.col) elfMoved = true;
        elf.pos = elf.moveTo;
        elves.set(coordsToString(elf.pos), elf);
      } else {
        elfArray.forEach(elf => {
          elf.moveTo = elf.pos;
          elves.set(coordsToString(elf.pos), elf);
        });
      }
    }
    return elfMoved;
  }

  let elfMoved = true, i = 0;
  for (; elfMoved; i++) {
    // console.log(`Round ${i + 1}: ${dirArray[0]} Wind`);
    
    moveMap.clear();
    for (const elf of elves.values()) {
      calculateMove(elf);
    }
    elves.clear();
    elfMoved = performMoves();
    dirArray.push(dirArray.shift()!);

    // printElvesMap(elves); // for debugging

    if (i === (numRounds - 1)) {
      const [numRows, numCols] = calcMapSize(elves);
      result[0] = numRows * numCols - elves.size;
    }
  }

  result[1] = i;
  
  return result;
}

const day23TestData =
  `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

const day23TestDataSmall =
  `.....
..##.
..#..
.....
..##.
.....`;

function day23Test(): boolean {
  console.log("\nTEST\n");

  runDay23Logic(day23TestDataSmall, 3);

  const answerKey = [110, 20];
  const answer = runDay23Logic(day23TestData, 10);
  
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

function day23() {
  const input = readFileSync("./input23.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay23Logic(input.trimEnd(), 10));
}

day23Test() && day23();
