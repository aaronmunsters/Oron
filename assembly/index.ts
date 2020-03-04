// The entry file of your WebAssembly module.

function sub(a: i32): i32 {
  return a - 1;
}

export function add(a: i32, b: i32): i32 {
  sub(a);
  return a - b;
}
