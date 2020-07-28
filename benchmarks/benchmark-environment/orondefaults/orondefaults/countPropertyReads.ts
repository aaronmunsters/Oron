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
