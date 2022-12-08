import { readFileSync } from "node:fs";

type Row<T> = {
  columns: Array<T>;
}

function part1Logic(treeRows: Array<Row<number>>): number {
  const rowLength = treeRows[0].columns.length;
  const visibilityRows: Array<Row<boolean>> = treeRows.map(() => {
    return { columns: new Array(rowLength).fill(false) };
  });

  for (let i = 0; i < rowLength; i++) {
    // check visibility from top edge
    visibilityRows[0].columns[i] = true;
    let maxTreeHeight = treeRows[0].columns[i];
    for (let j = 1; j < treeRows.length; j++) {
      if (treeRows[j].columns[i] <= maxTreeHeight) continue;
      visibilityRows[j].columns[i] = true;
      maxTreeHeight = treeRows[j].columns[i];
    }

    // check visibility from bottom edge
    visibilityRows[treeRows.length - 1].columns[i] = true;
    maxTreeHeight = treeRows[treeRows.length - 1].columns[i];
    for (let j = treeRows.length - 2; j > 0; j--) {
      if (treeRows[j].columns[i] <= maxTreeHeight) continue;
      visibilityRows[j].columns[i] = true;
      maxTreeHeight = treeRows[j].columns[i];
    }
  }

  treeRows.forEach(({ columns }, index) => {
    // check visibility from left edge
    visibilityRows[index].columns[0] = true;
    let maxTreeHeight = columns[0];
    for (let i = 1; i < columns.length; i++) {
      if (columns[i] <= maxTreeHeight) continue;
      visibilityRows[index].columns[i] = true;
      maxTreeHeight = columns[i];
    }

    // check visibility from right edge
    visibilityRows[index].columns[rowLength - 1] = true;
    maxTreeHeight = columns[rowLength - 1];
    for (let i = rowLength - 2; i > 0; i--) {
      if (columns[i] <= maxTreeHeight) continue;
      visibilityRows[index].columns[i] = true;
      maxTreeHeight = columns[i];
    }

    // console.log(visibilityRows[index].columns);
  });

  return visibilityRows.reduce((visibleCount, row) => visibleCount + row.columns.reduce((rowVisibleCount, cell) => cell ? rowVisibleCount + 1 : rowVisibleCount, 0), 0)
}

function part2Logic(treeRows: Array<Row<number>>): number {
  const rowLength = treeRows[0].columns.length;
  let maxScenicScore = 0;
  for (let y = 1; y < treeRows.length - 1; y++) {
    for (let x = 1; x < rowLength - 1; x++) {
      let scenicScore = 1;
      const candidateHeight = treeRows[y].columns[x];

      // check left view
      let numTreesSeen = 1;
      let maxTreeHeight = treeRows[y].columns[x - 1];
      for (let i = x - 2; i >= 0 && maxTreeHeight < candidateHeight; i--) {
        // if (treeRows[y].columns[i] < maxTreeHeight) continue;
        numTreesSeen++;
        maxTreeHeight = treeRows[y].columns[i];
      }
      // console.log(`(${x}, ${y}) - ${numTreesSeen} to the left`);
      scenicScore *= numTreesSeen;

      // check right view
      numTreesSeen = 1;
      maxTreeHeight = treeRows[y].columns[x + 1];
      for (let i = x + 2; i < rowLength && maxTreeHeight < candidateHeight; i++) {
        // if (treeRows[y].columns[i] < maxTreeHeight) continue;
        numTreesSeen++;
        maxTreeHeight = treeRows[y].columns[i];
      }
      // console.log(`(${x}, ${y}) - ${numTreesSeen} to the right`);
      scenicScore *= numTreesSeen;

      // check top view
      numTreesSeen = 1;
      maxTreeHeight = treeRows[y - 1].columns[x];
      for (let i = y - 2; i >= 0 && maxTreeHeight < candidateHeight; i--) {
        // if (treeRows[i].columns[x] < maxTreeHeight) continue;
        numTreesSeen++;
        maxTreeHeight = treeRows[i].columns[x];
      }
      // console.log(`(${x}, ${y}) - ${numTreesSeen} to the top`);
      scenicScore *= numTreesSeen;

      // check bottom view
      numTreesSeen = 1;
      maxTreeHeight = treeRows[y + 1].columns[x];
      for (let i = y + 2; i < treeRows.length && maxTreeHeight < candidateHeight; i++) {
        // if (treeRows[i].columns[x] < maxTreeHeight) continue;
        numTreesSeen++;
        maxTreeHeight = treeRows[i].columns[x];
      }
      // console.log(`(${x}, ${y}) - ${numTreesSeen} to the bottom`);
      scenicScore *= numTreesSeen;
      // console.log(`(${x}, ${y}) - ${scenicScore}`);

      maxScenicScore = Math.max(scenicScore, maxScenicScore);
    }
  }
  return maxScenicScore;
}

function runDay8Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];
  const treeRows: Array<Row<number>> = input.split("\n").map(inputRow => {
    return { columns: inputRow.split("").map(num => parseInt(num)) };
  });
  
  result[0] = part1Logic(treeRows);
  result[1] = part2Logic(treeRows);

  return result;
}

const day8TestData =
  `30373
25512
65332
33549
35390`;

function day8Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [21, 8];

  const answer = runDay8Logic(day8TestData);
  
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

function day8() {
  const input = readFileSync("./input08.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay8Logic(input.trimEnd()));
}

day8Test() && day8();
