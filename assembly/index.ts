class Human {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

export function getValue(): number {
  const a: Human = new Human("Aaron", 21);
  const b: Human = new Human("Scull", 99);
  const aarAge = a.age;
  const scullAge = b.age;
  const combinedAge = aarAge + scullAge;
  const c: Human = new Human("AaronScull", combinedAge);
  const age = c.age;
  return age;
}
