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
function ackermann(m: number, n: number): number {
    if (m == 0) {
        return n + 1;
    }
    else if (n == 0) {
        return function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m - 1, 1);
    }
    else {
        return function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m - 1, function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m, n - 1));
    }
}
export function main(): number {
    let sum: number = 0;
    for (let n = 0; n < 5; n++) {
        for (let m = 0; m < 4; m++) {
            sum += function (arg0: number, arg1: number): number { var args = new ArgsBuffer([sizeof<number>(), sizeof<number>()]); args.setArgument<number>(0, Types.number, arg0, 0); args.setArgument<number>(1, Types.number, arg1, 0); return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), args); }(m, n);
        }
    }
    return sum;
}
