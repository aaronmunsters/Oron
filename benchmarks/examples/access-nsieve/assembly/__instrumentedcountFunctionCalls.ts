import { OronAnalysis } from "../orondefaults/dependancies/analysis";
import {
  ArgsBuffer,
  Types,
} from "../orondefaults/dependancies/analysisDependancies";

const calls: Map<string, number> = new Map();

export function getRes(target: string): number {
  return calls.has(target) ? calls.get(target) : -1;
}

export class MyAnalysis extends OronAnalysis {
  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    calls.set(fname, (calls.has(fname) ? calls.get(fname) : 0) + 1);
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
        sum = sum + function (arg0: i32, arg1: i32[]): i32 { var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32[]>()]); args.setArgument<i32>(0, Types.i32, arg0, 0); args.setArgument<i32[]>(1, Types.classInstance, arg1, idof<i32[]>()); return apply2Args<i32, i32, i32[]>("nsieve", changetype<usize>(nsieve), args); }(m, flags);
    }
    return sum; //returns 263
}
