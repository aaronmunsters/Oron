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
// Copyright (c) 2004 by Arthur Langereis (arthur_ext at domain xfinitegames, tld com
// 1 op = 6 ANDs, 3 SHRs, 3 SHLs, 4 assigns, 2 ADDs
// O(1)
function fast3bitlookup(b: i32): i32 {
    let c: i32 = 0xe994;
    let bi3b: i32 = 0xe994; // 0b1110 1001 1001 0100; // 3 2 2 1  2 1 1 0
    c = 3 & (bi3b >> ((b << 1) & 14));
    c += 3 & (bi3b >> ((b >> 2) & 14));
    c += 3 & (bi3b >> ((b >> 5) & 6));
    return c;
    /*
  lir4,0xE994; 9 instructions, no memory access, minimal register dependence, 6 shifts, 2 adds, 1 inline assign
  rlwinmr5,r3,1,28,30
  rlwinmr6,r3,30,28,30
  rlwinmr7,r3,27,29,30
  rlwnmr8,r4,r5,30,31
  rlwnmr9,r4,r6,30,31
  rlwnmr10,r4,r7,30,31
  addr3,r8,r9
  addr3,r3,r10
  */
}
export function main(): i32 {
    let x: i32;
    let y: i32;
    let t: i32;
    let sum: i32 = 0;
    for (x = 0; x < 500; x++) {
        for (y = 0; y < 256; y++) {
            sum += function (arg0: i32): i32 { var args = new ArgsBuffer([sizeof<i32>()]); args.setArgument<i32>(0, Types.i32, arg0, 0); return apply1Args<i32, i32>("fast3bitlookup", changetype<usize>(fast3bitlookup), args); }(y);
        }
    }
    return sum;
}
