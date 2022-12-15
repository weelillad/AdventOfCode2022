import { readFileSync } from "node:fs";

type Coords = {
  x: number;
  y: number;
}

type Sensor = {
  pos: Coords;
  nearestBeacon: Coords;
  manhattanDistance?: number;
};

// Stores the inclusive x-range for a specified y-coordinate where there cannot be a beacon.
type ClearBlock = {
  leftCoord: number;
  rightCoord: number;
}

function calcManhattanDistance(s: Sensor): number {
  return Math.abs(s.pos.x - s.nearestBeacon.x) + Math.abs(s.pos.y - s.nearestBeacon.y);
}

function findBlockedXRange(sensors: Array<Sensor>, queryY: number): Array<ClearBlock> {
  const noBeaconBlocks: Array<ClearBlock> = [];
  sensors.forEach(sensor => {
    const center = sensor.pos.x, radius = Math.max((sensor.manhattanDistance ?? 0) - Math.abs(sensor.pos.y - queryY), -1);
    radius >= 0 &&
      noBeaconBlocks.push({ leftCoord: center - radius, rightCoord: center + radius });
  });

  // merge ranges
  noBeaconBlocks.sort((a, b) => a.leftCoord - b.leftCoord);
  const mergedBlocks: Array<ClearBlock> = [noBeaconBlocks[0]];
  for (let i = 1; i < noBeaconBlocks.length; i++) {
    const block = noBeaconBlocks[i], lastBlock = mergedBlocks.at(-1);
    if (block.leftCoord <= lastBlock!.rightCoord)
      lastBlock!.rightCoord = Math.max(lastBlock!.rightCoord, block.rightCoord);
    else {
      mergedBlocks.push(block);
    }
  }

  return mergedBlocks;
}

function runDay15Logic(input: string, part1Query: number, part2Query: number): [number, number] {
  const result: [number, number] = [0, 0];
  const beaconsAtQuery: Set<number> = new Set();
  const sensors: Array<Sensor> = input.split("\n").map(str => {
    const coords = str.match(/-?\d+/g) ?? [];
    const sensor: Sensor = {
      pos: { x: parseInt(coords[0] ?? ""), y: parseInt(coords[1] ?? "") },
      nearestBeacon: { x: parseInt(coords[2] ?? ""), y: parseInt(coords[3] ?? "") }
    };
    sensor.manhattanDistance = calcManhattanDistance(sensor);
    // console.log(sensor);

    if (sensor.nearestBeacon.y === part1Query) {
      beaconsAtQuery.add(sensor.nearestBeacon.x);
    }

    return sensor;
  });

  // Part 1
  const mergedBlocks = findBlockedXRange(sensors, part1Query);

  // account for beacons within ranges
  Array.from(beaconsAtQuery.keys()).forEach(beaconX => {
    if (mergedBlocks.some(block => beaconX >= block.leftCoord && beaconX <= block.rightCoord))
      result[0] -= 1;
  });

  // console.log("Merged Blocks");
  mergedBlocks.forEach(block => {
    // console.log(block);
    result[0] += block.rightCoord - block.leftCoord + 1;
  });

  // Part 2
  for (let i = 0; i <= part2Query; i++) {
    const blocks = findBlockedXRange(sensors, i);
    if (blocks[0] && blocks[0].rightCoord <= part2Query) {
      console.log(`Found beacon position at (${blocks[0].rightCoord + 1}, ${i})`);
      result[1] = (blocks[0].rightCoord + 1) * 4000000 + i;
      break;
    }
  }
  
  return result;
}

const day15TestData =
  `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

function day15Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [26, 56000011];
  const answer = runDay15Logic(day15TestData, 10, 20);
  
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

function day15() {
  const input = readFileSync("./input15.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay15Logic(input.trimEnd(), 2000000, 4000000));
}

day15Test() && day15();
