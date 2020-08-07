import { OronAnalysis } from "../dependancies/analysis/analysis";

const calls: Map<string, number> = new Map();

export function getRes(target: string): number {
  return calls.has(target) ? calls.get(target) : -1;
}

export class MyAnalysis extends OronAnalysis {
  genericApply(fname: string, fptr: usize): void {
    calls.set(fname, (calls.has(fname) ? calls.get(fname) : 0) + 1);
  }
}

const myAnalysis = new MyAnalysis();

function apply2Args<RetType,In0,In1>(
  fname: string,
  fptr: usize,
  in0: In0,in1: In1
): RetType {
  myAnalysis.genericApply(fname, fptr);
  
  const func: (in0: In0,in1: In1) => RetType = changetype<(in0: In0,in1: In1)=> RetType>(fptr);
  const res: RetType = func(in0,in1);
  return res
  
}
function ackermann(m: number, n: number): number {
    if (m == 0) {
        return n + 1;
    }
    else if (n == 0) {
        return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m - 1, 1);
    }
    else {
        return apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m - 1, apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m, n - 1));
    }
}
export function main(): number {
    let sum: number = 0;
    for (let n = 0; n < 5; n++) {
        for (let m = 0; m < 4; m++) {
            sum += apply2Args<number, number, number>("ackermann", changetype<usize>(ackermann), m, n);
        }
    }
    return sum;
}
