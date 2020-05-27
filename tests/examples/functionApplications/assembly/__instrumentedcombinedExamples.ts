import { OronAnalysis } from "../orondefaults/dependancies/analysis";

import {
  Types,
  dynamicPropertyRead,
  dynamicPropertyWrite,
  ArgsBuffer,
} from "../orondefaults/dependancies/analysisDependancies";

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

function apply2Args<RetType,In0,In1>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0,in1: In1) => RetType = changetype<(in0: In0,in1: In1)=> RetType>(fptr);
  return func(argsBuff.getArgument<In0>(0),argsBuff.getArgument<In1>(1))
}


function apply2ArgsVoid<In0,In1>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): void {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0,in1: In1) => void = changetype<(in0: In0,in1: In1)=> void>(fptr);
  func(argsBuff.getArgument<In0>(0),argsBuff.getArgument<In1>(1))
}
function ackermann(m: number, n: number): number {
    if (m == 0) {
        return n + 1;
    }
    else if (n == 0) {
        return function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m - 1, 1);
    }
    else {
        return function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m - 1, function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m, n - 1));
    }
}
export function main(): number {
    let sum: number = 0;
    for (let n = 0; n < 5; n++) {
        for (let m = 0; m < 4; m++) {
            sum += function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m, n);
        }
    }
    return sum;
}
