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
 // The Computer Language Shootout
// http://shootout.alioth.debian.org/
// contributed by Isaac Gouy
function ack(m: i32, n: i32): i32 {
    if (m == 0) {
        return n + 1;
    }
    if (n == 0) {
        return ack(m - 1, 1);
    }
    return ack(m - 1, ack(m, n - 1));
}
function fib(n: i32): i32 {
    if (n < 2) {
        return 1;
    }
    return fib(n - 2) + fib(n - 1);
}
function tak(x: i32, y: i32, z: i32): i32 {
    if (y >= x) {
        return z;
    }
    return tak(tak(x - 1, y, z), tak(y - 1, z, x), tak(z - 1, x, y));
}
export function main(): i32 {
    let a: i32 = 0;
    let b: i32 = 0;
    let c: i32 = 0;
    for (let i: i32 = 3; i <= 5; i++) {
        a = a + ack(3, i);
        b = b + fib(17 + i);
        c = c + tak(3 * i + 3, 2 * i + 2, i + 1);
    }
    return a + b + c;
}
