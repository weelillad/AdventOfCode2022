import { readFileSync } from "node:fs";

type Coords3D = {
  x: number;
  y: number;
  z: number;
}

function coords3DToString(c: Coords3D): string {
  return `${c.x},${c.y},${c.z}`;
}

function strToCoords3D(str: string): Coords3D {
  const [x, y, z] = str.split(",").map(val => parseInt(val));
  return { x, y, z }; 
}

function runDay18Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];
  const droplets: Array<Coords3D> = input.split("\n").map(str => strToCoords3D(str));

  const dropletMap: Map<string, boolean> = new Map();
  droplets.forEach(d => dropletMap.set(coords3DToString(d), true));

  function countExposedSides(coords: Coords3D): number {
    const { x, y, z } = coords;
    let exposedSides = 0;

    if (!dropletMap.has(coords3DToString({ x: x - 1, y, z }))) exposedSides++;
    if (!dropletMap.has(coords3DToString({ x: x + 1, y, z }))) exposedSides++;
    if (!dropletMap.has(coords3DToString({ x, y: y - 1, z }))) exposedSides++;
    if (!dropletMap.has(coords3DToString({ x, y: y + 1, z }))) exposedSides++;
    if (!dropletMap.has(coords3DToString({ x, y, z: z - 1 }))) exposedSides++;
    if (!dropletMap.has(coords3DToString({ x, y, z: z + 1 }))) exposedSides++;

    return exposedSides;
  }

  // Part 1
  result[0] = droplets.reduce((sum, droplet) => sum + countExposedSides(droplet), 0);

  // Part 2
  const dimensionMax = 20;
  
  // Get a list of exterior air cells
  const exteriorCells: Set<string> = new Set([coords3DToString({ x: -1, y: -1, z: -1 })]);
  for (const coordStr of exteriorCells.values()) {
    const { x, y, z } = strToCoords3D(coordStr);
    let newCoordStr = coords3DToString({ x: x - 1, y, z });
    if (x >= 0 && !dropletMap.has(newCoordStr)) exteriorCells.add(newCoordStr);
    newCoordStr = coords3DToString({ x: x + 1, y, z });
    if (x < dimensionMax && !dropletMap.has(newCoordStr)) exteriorCells.add(newCoordStr);
    newCoordStr = coords3DToString({ x, y: y - 1, z });
    if (y >= 0 && !dropletMap.has(newCoordStr)) exteriorCells.add(newCoordStr);
    newCoordStr = coords3DToString({ x, y: y + 1, z });
    if (y < dimensionMax && !dropletMap.has(newCoordStr)) exteriorCells.add(newCoordStr);
    newCoordStr = coords3DToString({ x, y, z: z - 1 });
    if (z >= 0 && !dropletMap.has(newCoordStr)) exteriorCells.add(newCoordStr);
    newCoordStr = coords3DToString({ x, y, z: z + 1 });
    if (z < dimensionMax && !dropletMap.has(newCoordStr)) exteriorCells.add(newCoordStr);
  }

  const countExteriorSides = (coords: Coords3D): number => {
    const { x, y, z } = coords;
    let exteriorSides = 0;

    if (exteriorCells.has(coords3DToString({ x: x - 1, y, z }))) exteriorSides++;
    if (exteriorCells.has(coords3DToString({ x: x + 1, y, z }))) exteriorSides++;
    if (exteriorCells.has(coords3DToString({ x, y: y - 1, z }))) exteriorSides++;
    if (exteriorCells.has(coords3DToString({ x, y: y + 1, z }))) exteriorSides++;
    if (exteriorCells.has(coords3DToString({ x, y, z: z - 1 }))) exteriorSides++;
    if (exteriorCells.has(coords3DToString({ x, y, z: z + 1 }))) exteriorSides++;

    return exteriorSides;
  }

  result[1] = droplets.reduce((sum, droplet) => sum + countExteriorSides(droplet), 0);

  return result;
}

const day18TestData =
  `1,1,1
  2,1,1`;

const day18TestData2 =
  `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

function day18Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [10, 10];
  const answerKey2 = [64, 58];
  const answer = runDay18Logic(day18TestData);
  const answer2 = runDay18Logic(day18TestData2);
  
  const part1TestPass = answer[0] === answerKey[0] && answer2[0] === answerKey2[0];
  const part2TestPass = answer[1] === answerKey[1] && answer2[1] === answerKey2[1];

  part1TestPass
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}, ${answerKey2[0]}. Received answer: ${answer[0]}, ${answer2[0]}`);

  part2TestPass
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}, ${answerKey2[1]}. Received answer: ${answer[1]}, ${answer2[1]}`);

  return part1TestPass && part2TestPass;
}

function day18() {
  const input = readFileSync("./input18.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay18Logic(input.trimEnd()));
}

day18Test() && day18();
