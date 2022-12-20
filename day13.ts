import assert from "node:assert";
import { readFileSync } from "node:fs";

type Pair = {
  left: Array<Element>;
  right: Array<Element>;
}

type Element = Array<Element> | number;

function elementsToString(elements: Array<Element>): string {
  let result = "[";

  for (const element of elements) {
    if (Array.isArray(element)) result += elementsToString(element);
    else result += element.toString();
    result += ",";
  }

  if (result.at(-1) === ",")
    result = result.substring(0, result.length - 1);
  return result + "]";
}

function parseListString(input: string): [Array<Element>, number] {
  assert(input[0] === "[", "Not a list!");
  // console.log(input);

  const items: Array<Element> = [];
  let pointer = 0;
  while (pointer < (input.length - 1) && input[pointer] !== "]") {
    pointer++;
    if (input.at(pointer) === "[") {
      const [element, elementCharLength] = parseListString(input.substring(pointer));
      items.push(element);
      pointer += elementCharLength + 1;
    } else {
      const match = input.substring(pointer).match(/^\d+/);
      match && items.push(parseInt(match[0]));

      pointer += match ? match[0].length : 0;
    }
  }
  return [items, pointer];
}

// -1 if not right order, 1 if right order, 0 if indetermined
function isRightOrder({ left, right }: Pair): number {
  // console.log(`Comparing lists ${left} to ${right}`);

  for (let i = 0; i < left.length; i++) {
    // console.log(`Comparing item ${i}: ${left[i]} to ${right[i]}`);

    // exception case: RHS has run out of items
    if (i >= right.length) return -1;

    if (Array.isArray(left[i])) {
      const rightItem = Array.isArray(right[i])
        ? right[i]
        : [right[i]];
      const compResult = isRightOrder({ left: left[i] as Array<Element>, right: rightItem as Array<Element> })
      if (compResult !== 0) return compResult;
    } else if (Array.isArray(right[i])) {
      const compResult = isRightOrder({ left: [left[i]], right: right[i] as Array<Element> })
      if (compResult !== 0) return compResult;
    } else {
      if (left[i] > right[i]) return -1;
      else if (left[i] < right[i]) return 1;
    }
  }
  return left.length < right.length ? 1 : 0;
}

function runDay13Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];

  const pairs: Array<Pair> = input.split("\n\n").map(strPair => {
    const [left, right] = strPair.split("\n");
    return { left: parseListString(left)[0], right: parseListString(right)[0] };
  });

  // pairs.forEach(p => console.log(`${elementsToString(p.left)} ${elementsToString(p.right)}`));
  console.log(`${elementsToString(pairs[0].left)} ${elementsToString(pairs[0].right)}`);

  pairs.forEach((pair, index) => {
    // console.log(index + 1);
    if (isRightOrder(pair) > 0) {
      result[0] += (index + 1);
      // console.log("true");
    } else {
      // console.log("false");
    }
  });

  const packets = pairs.flatMap(v => [v.left, v.right]);
  packets.push([[2]], [[6]]);

  // packets.forEach(p => console.log(p));

  packets.sort((a, b) => -isRightOrder({ left: a, right: b }));

  // packets.forEach(p => console.log(p));

  result[1] = (packets.findIndex(v => Array.isArray(v) && v.length === 1 && Array.isArray(v[0]) && v[0].length === 1 && v[0][0] === 2) + 1) *
    (packets.findIndex(v => Array.isArray(v) && v.length === 1 && Array.isArray(v[0]) && v[0].length === 1 && v[0][0] === 6) + 1);

  return result;
}

const day13TestData = 
  `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

function day13Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [13, 140];
  const answer = runDay13Logic(day13TestData);
  
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

function day13() {
  const input = readFileSync("./input13.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay13Logic(input.trimEnd()));
}

day13Test() && day13();
