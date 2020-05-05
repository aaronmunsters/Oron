/*

This code does not work, it is currently WIP

*/

const fctr: Map<string, number> = new Map();

function genericApply<RetTyp, ArgTyps>(
  f: string,
  args: ArgTyps[],
  res: RetTyp
): void {
  /* Example count function calls */
  fctr.get(f) === null ? fctr.set(f, 1) : fctr.set(f, fctr.get(f) + 1);
}

function applyTwo<RetTyp, In1, In2>(
  fname: string,
  f: (in1: In1, in2: In2) => RetTyp,
  in1: In1,
  in2: In2
): RetTyp {
  const res: RetTyp = f(in1, in2);
  genericApply<RetTyp, In1 | In2>(fname, [in1, in2], res);
  return res;
}

function applyThree<RetTyp, In1, In2, In3>(
  fname: string,
  f: (in1: In1, in2: In2, in3: In3) => RetTyp,
  in1: In1,
  in2: In2,
  in3: In3
): RetTyp {
  const res: RetTyp = f(in1, in2, in3);
  genericApply<RetTyp, In1 | In2 | In3>(fname, [in1, in2, in3], res);
  return res;
}

function addTwo(a: i32, b: i32): i32 {
  return a + b;
}

function addThree(a: i32, b: i32, c: i32): i32 {
  return a + b + c;
}

export function main(): i32 {
  const num1 = 10;
  const num2 = 100;
  const num3 = 1000;

  // return addTwo(num2, addThree(num1, num2, num3));
  return applyTwo<i32, i32, i32>(
    "addTwo",
    addTwo,
    num2,
    addThree(num1, num2, num3)
    // applyThree<i32, i32, i32, i32>("addThree", addThree, num1, num2, num3)
  );
}
