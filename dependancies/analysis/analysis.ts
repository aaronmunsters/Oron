import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
  ArgsBuffer,
  Types,
} from "./analysisDependancies";

export { dynamicPropertyRead, dynamicPropertyWrite };

/* #####################################
   Interface to develop analysis against
   ##################################### */

export interface Oron {
  propertyAccess<ClassInstance, ReturnValue>(
    classInstance: ClassInstance,
    key: string,
    offset: usize
  ): ReturnValue;
  propertySet<ClassInstance, Value>(
    classInstance: ClassInstance,
    value: Value,
    key: string,
    offset: usize
  ): void;
  genericApply(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32
  ): void;
  genericPostApply<ResType>(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32,
    result: ResType
  ): ResType;
}

export class OronAnalysis implements Oron {
  propertyAccess<ClassInstance, ReturnValue>(
    classInstance: ClassInstance,
    key: string,
    offset: usize
  ): ReturnValue {
    /* Analysis would go here */
    return dynamicPropertyRead<ClassInstance, ReturnValue>(
      classInstance,
      offset
    );
  }

  propertySet<ClassInstance, Value>(
    classInstance: ClassInstance,
    value: Value,
    key: string,
    offset: usize
  ): void {
    /* Analysis would go here */
    dynamicPropertyWrite<ClassInstance, Value>(classInstance, value, offset);
  }

  genericApply(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32
  ): void {
    /* Analysis would go here */
    for (let argIdx = 0; argIdx < argsAmt; argIdx++) {
      switch (args.dynamicTypes[argIdx]) {
        case Types.i32:
          break;
        case Types.u32:
          break;
        case Types.i64:
          break;
        case Types.u64:
          break;
        case Types.f32:
          break;
        case Types.f64:
          break;
        case Types.v128:
          break;
        case Types.i8:
          break;
        case Types.u8:
          break;
        case Types.i16:
          break;
        case Types.u16:
          break;
        case Types.isize:
          break;
        case Types.usize:
          break;
        case Types.void:
          break;
        case Types.anyref:
          break;
        case Types.number:
          break;
        case Types.boolean:
          break;
        case Types.classInstance:
          switch (args.classIds[argIdx]) {
            case idof<ArrayBuffer>():
              break;
            case idof<DataView>():
              break;
            case idof<Date>():
              break;
            case idof<Error>():
              break;
            case idof<String>():
              break;
            /* Possible to include idof<Array<String>>, though finite, all combinations not included here */
            /* */
            default:
              // Encountered a classInstance, type unspecified in analysis
              break;
          }
          break;
      }
    }
  }

  genericPostApply<ResType>(
    fname: string,
    fptr: usize,
    args: ArgsBuffer,
    argsAmt: i32,
    result: ResType
  ): ResType {
    /* Analysis would go here */
    return result;
  }
}
