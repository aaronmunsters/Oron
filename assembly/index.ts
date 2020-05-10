class Human {
  name: string;
  age: i32;
  constructor(name: string, age: i32) {
    this.name = name;
    this.age = age;
  }
}

function add(a: Human, b: i32): i32 {
  return a.age + b;
}

function sub(a: Human, b: i32): i32 {
  a.age = a.age + 1;
  return a.age - b;
}

export function getValue(): i32 {
  const a: Human = new Human("Aaron", 21);
  const b: Human = new Human("Scull", 99);
  sub(b, 50);
  return add(a, 9);
}
