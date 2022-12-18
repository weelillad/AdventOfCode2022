type Monkey = {
  id: number;
  items: Array<number>;
  operation: (item: number) => number;
  test: (item: number) => number;
  inspectCount: number;
};

function runDay11Logic(input: Array<Monkey>, monkeyLcm: number): [number, number] {
  const result: [number, number] = [0, 0];

  // Part 1
  // deep copy Monkey array
  const monkeys = input.map(monkey => {
    return {
      ...monkey,
      items: Array.from(monkey.items)
    }
  })
  const doMonkeyPart1 = (monkey: Monkey) => {
    const currItems = Array.from(monkey.items);
    monkey.items = [];
    currItems.forEach(item => {
      monkey.inspectCount++;
      item = Math.floor(monkey.operation(item) / 3);
      const nextMonkey = monkey.test(item);
      monkeys[nextMonkey].items.push(item);
    });
  }
  
  for (let i = 0; i < 20; i++) {
    // console.log(`Round ${i}`);
    monkeys.forEach(monkey => doMonkeyPart1(monkey));
    // monkeys.forEach(monkey => console.log(monkey.items));
  }
  let sortedInspectCounts = monkeys.map(monkey => monkey.inspectCount).sort((a, b) => b - a);
  // console.log(sortedInspectCounts);
  result[0] = sortedInspectCounts[0] * sortedInspectCounts[1];

  // Part 2
  const doMonkeyPart2 = (monkey: Monkey) => {
    const currItems = Array.from(monkey.items);
    monkey.items = [];
    currItems.forEach(item => {
      monkey.inspectCount++;
      item = monkey.operation(item) % monkeyLcm;
      const nextMonkey = monkey.test(item);
      input[nextMonkey].items.push(item);
    });
  }

  input.forEach(monkey => monkey.inspectCount = 0);

  for (let i = 0; i < 10000; i++) {
    // (i === 0 || i % 1000 === 999) && console.log(`Round ${i + 1}`);
    input.forEach(monkey => doMonkeyPart2(monkey));
    // (i === 0 || i % 1000 === 999) && console.log(input.map(monkey => monkey.inspectCount));
  }
  sortedInspectCounts = input.map(monkey => monkey.inspectCount).sort((a, b) => b - a);
  // console.log(sortedInspectCounts);
  result[1] = sortedInspectCounts[0] * sortedInspectCounts[1];
  
  return result;
}

const day11TestData: Array<Monkey> = [
  {
    id: 0,
    items: [79, 98],
    operation: item => item * 19,
    test: item => item % 23 === 0
      ? 2
      : 3,
    inspectCount: 0
  },
  {
    id: 1,
    items: [54, 65, 75, 74],
    operation: item => item + 6,
    test: item => item % 19 === 0
      ? 2
      : 0,
    inspectCount: 0
  },
  {
    id: 2,
    items: [79, 60, 97],
    operation: item => item * item,
    test: item => item % 13 === 0
      ? 1
      : 3,
    inspectCount: 0
  },
  {
    id: 3,
    items: [74],
    operation: item => item + 3,
    test: item => item % 17 === 0
      ? 0
      : 1,
    inspectCount: 0
  },
];

function day11Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [10605, 2713310158];
  const answer = runDay11Logic(day11TestData, 96577);
  
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

const day11Input: Array<Monkey> = [
  {
    id: 0,
    items: [65, 78],
    operation: item => item * 3,
    test: item => item % 5 === 0
      ? 2
      : 3,
    inspectCount: 0
  },
  {
    id: 1,
    items: [54, 78, 86, 79, 73, 64, 85, 88],
    operation: item => item + 8,
    test: item => item % 11 === 0
      ? 4
      : 7,
    inspectCount: 0
  },
  {
    id: 2,
    items: [69, 97, 77, 88, 87],
    operation: item => item + 2,
    test: item => item % 2 === 0
      ? 5
      : 3,
    inspectCount: 0
  },
  {
    id: 3,
    items: [99],
    operation: item => item + 4,
    test: item => item % 13 === 0
      ? 1
      : 5,
    inspectCount: 0
  },
  {
    id: 4,
    items: [60, 57, 52],
    operation: item => item * 19,
    test: item => item % 7 === 0
      ? 7
      : 6,
    inspectCount: 0
  },
  {
    id: 5,
    items: [91, 82, 85, 73, 84, 53],
    operation: item => item + 5,
    test: item => item % 3 === 0
      ? 4
      : 1,
    inspectCount: 0
  },
  {
    id: 6,
    items: [88, 74, 68, 56],
    operation: item => item * item,
    test: item => item % 17 === 0
      ? 0
      : 2,
    inspectCount: 0
  },
  {
    id: 7,
    items: [54, 82, 72, 71, 53, 99, 67],
    operation: item => item + 1,
    test: item => item % 19 === 0
      ? 6
      : 0,
    inspectCount: 0
  }
];

function day11() {

  console.log("\nACTUAL\n");

  console.log(runDay11Logic(day11Input, 9699690));
}

day11Test() && day11();
