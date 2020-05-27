class Class {
  prop1: i32;
  prop2: i64;
  prop3: string;
  constructor(p1: i32, p2: i64, p3: string) {
    this.prop1 = p1;
    this.prop2 = p2;
    this.prop3 = p3;
  }
}

export default function main(): number {
  const c = new Class(1, 2, "three");
  assert(
    c.prop1 === 1 && c.prop2 === 2 && c.prop3 === "three",
    "AssemblyScript: Property Reads: a property read should retrieve the correct value"
  );
  c.prop1 = 10;
  c.prop2 = 20;
  c.prop3 = "notThree";
  assert(
    c.prop1 === 10 && c.prop2 === 20 && c.prop3 === "notThree",
    "AssemblyScript: Property Writes: a property read should retrieve the correct value after a write"
  );
  return 1;
}
