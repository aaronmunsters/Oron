/* #################################
   Advice to perform instrumentation
   ################################# */

type Function<RetTyp, InTyp> = (...args: InTyp[]) => RetTyp;

function apply<RetTyp, InTyp>(
  f: Function<RetTyp, InTyp>, // the provided function
  ...args: InTyp[] // optional extra arguments
): RetTyp {
  return f(...args);
}

/* ######################
   Original program below
   ###################### */

function squareNumber(n: i32): i32 {
  return n * n;
}

// #### Here the source code transformation should take place
function square(n: i32, idx: i32, arr: Array<i32>): i32 {
  return apply<i32, i32>(squareNumber, n);
  // return squareNumber(n);
}

export function squaresSum(n: i32): i32 {
  return new Array<i32>(n)
    .map<i32>((n, i, a) => i)
    .map<i32>(square)
    .reduce((prev, curr) => prev + curr, 0);
}
