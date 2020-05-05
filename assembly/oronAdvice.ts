import { OronAnalysis } from "../orondefaults/dependancies/analysis";

import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
} from "../orondefaults/dependancies/analysisDependancies";

const reads: Map<string, number> = new Map();
const sets: Map<string, number> = new Map();

function increase(countStructure: Map<string, number>, target: string): void {
  if (countStructure.has(target)) {
    countStructure.set(target, countStructure.get(target) + 1);
  } else {
    countStructure.set(target, 1);
  }
}

export function getRes(variable: string, target: string): number {
  let choice: Map<string, number>;
  // maybe rewrite as switch case
  if (variable == "reads") {
    choice = reads;
  } else if (variable == "sets") {
    choice = sets;
  } else {
    return -1;
  }
  if (choice.has(target)) {
    return choice.get(target);
  } else {
    return -2;
  }
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
}

const myAnalysis = new MyAnalysis();
