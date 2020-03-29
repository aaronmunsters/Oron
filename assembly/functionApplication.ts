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
