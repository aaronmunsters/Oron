/* Different take on performing function applications this example expects a logString function
 */

/* #############################################################################################
   Start of definitions provided by Oron, currently enumeration of AS types and ADT of arguments
   ############################################################################################# */

/* ###################################################
   Enumeration of all known AS types, provided by Oron
   ################################################### */
enum Types {
  i32,
  u32,
  i64,
  u64,
  f32,
  f64,
  v128,
  i8,
  u8,
  i16,
  u16,
  bool,
  isize,
  usize,
  void,
  anyref,
  number,
  boolean,
  classInstance /* not a primitive type, should be looked up via `idof<ClassType>()` */,
}

/* ####################################################################################
     ArgsBuffer, class representing function arguments and their types (provided by Oron)
     #################################################################################### */
class ArgsBuffer {
  argsAmount: i32;
  argSizes: i32[]; // sizeof <= is a value of type i32
  dynamicTypes: Types[];
  argBuffer: ArrayBuffer;
  classIds: u32[];
  constructor(argsAmount: i32, argSizes: i32[]) {
    this.argsAmount = argsAmount;
    this.argSizes = argSizes;
    const bufLength = argSizes.reduce((p, n) => p + n, 0);
    this.argBuffer = new ArrayBuffer(bufLength);
    this.dynamicTypes = new Array<Types>(argsAmount);
    this.classIds = new Array<u32>(argsAmount);
  }

  setArgument<ArgTyp>(
    argIdx: i32,
    dynamicType: Types,
    arg: ArgTyp,
    classId: u32
  ): void {
    assert(argIdx >= 0 && argIdx < this.argsAmount, "arg idx out of arg range");
    this.dynamicTypes[argIdx] = dynamicType;
    let argStartIdx = 0;
    for (let i = 0; i < argIdx; i++) {
      argStartIdx += this.argSizes[i];
    }
    const bufferPtr = changetype<usize>(this.argBuffer);
    store<ArgTyp>(bufferPtr + argStartIdx, arg);
    if (dynamicType === Types.classInstance) {
      this.classIds[argIdx] = classId;
    }
  }

  getArgument<ArgTyp>(argIdx: i32): ArgTyp {
    let argStartIdx = 0;
    for (let i = 0; i < argIdx; i++) {
      argStartIdx += this.argSizes[i];
    }
    const bufferPtr = changetype<usize>(this.argBuffer);
    return load<ArgTyp>(bufferPtr + argStartIdx);
  }
}

/* #################################################
     Start of analysis, provided by analysis developer
     ################################################# */
declare function logString(strPtr: string): void;

function genericApply(fptr: usize, args: ArgsBuffer): void {
  /* Types are either primitives, or Classes, classes are still TODO */
  for (let argIdx = 0; argIdx < args.argsAmount; argIdx++) {
    switch (args.dynamicTypes[argIdx]) {
      case Types.i32:
        logString("Encountered a i32");
        break;
      case Types.u32:
        logString("Encountered a u32");
        break;
      case Types.i64:
        logString("Encountered a i64");
        break;
      case Types.u64:
        logString("Encountered a u64");
        break;
      case Types.f32:
        logString("Encountered a f32");
        break;
      case Types.f64:
        logString("Encountered a f64");
        break;
      case Types.v128:
        logString("Encountered a v128");
        break;
      case Types.i8:
        logString("Encountered a i8");
        break;
      case Types.u8:
        logString("Encountered a u8");
        break;
      case Types.i16:
        logString("Encountered a i16");
        break;
      case Types.u16:
        logString("Encountered a u16");
        break;
      case Types.bool:
        logString("Encountered a bool");
        break;
      case Types.isize:
        logString("Encountered a isize");
        break;
      case Types.usize:
        logString("Encountered a usize");
        break;
      case Types.void:
        logString("Encountered a void");
        break;
      case Types.anyref:
        logString("Encountered a anyref");
        break;
      case Types.number:
        logString("Encountered a number");
        break;
      case Types.boolean:
        logString("Encountered a boolean");
        break;
      case Types.classInstance:
        switch (args.classIds[argIdx]) {
          case idof<Human>():
            logString("Encountered a Human");
            break;
          default:
            logString("Encountered a classInstance, couldn't determine type");
            break;
        }
        break;
    }
  }
}

/* ###################################################################################
     Start of instrumented code, only a function application of two args is instrumented
     ################################################################################### */
function applyTwoArgs<RetType, In1, In2>(
  fptr: usize,
  argsBuff: ArgsBuffer
): RetType {
  genericApply(fptr, argsBuff);
  const func: (in1: In1, in2: In2) => RetType = changetype<
    (in1: In1, in2: In2) => RetType
  >(fptr);
  return func(argsBuff.getArgument<In1>(0), argsBuff.getArgument<In2>(1));
}

function addToAge(a: Human, b: i32): i32 {
  return a.age + b;
}

class Human {
  name: string;
  age: i32;
  constructor(name: string, age: i32) {
    this.name = name;
    this.age = age;
  }
}

export function main(): i32 {
  const aaron: Human = new Human("aaron", 21);
  const someNumber: i32 = 9;

  // return addToAge(aaron, someNumber);
  const args = new ArgsBuffer(2, [sizeof<usize>(), sizeof<i32>()]);
  const classPtr = changetype<usize>(aaron);
  args.setArgument<usize>(0, Types.classInstance, classPtr, idof<Human>());
  args.setArgument<i32>(1, Types.i32, someNumber, -1);
  const fptr: usize = changetype<usize>(addToAge);
  return applyTwoArgs<i32, Human, i32>(fptr, args);
}
