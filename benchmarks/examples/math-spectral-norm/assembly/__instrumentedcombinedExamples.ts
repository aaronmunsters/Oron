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


function apply3Args<RetType,In0,In1,In2>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0,in1: In1,in2: In2) => RetType = changetype<(in0: In0,in1: In1,in2: In2)=> RetType>(fptr);
  return func(argsBuff.getArgument<In0>(0),argsBuff.getArgument<In1>(1),argsBuff.getArgument<In2>(2))
}


function apply3ArgsVoid<In0,In1,In2>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): void {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0,in1: In1,in2: In2) => void = changetype<(in0: In0,in1: In1,in2: In2)=> void>(fptr);
  func(argsBuff.getArgument<In0>(0),argsBuff.getArgument<In1>(1),argsBuff.getArgument<In2>(2))
}
// Edit here and press "Compile"
function A(i: i32, j: i32): f64 {
    let i2: f64 = i * 1.0;
    let j2: f64 = j * 1.0;
    return 1 / (((i2 + j2) * (i2 + j2 + 1)) / 2 + i2 + 1);
}
function Au(u: f64[], v: f64[], n: i32): i32 {
    for (let i: i32 = 0; i < n; ++i) {
        let t: f64 = 0.0;
        for (let j: i32 = 0; j < n; ++j)
            t += function (arg0: i32, arg1: i32): f64 { var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>()]); args.setArgument<i32>(0, Types.i32, arg0, 0); args.setArgument<i32>(1, Types.i32, arg1, 0); return apply2Args<f64, i32, i32>("A", changetype<usize>(A), args); }(i, j) * u[j];
        v[i] = t;
    }
    return 1;
}
function AtAu(u: f64[], v: f64[], n: i32): i32 {
    for (let i: i32 = 0; i < n; ++i) {
        let t: f64 = 0.0;
        for (let j: i32 = 0; j < n; ++j)
            t += function (arg0: i32, arg1: i32): f64 { var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>()]); args.setArgument<i32>(0, Types.i32, arg0, 0); args.setArgument<i32>(1, Types.i32, arg1, 0); return apply2Args<f64, i32, i32>("A", changetype<usize>(A), args); }(j, i) * u[j];
        v[i] = t;
    }
    return 1;
}
export function main(): i32 {
    let sum: i32 = 0;
    for (let i: i32 = 6; i <= 48; i *= 2) {
        sum = sum + (function (arg0: i32): f64 { var args = new ArgsBuffer([sizeof<i32>()]); args.setArgument<i32>(0, Types.i32, arg0, 0); return apply1Args<f64, i32>("spectralnorm", changetype<usize>(spectralnorm), args); }(i) as i32);
    }
    return sum; //returns 0;
}
function spectralnorm(n: i32): f64 {
    let i: i32, u: f64[] = new Array(n), v: f64[] = new Array(n), vv: f64 = 0, vBv: f64 = 0;
    for (i = 0; i < n; ++i) {
        u[i] = 1;
        v[i] = i;
    }
    for (i = 0; i < 10; ++i) {
        (function (arg0: f64[], arg1: f64[], arg2: i32): i32 { var args = new ArgsBuffer([sizeof<f64[]>(), sizeof<f64[]>(), sizeof<i32>()]); args.setArgument<f64[]>(0, Types.classInstance, arg0, idof<f64[]>()); args.setArgument<f64[]>(1, Types.classInstance, arg1, idof<f64[]>()); args.setArgument<i32>(2, Types.i32, arg2, 0); return apply3Args<i32, f64[], f64[], i32>("Au", changetype<usize>(Au), args); })(v, u, n);
        (function (arg0: f64[], arg1: f64[], arg2: i32): i32 { var args = new ArgsBuffer([sizeof<f64[]>(), sizeof<f64[]>(), sizeof<i32>()]); args.setArgument<f64[]>(0, Types.classInstance, arg0, idof<f64[]>()); args.setArgument<f64[]>(1, Types.classInstance, arg1, idof<f64[]>()); args.setArgument<i32>(2, Types.i32, arg2, 0); return apply3Args<i32, f64[], f64[], i32>("AtAu", changetype<usize>(AtAu), args); })(v, u, n);
    }
    for (i = 0; i < n; ++i) {
        vBv += u[i] * v[i];
        vv += v[i] * v[i];
    }
    return sqrt<f64>(vBv / vv);
}
