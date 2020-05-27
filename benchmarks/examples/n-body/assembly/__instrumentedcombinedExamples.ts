import { OronAnalysis } from "../orondefaults/dependancies/analysis";

import {
  Types,
  dynamicPropertyRead,
  dynamicPropertyWrite,
  ArgsBuffer,
} from "../orondefaults/dependancies/analysisDependancies";

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

  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    increase(calls, fname);
  }
}

const myAnalysis = new MyAnalysis();

function apply1Args<RetType,In0>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0) => RetType = changetype<(in0: In0)=> RetType>(fptr);
  return func(argsBuff.getArgument<In0>(0))
}


function apply1ArgsVoid<In0>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): void {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0) => void = changetype<(in0: In0)=> void>(fptr);
  func(argsBuff.getArgument<In0>(0))
}


function apply0Args<RetType,>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: () => RetType = changetype<()=> RetType>(fptr);
  return func()
}


function apply0ArgsVoid(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): void {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: () => void = changetype<()=> void>(fptr);
  func()
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
            let b = unchecked(bodies[i]);
            let m = b.mass;
            px += b.vx * m;
            py += b.vy * m;
            pz += b.vz * m;
        }
        unchecked(bodies[0]).offsetMomentum(px, py, pz);
    }
    advance(dt: float): void {
        var bodies = this.bodies;
        var size: u32 = bodies.length;
        // var buffer = changetype<usize>(bodies.buffer_);
        for (let i: u32 = 0; i < size; ++i) {
            let bodyi = unchecked(bodies[i]);
            // let bodyi = load<Body>(buffer + i * sizeof<Body>(), 8);
            let ix = bodyi.x;
            let iy = bodyi.y;
            let iz = bodyi.z;
            let bivx = bodyi.vx;
            let bivy = bodyi.vy;
            let bivz = bodyi.vz;
            let bodyim = bodyi.mass;
            for (let j: u32 = i + 1; j < size; ++j) {
                let bodyj = unchecked(bodies[j]);
                // let bodyj = load<Body>(buffer + j * sizeof<Body>(), 8);
                let dx = ix - bodyj.x;
                let dy = iy - bodyj.y;
                let dz = iz - bodyj.z;
                let distanceSq = dx * dx + dy * dy + dz * dz;
                let distance = <float>Math.sqrt(distanceSq);
                let mag = dt / (distanceSq * distance);
                let bim = bodyim * mag;
                let bjm = bodyj.mass * mag;
                bivx -= dx * bjm;
                bivy -= dy * bjm;
                bivz -= dz * bjm;
                bodyj.vx += dx * bim;
                bodyj.vy += dy * bim;
                bodyj.vz += dz * bim;
            }
            bodyi.vx = bivx;
            bodyi.vy = bivy;
            bodyi.vz = bivz;
            bodyi.x += dt * bivx;
            bodyi.y += dt * bivy;
            bodyi.z += dt * bivz;
        }
    }
    energy(): float {
        var e: float = 0.0;
        var bodies = this.bodies;
        for (let i: u32 = 0, size: u32 = bodies.length; i < size; ++i) {
            let bodyi = unchecked(bodies[i]);
            let ix = bodyi.x;
            let iy = bodyi.y;
            let iz = bodyi.z;
            let vx = bodyi.vx;
            let vy = bodyi.vy;
            let vz = bodyi.vz;
            let bim = bodyi.mass;
            e += 0.5 * bim * (vx * vx + vy * vy + vz * vz);
            for (let j: u32 = i + 1; j < size; ++j) {
                let bodyj = unchecked(bodies[j]);
                let dx = ix - bodyj.x;
                let dy = iy - bodyj.y;
                let dz = iz - bodyj.z;
                let distance = <float>Math.sqrt(dx * dx + dy * dy + dz * dz);
                e -= (bim * bodyj.mass) / distance;
            }
        }
        return e;
    }
}
var system: NBodySystem;
export function init(): void {
    system = new NBodySystem([function (): Body { var args = new ArgsBuffer([]); return apply0Args<Body>("Sun", changetype<usize>(Sun), args); }(), function (): Body { var args = new ArgsBuffer([]); return apply0Args<Body>("Jupiter", changetype<usize>(Jupiter), args); }(), function (): Body { var args = new ArgsBuffer([]); return apply0Args<Body>("Saturn", changetype<usize>(Saturn), args); }(), function (): Body { var args = new ArgsBuffer([]); return apply0Args<Body>("Uranus", changetype<usize>(Uranus), args); }(), function (): Body { var args = new ArgsBuffer([]); return apply0Args<Body>("Neptune", changetype<usize>(Neptune), args); }()]);
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
    var bodies = system.bodies;
    return <u32>index < <u32>bodies.length ? unchecked(bodies[index]) : null;
}
