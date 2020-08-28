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
        sum += apply2Args<i32, i32[], i32>("primes", changetype<usize>(primes), isPrime, Types.classInstance, idof<i32[]>(), i, Types.i32, 0);
        retVal += isPrime[i];
    }
    return sum; // returns 13000 something
}
