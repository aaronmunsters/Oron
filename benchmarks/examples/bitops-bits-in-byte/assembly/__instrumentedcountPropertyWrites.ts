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
function bitsinbyte(b: i32): i32 {
  let m: i32 = 1,
    c = 0;
  while (m < 0x100) {
    if (b & m) c++;
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
