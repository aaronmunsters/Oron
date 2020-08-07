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
class Class {
    prop1: i32;
    prop2: i64;
    prop3: string;
    constructor(p1: i32, p2: i64, p3: string) {
        this.prop1 = p1;
        this.prop2 = p2;
        this.prop3 = p3;
    }
}
export default function main(): number {
    const c = new Class(1, 2, "three");
    assert<boolean>(c.prop1 === 1 && c.prop2 === 2 && c.prop3 === "three", "AssemblyScript: Property Reads: a property read should retrieve the correct value");
    c.prop1 = 10;
    c.prop2 = 20;
    c.prop3 = "notThree";
    assert<boolean>(c.prop1 === 10 && c.prop2 === 20 && c.prop3 === "notThree", "AssemblyScript: Property Writes: a property read should retrieve the correct value after a write");
    return 1;
}
