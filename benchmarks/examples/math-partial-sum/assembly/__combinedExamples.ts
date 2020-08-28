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
 const globalBuffer = new ArgsBuffer(2, 32);

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


function apply1ArgsVoid<In0>(
  fname: string,
  fptr: usize,
  arg0: In0, typ0: Types, classId0: u32
): void {
  
      globalBuffer.setArgument<In0>(0, typ0, arg0, classId0);
      myAnalysis.genericApply(fname, fptr, globalBuffer, 1);
      
  const func: (in0: In0) => void = changetype<(in0: In0)=> void>(fptr);
  func(arg0)
  null
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
        a1 += apply2Args<f64, f64, f64>("pow", changetype<usize>(pow), twothirds, Types.f64, 0, k - 1, Types.f64, 0);
        a2 += apply2Args<f64, f64, f64>("pow", changetype<usize>(pow), k, Types.f64, 0, -0.5, Types.f64, 0);
        a3 += 1.0 / (k * (k + 1.0));
        a6 += 1.0 / k;
        a7 += 1.0 / k2;
        a8 += alt / k;
        a9 += alt / (2 * k - 1);
    }
}
export function main(): void {
    for (let i: f64 = 1024; i <= 16384; i *= 2) {
        apply1ArgsVoid<f64>("partial", changetype<usize>(partial), i, Types.f64, 0);
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
