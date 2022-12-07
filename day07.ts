import { readFileSync } from "node:fs";

type Directory = {
  path: string;
  size: number;
  list: Array<string>;
}

function runDay7Logic(input: string): [number, number] {
  const lines = input.split("\n");
  const result: [number, number] = [0, 0];

  let currPath = "/";
  function updateCurrPath(cmd: string) {
    const frags = cmd.split(" ");
    if (frags[1] !== "cd" || frags[2] == "/") return;

    if (frags[2] == "..") {
      currPath = currPath.substring(0, currPath.lastIndexOf("/"));
    } else {
      currPath += currPath === "/" ? frags[2] : `/${frags[2]}`;
      frags[2] = currPath;
    }
  }

  const directoryMap: Map<string, Directory> = new Map();
  let lsOutput: Array<string> = [];
  for (const line of lines) {
    if (line.charAt(0) === "$") {
      if (lsOutput.length > 0) {
        // Previous `ls` command is done, save the output into the directory map
        directoryMap.set(currPath, { path: currPath, list: lsOutput, size: -1 });
        lsOutput = [];
      }
      updateCurrPath(line);
      // console.log(currPath);
    } else {
      // `ls` is the only command with output lines
      lsOutput.push(line);
    }
  }
  // finally
  lsOutput.length > 0 && directoryMap.set(currPath, { path: currPath, list: lsOutput, size: -1 });
  
  // for (const dir of directoryMap.values()) console.log(`${dir.path} - ${dir.list}`);

  function getDirSizeFromLs(dir: Directory): number {
    let sizeSum = 0;

    for (const line of dir.list) {
      const fragments = line.split(" ");
      const path = `${dir.path === "/" ? "" : dir.path}/${fragments[1]}`;
      switch (fragments[0]) {
        case "dir":
          if (!directoryMap.has(path) || (directoryMap.get(path)?.size ?? -1) <= 0) throw Error(`Cannot get size of ${path}`);
          sizeSum += directoryMap.get(path)?.size ?? 0;
          break;
        default:
          sizeSum += parseInt(fragments[0]);
          break;
      }
    }

    return sizeSum;
  }

  const dirSortedArrayPart1 = Array.from(directoryMap.values()).sort((a, b) => (b.path.match(/\//g)?.length || 0) - (a.path.match(/\//g)?.length || 0) || b.path.length - a.path.length);
  for (const dir of dirSortedArrayPart1) {
    dir.size = getDirSizeFromLs(dir);
    if (dir.size <= 100000) {
      result[0] += dir.size;
    }
  }

  // for (const dir of directoryMap.values()) console.log(`${dir.path} - ${dir.size}`);

  // Part 2
  const dirSortedArrayPart2 = Array.from(directoryMap.values()).sort((a, b) => a.size - b.size);
  const requiredFreeSpace = 30000000 - (70000000 - (directoryMap.get("/")?.size || 0));
  // console.log(requiredFreeSpace);
  let i = 0;
  while (i < dirSortedArrayPart2.length && dirSortedArrayPart2[i].size < requiredFreeSpace) i++;
  result[1] = dirSortedArrayPart2[i].size;

  return result;
}

const day7TestData =
  `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

function day7Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [95437, 24933642];

  const answer = runDay7Logic(day7TestData);
  
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

function day7() {
  const input = readFileSync("./input07.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay7Logic(input.trimEnd()));
}

day7Test() && day7();
