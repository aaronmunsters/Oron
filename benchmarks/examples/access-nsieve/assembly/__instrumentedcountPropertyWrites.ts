import { OronAnalysis } from "../orondefaults/dependancies/analysis";
import { dynamicPropertyWrite } from "../orondefaults/dependancies/analysisDependancies";

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
        sum = sum + nsieve(m, flags);
    }
    return sum; //returns 263
}
