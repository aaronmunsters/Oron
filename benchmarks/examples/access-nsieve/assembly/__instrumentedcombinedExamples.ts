import { OronAnalysis } from "../dependancies/analysis/analysis";

import {
  Types,
  dynamicPropertyRead,
  dynamicPropertyWrite,
  ArgsBuffer,
} from "../dependancies/analysis/analysisDependancies";

const reads: Map<string, number> = new Map();
const sets: Map<string, number> = new Map();
const calls: Map<string, number> = new Map();

function increase(countStructure: Map<string, number>, target: string): void {
  countStructure.set(
    target,
    countStructure.has(target) ? countStructure.get(target) + 1 : 1
  );
}

function getForRes(target: string, map: Map<string, number>): number {
  return map.has(target) ? map.get(target) : -1;
}

export function getRes(struct: string, target: string): number {
  if (struct == "reads") {
    return getForRes(target, reads);
  } else if (struct == "sets") {
    return getForRes(target, sets);
  } else if (struct == "calls") {
    return getForRes(target, calls);
  }
  return -2;
}

export class MyAnalysis extends OronAnalysis {
  propertyAccess<ClassInstance, ReturnValue>(
    classInstance: ClassInstance,
    key: string,
    offset: usize
  ): ReturnValue {
    increase(reads, key);
    return dynamicPropertyRead<ClassInstance, ReturnValue>(
      classInstance,
      offset
    );
  }

  propertySet<ClassInstance, Value>(
    classInstance: ClassInstance,
    value: Value,
    key: string,
    offset: usize
  ): void {
    increase(sets, key);
    dynamicPropertyWrite<ClassInstance, Value>(classInstance, value, offset);
  }

  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    increase(calls, fname);
  }
}

const myAnalysis = new MyAnalysis();

function apply2Args<RetType, In0, In1>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0, in1: In1) => RetType = changetype<
    (in0: In0, in1: In1) => RetType
  >(fptr);
  return func(argsBuff.getArgument<In0>(0), argsBuff.getArgument<In1>(1));
}
function nsieve(m: i32, isPrime: i32[]): i32 {
  let i: i32;
  let k: i32;
  let count: i32;
  for (i = 2; i <= m; i++) {
    isPrime[i] = 1; //changed from boolean to i32
  }
  count = 0;
  for (i = 2; i <= m; i++) {
    if (isPrime[i]) {
      for (k = i + i; k <= m; k += i) {
        isPrime[k] = 0;
      }
      count++;
    }
  }
  return count;
}
export function main(): i32 {
  let sum: i32 = 0;
  for (let i: i32 = 1; i <= 3; i++) {
    let m: i32 = (1 << i) * 100;
    let flags: i32[] = new Array(m + 1);
    sum =
      sum +
      (function (arg0: i32, arg1: i32[]): i32 {
        var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32[]>()]);
        args.setArgument<i32>(0, Types.i32, arg0, 0);
        args.setArgument<i32[]>(1, Types.classInstance, arg1, idof<i32[]>());
        return apply2Args<i32, i32, i32[]>(
          "nsieve",
          changetype<usize>(nsieve),
          args
        );
      })(m, flags);
  }
  return sum; //returns 263
}
