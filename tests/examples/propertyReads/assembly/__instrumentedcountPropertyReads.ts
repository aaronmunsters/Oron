import { OronAnalysis } from "../orondefaults/dependancies/analysis";
import { dynamicPropertyRead } from "../orondefaults/dependancies/analysisDependancies";

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
    assert(myAnalysis.propertyAccess<Class, i32>(c, "prop1", offsetof<Class>("prop1")) === 1 && myAnalysis.propertyAccess<Class, i64>(c, "prop2", offsetof<Class>("prop2")) === 2 && myAnalysis.propertyAccess<Class, string>(c, "prop3", offsetof<Class>("prop3")) === "three", "AssemblyScript: Property Reads: a property read should retrieve the correct value");
    return 1;
}
