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
 // Edit here and press "Compile"
function A(i: i32, j: i32): f64 {
    let i2: f64 = i * 1.0;
    let j2: f64 = j * 1.0;
    return 1 / (((i2 + j2) * (i2 + j2 + 1)) / 2 + i2 + 1);
}
function Au(u: f64[], v: f64[], n: i32): i32 {
    for (let i: i32 = 0; i < n; ++i) {
        let t: f64 = 0.0;
        for (let j: i32 = 0; j < n; ++j)
            t += A(i, j) * u[j];
        v[i] = t;
    }
    return 1;
}
function AtAu(u: f64[], v: f64[], n: i32): i32 {
    for (let i: i32 = 0; i < n; ++i) {
        let t: f64 = 0.0;
        for (let j: i32 = 0; j < n; ++j)
            t += A(j, i) * u[j];
        v[i] = t;
    }
    return 1;
}
export function main(): i32 {
    let sum: i32 = 0;
    for (let i: i32 = 6; i <= 48; i *= 2) {
        sum = sum + (spectralnorm(i) as i32);
    }
    return sum; //returns 0;
}
function spectralnorm(n: i32): f64 {
    let i: i32, u: f64[] = new Array(n), v: f64[] = new Array(n), vv: f64 = 0, vBv: f64 = 0;
    for (i = 0; i < n; ++i) {
        u[i] = 1;
        v[i] = i;
    }
    for (i = 0; i < 10; ++i) {
        Au(v, u, n);
        AtAu(v, u, n);
    }
    for (i = 0; i < n; ++i) {
        vBv += u[i] * v[i];
        vv += v[i] * v[i];
    }
    return sqrt<f64>(vBv / vv);
}
