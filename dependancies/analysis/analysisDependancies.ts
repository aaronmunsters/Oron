/* ##############################################
   Interface provided by instrumentation platform
   ############################################## */

export function dynamicPropertyRead<C, V>(classInstance: C, offset: usize): V {
  return load<V>(changetype<usize>(classInstance) + offset);
}

export function dynamicPropertyWrite<C, V>(
  classInstance: C,
  value: V,
  offset: usize
): void {
  store<V>(changetype<usize>(classInstance) + offset, value);
}

export enum Types {
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
  classInstance,
}

export /* ####################################################################################
ArgsBuffer, class representing function arguments and their types (provided by Oron)
#################################################################################### */
class ArgsBuffer {
  argsAmount: i32;
  argSizes: i32[]; // sizeof <= is a value of type i32
  dynamicTypes: Types[];
  argBuffer: ArrayBuffer;
  classIds: u32[];
  constructor(argSizes: i32[]) {
    this.argsAmount = argSizes.length;
    this.argSizes = argSizes;
    const bufLength = argSizes.reduce((p, n) => p + n, 0);
    this.argBuffer = new ArrayBuffer(bufLength);
    this.dynamicTypes = new Array<Types>(this.argsAmount);
    this.classIds = new Array<u32>(this.argsAmount);
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
