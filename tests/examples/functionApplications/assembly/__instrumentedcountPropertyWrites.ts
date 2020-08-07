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
function ackermann(m: number, n: number): number {
    if (m == 0) {
        return n + 1;
    }
    else if (n == 0) {
        return ackermann(m - 1, 1);
    }
    else {
        return ackermann(m - 1, ackermann(m, n - 1));
    }
}
export function main(): number {
    let sum: number = 0;
    for (let n = 0; n < 5; n++) {
        for (let m = 0; m < 4; m++) {
            sum += ackermann(m, n);
        }
    }
    return sum;
}
