import { OronAnalysis } from "../dependancies/analysis/analysis";
import { dynamicPropertyWrite } from "../dependancies/analysis/analysisDependancies";

const write: Map<string, number> = new Map();

export function getRes(target: string): number {
  return write.has(target) ? write.get(target) : -1;
}

export class MyAnalysis extends OronAnalysis {
  propertySet<ClassInstance, Value>(
    classInstance: ClassInstance,
    value: Value,
    key: string,
    offset: usize
  ): void {
    write.set(key, (write.has(key) ? write.get(key) : 0) + 1);
    dynamicPropertyWrite<ClassInstance, Value>(classInstance, value, offset);
  }
}

const myAnalysis = new MyAnalysis();
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
    sum += primes(isPrime, i);
    retVal += isPrime[i];
  }
  return sum; // returns 13000 something
}
