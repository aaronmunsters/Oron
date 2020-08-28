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
        sum = sum + apply2Args<i32, i32, i32[]>("nsieve", changetype<usize>(nsieve), m, Types.i32, 0, flags, Types.classInstance, idof<i32[]>());
    }
    return sum; //returns 263
}
