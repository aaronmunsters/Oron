/* #################################
   Advice to perform instrumentation
   ################################# */

type Function<RetTyp, InTyp> = (...args: InTyp[]) => RetTyp;

/*
function apply<RetTyp, InTyp>(
  f: Function<RetTyp, InTyp>, // the provided function
  ...args: InTyp[] // optional extra arguments
): RetTyp {
  return f(...args);
}
*/

function singleApply<RetTyp, InTyp>(
  f: Function<RetTyp, InTyp>, // the provided function
  arg: InTyp // optional extra argument
): RetTyp {
  return f(arg);
}

function genericGet<K, V>(mapping: Map<K, V>, key: K, val: V): V {
  return mapping.get(key); // empty analysis
}

function genericSet<K, V>(mapping: Map<K, V>, key: K, val: V): void {
  mapping.set(key, val); // empty analysis
}

/* ######################
   Original program below
   ###################### */

function squareNumber(n: i32): i32 {
  return n * n;
}

// #### Here the source code transformation should take place
function square(n: i32, idx: i32, arr: Array<i32>): i32 {
  return squareNumber(n); // Uninstrumented, 'empty'
  // return singleApply<i32, i32>(squareNumber, n); // This is already possible
  // return apply<i32, i32>(squareNumber, n); // This would be better
  // return apply<i32, i32, i64[], i32[], i32>(exampleFunction, n, [0,1,2,3], arr, idx); // This would be ideal
}

export function squaresSum(n: i32): i32 {
  return new Array<i32>(n) // for n == 4: [*, *, *, *]
    .map<i32>((n, i, a) => i) // [0, 1, 2, 3]
    .map<i32>(square) // [0, 1, 4, 9]
    .reduce((prev, curr) => prev + curr, 0); // 15
}

export function getValue(index: i32): String {
  let mapping: Map<i32, string> = new Map();
  //genericSet<i32, string>(mapping, 1, "hello world");
  mapping.set(1, "hello world");
  //genericSet<i32, string>(mapping, 2, "this is a string");
  mapping.set(2, "this is a string");
  //genericSet<i32, string>(mapping, 3, "will it work?");
  mapping.set(3, "will it work?");

  //return genericGet<i32, string>(mapping, index, mapping.get(index));
  return mapping.get(index);
}
