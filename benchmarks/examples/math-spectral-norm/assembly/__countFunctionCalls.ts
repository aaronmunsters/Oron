import { OronAnalysis } from "../dependancies/analysis/analysis";
import {
  ArgsBuffer,
  Types,
} from "../dependancies/analysis/analysisDependancies";

const calls: Map<string, number> = new Map();

export function getRes(target: string): number {
  return calls.has(target) ? calls.get(target) : -1;
}

export class MyAnalysis extends OronAnalysis {
  genericApply(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32
  ): void {
    calls.set(fname, (calls.has(fname) ? calls.get(fname) : 0) + 1);
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
            t += apply2Args<f64, i32, i32>("A", changetype<usize>(A), i, Types.i32, 0, j, Types.i32, 0) * u[j];
        v[i] = t;
    }
    return 1;
}
function AtAu(u: f64[], v: f64[], n: i32): i32 {
    for (let i: i32 = 0; i < n; ++i) {
        let t: f64 = 0.0;
        for (let j: i32 = 0; j < n; ++j)
            t += apply2Args<f64, i32, i32>("A", changetype<usize>(A), j, Types.i32, 0, i, Types.i32, 0) * u[j];
        v[i] = t;
    }
    return 1;
}
export function main(): i32 {
    let sum: i32 = 0;
    for (let i: i32 = 6; i <= 48; i *= 2) {
        sum = sum + (apply1Args<f64, i32>("spectralnorm", changetype<usize>(spectralnorm), i, Types.i32, 0) as i32);
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
        apply3Args<i32, f64[], f64[], i32>("Au", changetype<usize>(Au), v, Types.classInstance, idof<f64[]>(), u, Types.classInstance, idof<f64[]>(), n, Types.i32, 0);
        apply3Args<i32, f64[], f64[], i32>("AtAu", changetype<usize>(AtAu), v, Types.classInstance, idof<f64[]>(), u, Types.classInstance, idof<f64[]>(), n, Types.i32, 0);
    }
    for (i = 0; i < n; ++i) {
        vBv += u[i] * v[i];
        vv += v[i] * v[i];
    }
    return sqrt<f64>(vBv / vv);
}
