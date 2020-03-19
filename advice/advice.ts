// The entry file of your WebAssembly module.

function decr(a: i32): i32 {
  return a - 1;
}

export function add(a: i32, b: i32): i32 {
  a = decr(a);
  // decr.prop = a;
  return a - b;
}

/*
  Desiderata:
  - perform operations on the function name
  - perform operations on the arguments
  - perform any other code (effectively altering the program behaviour)
  - changing the returned value of the call expression (shadowing all values with extra information)
  
  function incr(a: i32): i32 {
    return a++;
  }
  
  const testing = (nan: i32) => nan++;
  
  testing(256);
  callExpression(testing, [256]);
  
  
  */

/*
  Attempt:


  function apply(f: Function, ...args: any): returnof<f> {
  return f(...args);
}

const advice = {
  apply: apply
};

function actualAdd(a: i32, b: i32): i32 {
  return a + b;
}

export function add(a: i32, b: i32): i32 {
  const res = advice.apply(actualAdd, a, b);
  return res;
}



*/
