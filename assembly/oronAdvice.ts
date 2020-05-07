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

declare function logString(strPtr: string): void;

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

  genericApply(fptr: usize, args: ArgsBuffer): void {
    logString("function call");
    /* Types are either primitives, or Classes, classes are still TODO */
    for (let argIdx = 0; argIdx < args.argsAmount; argIdx++) {
      switch (args.dynamicTypes[argIdx]) {
        case Types.i32:
          logString("Encountered a i32");
          break;
        case Types.u32:
          logString("Encountered a u32");
          break;
        case Types.i64:
          logString("Encountered a i64");
          break;
        case Types.u64:
          logString("Encountered a u64");
          break;
        case Types.f32:
          logString("Encountered a f32");
          break;
        case Types.f64:
          logString("Encountered a f64");
          break;
        case Types.v128:
          logString("Encountered a v128");
          break;
        case Types.i8:
          logString("Encountered a i8");
          break;
        case Types.u8:
          logString("Encountered a u8");
          break;
        case Types.i16:
          logString("Encountered a i16");
          break;
        case Types.u16:
          logString("Encountered a u16");
          break;
        case Types.bool:
          logString("Encountered a bool");
          break;
        case Types.isize:
          logString("Encountered a isize");
          break;
        case Types.usize:
          logString("Encountered a usize");
          break;
        case Types.void:
          logString("Encountered a void");
          break;
        case Types.anyref:
          logString("Encountered a anyref");
          break;
        case Types.number:
          logString("Encountered a number");
          break;
        case Types.boolean:
          logString("Encountered a boolean");
          break;
        case Types.classInstance:
          switch (args.classIds[argIdx]) {
            case idof<Human>():
              logString("Encountered a Human");
              break;
            default:
              logString("Encountered a classInstance, couldn't determine type");
              break;
          }
          break;
      }
    }
  }
}

const myAnalysis = new MyAnalysis();
