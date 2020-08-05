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
function primes(isPrime: i32[], n: i32): i32 {
  let i: i32 = 0;
  let count: i32 = 0;
  let m: i32 = 10000 << n;
  let size: i32 = (m + 31) >> 5;
  for (i = 0; i < size; i++) {
    isPrime[i] = 0xfffffff;
  }
  for (i = 2; i < m; i++) {
    if (isPrime[i >> 5] & (1 << (i & 31))) {
      for (let j: i32 = i + i; j < m; j += i) {
        isPrime[j >> 5] &= ~(1 << (j & 31));
      }
      count++;
    }
  }
  return count;
}
export function main(): i32 {
  let sum: i32 = 0;
  let retVal: i32 = 0;
  for (let i: i32 = 4; i <= 4; i++) {
    let isPrime: i32[] = new Array(((10000 << i) + 31) >> 5);
    sum += (function (arg0: i32[], arg1: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32[]>(), sizeof<i32>()]);
      args.setArgument<i32[]>(0, Types.classInstance, arg0, idof<i32[]>());
      args.setArgument<i32>(1, Types.i32, arg1, 0);
      return apply2Args<i32, i32[], i32>(
        "primes",
        changetype<usize>(primes),
        args
      );
    })(isPrime, i);
    retVal += isPrime[i];
  }
  return sum; // returns 13000 something
}
