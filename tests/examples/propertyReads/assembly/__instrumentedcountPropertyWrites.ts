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
class Class {
    prop1: i32;
    prop2: i64;
    prop3: string;
    constructor(p1: i32, p2: i64, p3: string) {
        myAnalysis.propertySet<this, i32>(this, p1, "prop1", offsetof<this>("prop1"));
        myAnalysis.propertySet<this, i64>(this, p2, "prop2", offsetof<this>("prop2"));
        myAnalysis.propertySet<this, string>(this, p3, "prop3", offsetof<this>("prop3"));
    }
}
export default function main(): number {
    const c = new Class(1, 2, "three");
    assert(c.prop1 === 1 && c.prop2 === 2 && c.prop3 === "three", "AssemblyScript: Property Reads: a property read should retrieve the correct value");
    return 1;
}
