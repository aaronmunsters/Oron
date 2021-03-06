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
/* The Great Computer Language Shootout
   http://shootout.alioth.debian.org/
   contributed by Isaac Gouy */
function fannkuch(n: i32): i32 {
    let check: i32 = 0;
    var perm: i32[] = new Array(n);
    var perm1: i32[] = new Array(n);
    var count: i32[] = new Array(n);
    var maxPerm: i32[] = new Array(n);
    var maxFlipsCount: i32 = 0;
    var m: i32 = n - 1;
    for (let i: i32 = 0; i < n; i++) {
        perm1[i] = i;
    }
    var r: i32 = n;
    while (true) {
        while (r != 1) {
            count[r - 1] = r;
            r--;
        }
        if (!(perm1[0] == 0 || perm1[m] == m)) {
            for (let i: i32 = 0; i < n; i++) {
                perm[i] = perm1[i];
            }
            var flipsCount: i32 = 0;
            var k: i32;
            while (!((k = perm[0]) == 0)) {
                var k2: i32 = (k + 1) >> 1;
                for (let i: i32 = 0; i < k2; i++) {
                    var temp: i32 = perm[i];
                    perm[i] = perm[k - i];
                    perm[k - i] = temp;
                }
                flipsCount++;
            }
            if (flipsCount > maxFlipsCount) {
                maxFlipsCount = flipsCount;
                for (let i: i32 = 0; i < n; i++) {
                    maxPerm[i] = perm1[i];
                }
            }
        }
        while (true) {
            if (r == n) {
                return maxFlipsCount;
            }
            var perm0: i32 = perm1[0];
            let i: i32 = 0;
            while (i < r) {
                let j: i32 = i + 1;
                perm1[i] = perm1[j];
                i = j;
            }
            perm1[r] = perm0;
            count[r] = count[r] - 1;
            if (count[r] > 0) {
                break;
            }
            r++;
        }
    }
}
export function main(): i32 {
    return apply1Args<i32, i32>("fannkuch", changetype<usize>(fannkuch), 10, Types.i32, 0); //CHANGED THIS CAUSE 8 WAS TOO FAST // returns 38
}
