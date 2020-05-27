import { OronAnalysis } from "../orondefaults/dependancies/analysis";
import {
  ArgsBuffer,
  Types,
} from "../orondefaults/dependancies/analysisDependancies";

const calls: Map<string, number> = new Map();

export function getRes(target: string): number {
  return calls.has(target) ? calls.get(target) : -1;
}

export class MyAnalysis extends OronAnalysis {
  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    calls.set(fname, (calls.has(fname) ? calls.get(fname) : 0) + 1);
  }
}
