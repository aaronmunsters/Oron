import { OronAnalysis } from "../dependancies/analysis/analysis";

import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
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

  genericApply(fname: string, fptr: usize): void {
    increase(calls, fname);
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
    assert<boolean>(myAnalysis.propertyAccess<Class, i32>(c, "prop1", offsetof<Class>("prop1")) === 1 && myAnalysis.propertyAccess<Class, i64>(c, "prop2", offsetof<Class>("prop2")) === 2 && myAnalysis.propertyAccess<Class, string>(c, "prop3", offsetof<Class>("prop3")) === "three", "AssemblyScript: Property Reads: a property read should retrieve the correct value");
    return 1;
}
