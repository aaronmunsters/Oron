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
            sum += bitsinbyte(y);
        }
    }
    return sum;
}
