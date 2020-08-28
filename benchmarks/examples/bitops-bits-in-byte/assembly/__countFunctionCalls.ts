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
 const globalBuffer = new ArgsBuffer(1, 16);

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
function bitsinbyte(b: i32): i32 {
    let m: i32 = 1, c = 0;
    while (m < 0x100) {
        if (b & m)
            c++;
        m <<= 1;
    }
    return c;
}
export function main(): i32 {
    let x: i32, y: i32, t: i32;
    let sum: i32 = 0;
    for (let x: i32 = 0; x < 350; x++) {
        for (let y: i32 = 0; y < 256; y++) {
            sum += apply1Args<i32, i32>("bitsinbyte", changetype<usize>(bitsinbyte), y, Types.i32, 0);
        }
    }
    return sum;
}
