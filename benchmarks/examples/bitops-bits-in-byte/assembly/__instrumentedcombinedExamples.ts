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

function apply1Args<RetType,In0>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0) => RetType = changetype<(in0: In0)=> RetType>(fptr);
  return func(argsBuff.getArgument<In0>(0))
}


function apply1ArgsVoid<In0>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): void {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0) => void = changetype<(in0: In0)=> void>(fptr);
  func(argsBuff.getArgument<In0>(0))
}
function bitsinbyte(b: i32): i32 {
    let m: i32 = 1, c = 0;
    while (m < 0x100) {
        if (b & m)
            c++;
        m <<= 1;
    }
    return c;
}
export function main(): i32 {
    let x: i32, y: i32, t: i32;
    let sum: i32 = 0;
    for (let x: i32 = 0; x < 350; x++) {
        for (let y: i32 = 0; y < 256; y++) {
            sum += function (arg0: i32): i32 { var args = new ArgsBuffer([sizeof<i32>()]); args.setArgument<i32>(0, Types.i32, arg0, 0); return apply1Args<i32, i32>("bitsinbyte", changetype<usize>(bitsinbyte), args); }(y);
        }
    }
    return sum;
}
