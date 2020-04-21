/* export function oronBinaryOp<RetTyp>(
  operator: string,
  left: any,
  right: any
): any {
  switch (operator) {
    case "==":
      return left == right;
    case "!=":
      return left != right;
    case "===":
      return left === right;
    case "!==":
      return left !== right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<<":
      return left << right;
    case ">>":
      return left >> right;
    case ">>>":
      return left >>> right;
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "%":
      return left % right;
    case "|":
      return left | right;
    case "^":
      return left ^ right;
    case "&":
      return left & right;
    case "&&":
      return left && right;
    case "||":
      return left || right;
    case "in":
      return left in right;
    case "instanceof":
      return left instanceof right;
    default:
      return null;
  }
}
 */

enum arethmeticOperator {
  plus,
  minus,
  times,
  divide,
  modulus,
}

function oronNumericOp(op: arethmeticOperator, l: number, r: number): number {
  switch (op) {
    case arethmeticOperator.plus:
      return l + r;
    case arethmeticOperator.minus:
      return l - r;
    case arethmeticOperator.times:
      return l * r;
    case arethmeticOperator.divide:
      return l / r;
    case arethmeticOperator.modulus:
      return l % r;
    default:
      return 0;
    // throw "Oron: could not guarantee number return";
  }
}

function numericOperator(op: arethmeticOperator, l: number, r: number): number {
  return oronNumericOp(op, l, r);
}

/* ######################
     Original program below
     ###################### */
class Human {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const a: Human = new Human("Aaron", 21);
const b: Human = new Human("Scull", 99);

export function getValue(): number {
  a.name + b.name;
  a.age;
  a.age = 2;
  // a.age = numericOperator(arethmeticOperator.plus, 1, 2); // 1 + 2;
  return a.age;
}
