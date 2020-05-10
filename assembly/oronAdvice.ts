import { OronAnalysis } from "../orondefaults/dependancies/analysis";

import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
  Types,
  ArgsBuffer,
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

declare function startLog(): void;
declare function logString(strPtr: string): void;
declare function endLog(): void;

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

  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    startLog();
    logString(
      "Performing function call of [" +
        fname +
        "] with [" +
        args.argsAmount.toString() +
        "] arguments"
    );
    for (let argIdx = 0; argIdx < args.argsAmount; argIdx++) {
      switch (args.dynamicTypes[argIdx]) {
        case Types.i32:
          logString(
            "Argument " +
              argIdx.toString() +
              " is of type i32 and value: " +
              args.getArgument<i32>(argIdx).toString()
          );
          break;
        case Types.classInstance:
          logString("Found class instance");
          break;
        default:
          logString("Found a value not of interest for analysis");
      }
    }
    endLog();
  }
}
