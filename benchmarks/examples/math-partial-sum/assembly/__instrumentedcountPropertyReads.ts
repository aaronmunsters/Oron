import { OronAnalysis } from "../dependancies/analysis/analysis";
import { dynamicPropertyRead } from "../dependancies/analysis/analysisDependancies";

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
function partial(n: f64): void {
  let a1: f64,
    a2: f64,
    a3: f64,
    a4: f64,
    a5: f64,
    a6: f64,
    a7: f64,
    a8: f64,
    a9: f64 = 0.0;
  let twothirds: f64 = 2.0 / 3.0;
  let alt: f64 = -1.0;
  let k2: f64,
    k3: f64,
    sk: f64,
    ck: f64 = 0.0;
  for (let k: f64 = 1; k <= n; k++) {
    k2 = k * k;
    k3 = k2 * k;
    alt = -alt;
    a1 += pow(twothirds, k - 1);
    a2 += pow(k, -0.5);
    a3 += 1.0 / (k * (k + 1.0));
    a6 += 1.0 / k;
    a7 += 1.0 / k2;
    a8 += alt / k;
    a9 += alt / (2 * k - 1);
  }
}
export function main(): void {
  for (let i: f64 = 1024; i <= 16384; i *= 2) {
    partial(i);
  }
}
function pow(val1: f64, var2: f64): f64 {
  let ans: f64 = 1;
  while (var2 > 0) {
    ans = ans * val1;
    var2--;
  }
  return ans;
}
