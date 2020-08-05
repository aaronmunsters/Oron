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

  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    increase(calls, fname);
  }
}

const myAnalysis = new MyAnalysis();

function apply2Args<RetType, In0, In1>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0, in1: In1) => RetType = changetype<
    (in0: In0, in1: In1) => RetType
  >(fptr);
  return func(argsBuff.getArgument<In0>(0), argsBuff.getArgument<In1>(1));
}

function apply1Args<RetType, In0>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0) => RetType = changetype<(in0: In0) => RetType>(fptr);
  return func(argsBuff.getArgument<In0>(0));
}

function apply3Args<RetType, In0, In1, In2>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer
): RetType {
  myAnalysis.genericApply(fname, fptr, argsBuff);
  const func: (in0: In0, in1: In1, in2: In2) => RetType = changetype<
    (in0: In0, in1: In1, in2: In2) => RetType
  >(fptr);
  return func(
    argsBuff.getArgument<In0>(0),
    argsBuff.getArgument<In1>(1),
    argsBuff.getArgument<In2>(2)
  );
}
// The Computer Language Shootout
// http://shootout.alioth.debian.org/
// contributed by Isaac Gouy
function ack(m: i32, n: i32): i32 {
  if (m == 0) {
    return n + 1;
  }
  if (n == 0) {
    return (function (arg0: i32, arg1: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      args.setArgument<i32>(1, Types.i32, arg1, 0);
      return apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), args);
    })(m - 1, 1);
  }
  return (function (arg0: i32, arg1: i32): i32 {
    var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>()]);
    args.setArgument<i32>(0, Types.i32, arg0, 0);
    args.setArgument<i32>(1, Types.i32, arg1, 0);
    return apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), args);
  })(
    m - 1,
    (function (arg0: i32, arg1: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      args.setArgument<i32>(1, Types.i32, arg1, 0);
      return apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), args);
    })(m, n - 1)
  );
}
function fib(n: i32): i32 {
  if (n < 2) {
    return 1;
  }
  return (
    (function (arg0: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      return apply1Args<i32, i32>("fib", changetype<usize>(fib), args);
    })(n - 2) +
    (function (arg0: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      return apply1Args<i32, i32>("fib", changetype<usize>(fib), args);
    })(n - 1)
  );
}
function tak(x: i32, y: i32, z: i32): i32 {
  if (y >= x) {
    return z;
  }
  return (function (arg0: i32, arg1: i32, arg2: i32): i32 {
    var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>(), sizeof<i32>()]);
    args.setArgument<i32>(0, Types.i32, arg0, 0);
    args.setArgument<i32>(1, Types.i32, arg1, 0);
    args.setArgument<i32>(2, Types.i32, arg2, 0);
    return apply3Args<i32, i32, i32, i32>("tak", changetype<usize>(tak), args);
  })(
    (function (arg0: i32, arg1: i32, arg2: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>(), sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      args.setArgument<i32>(1, Types.i32, arg1, 0);
      args.setArgument<i32>(2, Types.i32, arg2, 0);
      return apply3Args<i32, i32, i32, i32>(
        "tak",
        changetype<usize>(tak),
        args
      );
    })(x - 1, y, z),
    (function (arg0: i32, arg1: i32, arg2: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>(), sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      args.setArgument<i32>(1, Types.i32, arg1, 0);
      args.setArgument<i32>(2, Types.i32, arg2, 0);
      return apply3Args<i32, i32, i32, i32>(
        "tak",
        changetype<usize>(tak),
        args
      );
    })(y - 1, z, x),
    (function (arg0: i32, arg1: i32, arg2: i32): i32 {
      var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>(), sizeof<i32>()]);
      args.setArgument<i32>(0, Types.i32, arg0, 0);
      args.setArgument<i32>(1, Types.i32, arg1, 0);
      args.setArgument<i32>(2, Types.i32, arg2, 0);
      return apply3Args<i32, i32, i32, i32>(
        "tak",
        changetype<usize>(tak),
        args
      );
    })(z - 1, x, y)
  );
}
export function main(): i32 {
  let a: i32 = 0;
  let b: i32 = 0;
  let c: i32 = 0;
  for (let i: i32 = 3; i <= 5; i++) {
    a =
      a +
      (function (arg0: i32, arg1: i32): i32 {
        var args = new ArgsBuffer([sizeof<i32>(), sizeof<i32>()]);
        args.setArgument<i32>(0, Types.i32, arg0, 0);
        args.setArgument<i32>(1, Types.i32, arg1, 0);
        return apply2Args<i32, i32, i32>("ack", changetype<usize>(ack), args);
      })(3, i);
    b =
      b +
      (function (arg0: i32): i32 {
        var args = new ArgsBuffer([sizeof<i32>()]);
        args.setArgument<i32>(0, Types.i32, arg0, 0);
        return apply1Args<i32, i32>("fib", changetype<usize>(fib), args);
      })(17 + i);
    c =
      c +
      (function (arg0: i32, arg1: i32, arg2: i32): i32 {
        var args = new ArgsBuffer([
          sizeof<i32>(),
          sizeof<i32>(),
          sizeof<i32>(),
        ]);
        args.setArgument<i32>(0, Types.i32, arg0, 0);
        args.setArgument<i32>(1, Types.i32, arg1, 0);
        args.setArgument<i32>(2, Types.i32, arg2, 0);
        return apply3Args<i32, i32, i32, i32>(
          "tak",
          changetype<usize>(tak),
          args
        );
      })(3 * i + 3, 2 * i + 2, i + 1);
  }
  return a + b + c;
}
