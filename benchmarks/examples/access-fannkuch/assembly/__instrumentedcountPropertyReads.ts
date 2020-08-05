import { OronAnalysis } from "../dependancies/analysis/analysis";
import { dynamicPropertyRead } from "../dependancies/analysis/analysisDependancies";

const reads: Map<string, number> = new Map();

export function getRes(target: string): number {
  return reads.has(target) ? reads.get(target) : -1;
}

export class MyAnalysis extends OronAnalysis {
  propertyAccess<ClassInstance, ReturnValue>(
    classInstance: ClassInstance,
    key: string,
    offset: usize
  ): ReturnValue {
    reads.set(key, (reads.has(key) ? reads.get(key) : 0) + 1);
    return dynamicPropertyRead<ClassInstance, ReturnValue>(
      classInstance,
      offset
    );
  }
}

const myAnalysis = new MyAnalysis();
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
  return fannkuch(10); //CHANGED THIS CAUSE 8 WAS TOO FAST // returns 38
}
