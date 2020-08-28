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

  genericApply(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32
  ): void {
    increase(calls, fname);
  }
}

const myAnalysis = new MyAnalysis();
 const globalBuffer = new ArgsBuffer(3, 48);

function apply2Args<RetType,In0,In1>(
  fname: string,
  fptr: usize,
  arg0: In0, typ0: Types, classId0: u32,arg1: In1, typ1: Types, classId1: u32
): RetType {
  
      globalBuffer.setArgument<In0>(0, typ0, arg0, classId0);
globalBuffer.setArgument<In1>(1, typ1, arg1, classId1);
      myAnalysis.genericApply(fname, fptr, globalBuffer, 2);
      
  
  const func: (in0: In0,in1: In1) => RetType = changetype<(in0: In0,in1: In1)=> RetType>(fptr);
  const res: RetType = func(arg0,arg1);
  return res
  
}


function apply1Args<RetType,In0>(
  fname: string,
  fptr: usize,
  arg0: In0, typ0: Types, classId0: u32
): RetType {
  
      globalBuffer.setArgument<In0>(0, typ0, arg0, classId0);
      myAnalysis.genericApply(fname, fptr, globalBuffer, 1);
      
  
  const func: (in0: In0) => RetType = changetype<(in0: In0)=> RetType>(fptr);
  const res: RetType = func(arg0);
  return res
  
}


function apply3Args<RetType,In0,In1,In2>(
  fname: string,
  fptr: usize,
  arg0: In0, typ0: Types, classId0: u32,arg1: In1, typ1: Types, classId1: u32,arg2: In2, typ2: Types, classId2: u32
): RetType {
  
      globalBuffer.setArgument<In0>(0, typ0, arg0, classId0);
globalBuffer.setArgument<In1>(1, typ1, arg1, classId1);
globalBuffer.setArgument<In2>(2, typ2, arg2, classId2);
      myAnalysis.genericApply(fname, fptr, globalBuffer, 3);
      
  
  const func: (in0: In0,in1: In1,in2: In2) => RetType = changetype<(in0: In0,in1: In1,in2: In2)=> RetType>(fptr);
  const res: RetType = func(arg0,arg1,arg2);
  return res
  
}
// The Computer Language Shootout
// http://shootout.alioth.debian.org/
// contributed by Isaac Gouy
function ack(m: i32, n: i32): i32 {
    if (m == 0) {
        return n + 1;
    }
    if (n == 0) {
        return apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), m - 1, Types.i32, 0, 1, Types.i32, 0);
    }
    return apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), m - 1, Types.i32, 0, apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), m, Types.i32, 0, n - 1, Types.i32, 0), Types.i32, 0);
}
function fib(n: i32): i32 {
    if (n < 2) {
        return 1;
    }
    return apply1Args<i32, i32>("fib", changetype<usize>(fib), n - 2, Types.i32, 0) + apply1Args<i32, i32>("fib", changetype<usize>(fib), n - 1, Types.i32, 0);
}
function tak(x: i32, y: i32, z: i32): i32 {
    if (y >= x) {
        return z;
    }
    return apply3Args<i32, i32, i32, i32>("tak", changetype<usize>(tak), apply3Args<i32, i32, i32, i32>("tak", changetype<usize>(tak), x - 1, Types.i32, 0, y, Types.i32, 0, z, Types.i32, 0), Types.i32, 0, apply3Args<i32, i32, i32, i32>("tak", changetype<usize>(tak), y - 1, Types.i32, 0, z, Types.i32, 0, x, Types.i32, 0), Types.i32, 0, apply3Args<i32, i32, i32, i32>("tak", changetype<usize>(tak), z - 1, Types.i32, 0, x, Types.i32, 0, y, Types.i32, 0), Types.i32, 0);
}
export function main(): i32 {
    let a: i32 = 0;
    let b: i32 = 0;
    let c: i32 = 0;
    for (let i: i32 = 3; i <= 5; i++) {
        a = a + apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), 3, Types.i32, 0, i, Types.i32, 0);
        b = b + apply1Args<i32, i32>("fib", changetype<usize>(fib), 17 + i, Types.i32, 0);
        c = c + apply3Args<i32, i32, i32, i32>("tak", changetype<usize>(tak), 3 * i + 3, Types.i32, 0, 2 * i + 2, Types.i32, 0, i + 1, Types.i32, 0);
    }
    return a + b + c;
}
