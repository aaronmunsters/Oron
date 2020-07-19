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


function apply2ArgsVoid<In0,In1>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): void {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0,in1: In1) => void = changetype<(in0: In0,in1: In1)=> void>(fptr);
  func(argsBuff.getArgument<In0>(0),argsBuff.getArgument<In1>(1))
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
        sum += function (arg0: i32[], arg1: i32): i32 { var args = new ArgsBuffer([sizeof<i32[]>(), sizeof<i32>()]); args.setArgument<i32[]>(0, Types.classInstance, arg0, idof<i32[]>()); args.setArgument<i32>(1, Types.i32, arg1, 0); return apply2Args<i32, i32[], i32>("primes", changetype<usize>(primes), args); }(isPrime, i);
        retVal += isPrime[i];
    }
    return sum; // returns 13000 something
}
