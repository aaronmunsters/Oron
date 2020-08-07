import { OronAnalysis } from "../dependancies/analysis/analysis";

import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
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

  genericApply(fname: string, fptr: usize): void {
    increase(calls, fname);
  }
}

const myAnalysis = new MyAnalysis();

function apply2Args<RetType,In0,In1>(
  fname: string,
  fptr: usize,
  in0: In0,in1: In1
): RetType {
  myAnalysis.genericApply(fname, fptr);
  
  const func: (in0: In0,in1: In1) => RetType = changetype<(in0: In0,in1: In1)=> RetType>(fptr);
  const res: RetType = func(in0,in1);
  return res
  
}
function ackermann(m: number, n: number): number {
    if (m == 0) {
        return n + 1;
    }
    else if (n == 0) {
        return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m - 1, 1);
    }
    else {
        return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m - 1, apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m, n - 1));
    }
}
export function main(): number {
    let sum: number = 0;
    for (let n = 0; n < 5; n++) {
        for (let m = 0; m < 4; m++) {
            sum += apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m, n);
        }
    }
    return sum;
}
