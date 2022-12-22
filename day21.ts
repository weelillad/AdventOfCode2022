import assert from "node:assert";
import { readFileSync } from "node:fs";

function runDay21Logic(input: string): [number, number] {
  const result: [number, number] = [0, 0];

  const monkeys: Map<string, number> = new Map();
  const monkeyLines = input.split("\n").map(line => line.split(": "));

  // console.log(monkeyLines);

  while (monkeyLines.length > 0) {
    const [name, equation] = monkeyLines.shift()!;
    // console.log(`Parsing ${name}: ${equation}`);
    if (!isNaN(+equation)) {
      // console.log(`Setting ${name} to ${parseInt(equation)}`);
      monkeys.set(name, parseInt(equation));
    } else {
      const [op1, operator, op2] = equation.split(" ");
      // console.log(`${op1} ${operator} ${op2}`);
      if (!monkeys.has(op1) || !monkeys.has(op2)) {
        monkeyLines.push([name, equation]);
        continue;
      }
      switch (operator) {
        case "+":
          monkeys.set(name, monkeys.get(op1)! + monkeys.get(op2)!);
          break;
        case "-":
          monkeys.set(name, monkeys.get(op1)! - monkeys.get(op2)!);
          break;
        case "*":
          monkeys.set(name, monkeys.get(op1)! * monkeys.get(op2)!);
          break;
        case "/":
          monkeys.set(name, monkeys.get(op1)! / monkeys.get(op2)!);
          break;
      }
    }
  }

  // console.log(monkeys);

  result[0] = monkeys.get("root") ?? 0;

  return result;
}

const day21TestData =
  `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

function day21Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [152, 301];
  const answer = runDay21Logic(day21TestData);
  
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

function day21() {
  const input = readFileSync("./input21.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay21Logic(input.trimEnd()));
}

day21Test() && day21();
