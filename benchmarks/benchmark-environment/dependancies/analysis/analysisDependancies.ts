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

export class OronVoid {}

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
  argSizes: Int32Array;
  dynamicTypes: Types[];
  argBuffer: ArrayBuffer;
  classIds: Uint32Array;
  constructor(maxProgramArgs: i32, maxBuffLength: i32) {
    this.argSizes = new Int32Array(maxProgramArgs);
    this.argBuffer = new ArrayBuffer(maxBuffLength);
    this.dynamicTypes = new Array<Types>(maxProgramArgs);
    this.classIds = new Uint32Array(maxProgramArgs);
  }

  setArgument<ArgTyp> /* Requires them to be set in order! */(
    argIdx: i32,
    dynamicType: Types,
    arg: ArgTyp,
    classId: u32
  ): void {
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
