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
function partial(n: f64): void {
    let a1: f64, a2: f64, a3: f64, a4: f64, a5: f64, a6: f64, a7: f64, a8: f64, a9: f64 = 0.0;
    let twothirds: f64 = 2.0 / 3.0;
    let alt: f64 = -1.0;
    let k2: f64, k3: f64, sk: f64, ck: f64 = 0.0;
    for (let k: f64 = 1; k <= n; k++) {
        k2 = k * k;
        k3 = k2 * k;
        alt = -alt;
        a1 += function (arg0: f64, arg1: f64): f64 { var args = new ArgsBuffer([sizeof<f64>(), sizeof<f64>()]); args.setArgument<f64>(0, Types.f64, arg0, 0); args.setArgument<f64>(1, Types.f64, arg1, 0); return apply2Args<f64, f64, f64>("pow", changetype<usize>(pow), args); }(twothirds, k - 1);
        a2 += function (arg0: f64, arg1: f64): f64 { var args = new ArgsBuffer([sizeof<f64>(), sizeof<f64>()]); args.setArgument<f64>(0, Types.f64, arg0, 0); args.setArgument<f64>(1, Types.f64, arg1, 0); return apply2Args<f64, f64, f64>("pow", changetype<usize>(pow), args); }(k, -0.5);
        a3 += 1.0 / (k * (k + 1.0));
        a6 += 1.0 / k;
        a7 += 1.0 / k2;
        a8 += alt / k;
        a9 += alt / (2 * k - 1);
    }
}
export function main(): void {
    for (let i: f64 = 1024; i <= 16384; i *= 2) {
        (function (arg0: f64): void { var args = new ArgsBuffer([sizeof<f64>()]); args.setArgument<f64>(0, Types.f64, arg0, 0); apply1ArgsVoid<f64>("partial", changetype<usize>(partial), args) })(i);
    }
}
function pow(val1: f64, var2: f64): f64 {
    let ans: f64 = 1;
    while (var2 > 0) {
        ans = ans * val1;
        var2--;
    }
    return ans;
}