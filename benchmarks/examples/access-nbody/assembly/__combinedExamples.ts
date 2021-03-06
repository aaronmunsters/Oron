import { OronAnalysis } from "../dependancies/analysis/analysis";

import {
  Types,
  dynamicPropertyRead,
  dynamicPropertyWrite,
  ArgsBuffer,
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

  genericApply(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32
  ): void {
    increase(calls, fname);
  }
}

const myAnalysis = new MyAnalysis();
 const globalBuffer = new ArgsBuffer(1, 16);

function apply0Args<RetType,>(
  fname: string,
  fptr: usize,
  
): RetType {
  
      
      myAnalysis.genericApply(fname, fptr, globalBuffer, 0);
      
  
  const func: () => RetType = changetype<()=> RetType>(fptr);
  const res: RetType = func();
  return res
  
}


function apply0ArgsVoid(
  fname: string,
  fptr: usize,
  
): void {
  
      
      myAnalysis.genericApply(fname, fptr, globalBuffer, 0);
      
  const func: () => void = changetype<()=> void>(fptr);
  func()
  null
}


function apply1ArgsVoid<In0>(
  fname: string,
  fptr: usize,
  arg0: In0, typ0: Types, classId0: u32
): void {
  
      globalBuffer.setArgument<In0>(0, typ0, arg0, classId0);
      myAnalysis.genericApply(fname, fptr, globalBuffer, 1);
      
  const func: (in0: In0) => void = changetype<(in0: In0)=> void>(fptr);
  func(arg0)
  null
}
// From The Computer Language Benchmarks Game
// http://benchmarksgame.alioth.debian.org
type float = f64; // interchangeable f32/f64 for testing
const SOLAR_MASS = <float>(4.0 * Math.PI * Math.PI);
const DAYS_PER_YEAR: float = 365.24;
class Body {
    constructor(public x: float, public y: float, public z: float, public vx: float, public vy: float, public vz: float, public mass: float) { }
    offsetMomentum(px: float, py: float, pz: float): this {
        myAnalysis.propertySet<this, f64>(this, -px / SOLAR_MASS, "vx", offsetof<this>("vx"));
        myAnalysis.propertySet<this, f64>(this, -py / SOLAR_MASS, "vy", offsetof<this>("vy"));
        myAnalysis.propertySet<this, f64>(this, -pz / SOLAR_MASS, "vz", offsetof<this>("vz"));
        return this;
    }
}
function Sun(): Body {
    return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS);
}
function Jupiter(): Body {
    return new Body(4.8414314424647209, -1.16032004402742839, -1.03622044471123109e-1, 1.66007664274403694e-3 * DAYS_PER_YEAR, 7.69901118419740425e-3 * DAYS_PER_YEAR, -6.90460016972063023e-5 * DAYS_PER_YEAR, 9.54791938424326609e-4 * SOLAR_MASS);
}
function Saturn(): Body {
    return new Body(8.34336671824457987, 4.12479856412430479, -4.03523417114321381e-1, -2.76742510726862411e-3 * DAYS_PER_YEAR, 4.99852801234917238e-3 * DAYS_PER_YEAR, 2.30417297573763929e-5 * DAYS_PER_YEAR, 2.85885980666130812e-4 * SOLAR_MASS);
}
function Uranus(): Body {
    return new Body(1.2894369562139131e1, -1.51111514016986312e1, -2.23307578892655734e-1, 2.96460137564761618e-3 * DAYS_PER_YEAR, 2.3784717395948095e-3 * DAYS_PER_YEAR, -2.96589568540237556e-5 * DAYS_PER_YEAR, 4.36624404335156298e-5 * SOLAR_MASS);
}
function Neptune(): Body {
    return new Body(1.53796971148509165e1, -2.59193146099879641e1, 1.79258772950371181e-1, 2.68067772490389322e-3 * DAYS_PER_YEAR, 1.62824170038242295e-3 * DAYS_PER_YEAR, -9.5159225451971587e-5 * DAYS_PER_YEAR, 5.15138902046611451e-5 * SOLAR_MASS);
}
class NBodySystem {
    constructor(public bodies: StaticArray<Body>) {
        var px: float = 0.0;
        var py: float = 0.0;
        var pz: float = 0.0;
        var size = bodies.length;
        for (let i = 0; i < size; ++i) {
            let b = bodies[i];
            let m = myAnalysis.propertyAccess<Body, f64>(b, "mass", offsetof<Body>("mass"));
            px += myAnalysis.propertyAccess<Body, f64>(b, "vx", offsetof<Body>("vx")) * m;
            py += myAnalysis.propertyAccess<Body, f64>(b, "vy", offsetof<Body>("vy")) * m;
            pz += myAnalysis.propertyAccess<Body, f64>(b, "vz", offsetof<Body>("vz")) * m;
        }
        bodies[0].offsetMomentum(px, py, pz);
    }
    advance(dt: float): void {
        var bodies = myAnalysis.propertyAccess<this, StaticArray<Body>>(this, "bodies", offsetof<this>("bodies"));
        var size: u32 = bodies.length;
        // var buffer = changetype<usize>(bodies.buffer_);
        for (let i: u32 = 0; i < size; ++i) {
            let bodyi = bodies[i];
            // let bodyi = load<Body>(buffer + i * sizeof<Body>(), 8);
            let ix = myAnalysis.propertyAccess<Body, f64>(bodyi, "x", offsetof<Body>("x"));
            let iy = myAnalysis.propertyAccess<Body, f64>(bodyi, "y", offsetof<Body>("y"));
            let iz = myAnalysis.propertyAccess<Body, f64>(bodyi, "z", offsetof<Body>("z"));
            let bivx = myAnalysis.propertyAccess<Body, f64>(bodyi, "vx", offsetof<Body>("vx"));
            let bivy = myAnalysis.propertyAccess<Body, f64>(bodyi, "vy", offsetof<Body>("vy"));
            let bivz = myAnalysis.propertyAccess<Body, f64>(bodyi, "vz", offsetof<Body>("vz"));
            let bodyim = myAnalysis.propertyAccess<Body, f64>(bodyi, "mass", offsetof<Body>("mass"));
            for (let j: u32 = i + 1; j < size; ++j) {
                let bodyj = bodies[j];
                // let bodyj = load<Body>(buffer + j * sizeof<Body>(), 8);
                let dx = ix - myAnalysis.propertyAccess<Body, f64>(bodyj, "x", offsetof<Body>("x"));
                let dy = iy - myAnalysis.propertyAccess<Body, f64>(bodyj, "y", offsetof<Body>("y"));
                let dz = iz - myAnalysis.propertyAccess<Body, f64>(bodyj, "z", offsetof<Body>("z"));
                let distanceSq = dx * dx + dy * dy + dz * dz;
                let distance = <float>Math.sqrt(distanceSq);
                let mag = dt / (distanceSq * distance);
                let bim = bodyim * mag;
                let bjm = myAnalysis.propertyAccess<Body, f64>(bodyj, "mass", offsetof<Body>("mass")) * mag;
                bivx -= dx * bjm;
                bivy -= dy * bjm;
                bivz -= dz * bjm;
                bodyj.vx += dx * bim;
                bodyj.vy += dy * bim;
                bodyj.vz += dz * bim;
            }
            myAnalysis.propertySet<Body, f64>(bodyi, bivx, "vx", offsetof<Body>("vx"));
            myAnalysis.propertySet<Body, f64>(bodyi, bivy, "vy", offsetof<Body>("vy"));
            myAnalysis.propertySet<Body, f64>(bodyi, bivz, "vz", offsetof<Body>("vz"));
            bodyi.x += dt * bivx;
            bodyi.y += dt * bivy;
            bodyi.z += dt * bivz;
        }
    }
    energy(): float {
        var e: float = 0.0;
        var bodies = myAnalysis.propertyAccess<this, StaticArray<Body>>(this, "bodies", offsetof<this>("bodies"));
        for (let i: u32 = 0, size: u32 = bodies.length; i < size; ++i) {
            let bodyi = bodies[i];
            let ix = myAnalysis.propertyAccess<Body, f64>(bodyi, "x", offsetof<Body>("x"));
            let iy = myAnalysis.propertyAccess<Body, f64>(bodyi, "y", offsetof<Body>("y"));
            let iz = myAnalysis.propertyAccess<Body, f64>(bodyi, "z", offsetof<Body>("z"));
            let vx = myAnalysis.propertyAccess<Body, f64>(bodyi, "vx", offsetof<Body>("vx"));
            let vy = myAnalysis.propertyAccess<Body, f64>(bodyi, "vy", offsetof<Body>("vy"));
            let vz = myAnalysis.propertyAccess<Body, f64>(bodyi, "vz", offsetof<Body>("vz"));
            let bim = myAnalysis.propertyAccess<Body, f64>(bodyi, "mass", offsetof<Body>("mass"));
            e += 0.5 * bim * (vx * vx + vy * vy + vz * vz);
            for (let j: u32 = i + 1; j < size; ++j) {
                let bodyj = bodies[j];
                let dx = ix - myAnalysis.propertyAccess<Body, f64>(bodyj, "x", offsetof<Body>("x"));
                let dy = iy - myAnalysis.propertyAccess<Body, f64>(bodyj, "y", offsetof<Body>("y"));
                let dz = iz - myAnalysis.propertyAccess<Body, f64>(bodyj, "z", offsetof<Body>("z"));
                let distance = <float>Math.sqrt(dx * dx + dy * dy + dz * dz);
                e -= (bim * myAnalysis.propertyAccess<Body, f64>(bodyj, "mass", offsetof<Body>("mass"))) / distance;
            }
        }
        return e;
    }
}
var system: NBodySystem;
export function init(): void {
    system = new NBodySystem([apply0Args<Body>("Sun", changetype<usize>(Sun)), apply0Args<Body>("Jupiter", changetype<usize>(Jupiter)), apply0Args<Body>("Saturn", changetype<usize>(Saturn)), apply0Args<Body>("Uranus", changetype<usize>(Uranus)), apply0Args<Body>("Neptune", changetype<usize>(Neptune))]);
}
export function step(): float {
    system.advance(0.01);
    return system.energy();
}
export function bench(steps: u32): void {
    for (let i: u32 = 0; i < steps; ++i)
        system.advance(0.01);
}
export function getBody(index: i32): Body | null {
    var bodies = myAnalysis.propertyAccess<NBodySystem, StaticArray<Body>>(system, "bodies", offsetof<NBodySystem>("bodies"));
    return <u32>index < <u32>bodies.length ? bodies[index] : null;
}
export function main(): void {
    apply0ArgsVoid("init", changetype<usize>(init));
    apply1ArgsVoid<u32>("bench", changetype<usize>(bench), 200000, Types.u32, 0); /* Might need some tweaking */
}
