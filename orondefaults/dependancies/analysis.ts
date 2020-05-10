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

  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void;
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

  genericApply(fname: string, fptr: usize, args: ArgsBuffer): void {
    /* Analysis would go here */
    for (let argIdx = 0; argIdx < args.argsAmount; argIdx++) {
      switch (args.dynamicTypes[argIdx]) {
        case Types.i32:
          null;
          break;
        case Types.u32:
          null;
          break;
        case Types.i64:
          null;
          break;
        case Types.u64:
          null;
          break;
        case Types.f32:
          null;
          break;
        case Types.f64:
          null;
          break;
        case Types.v128:
          null;
          break;
        case Types.i8:
          null;
          break;
        case Types.u8:
          null;
          break;
        case Types.i16:
          null;
          break;
        case Types.u16:
          null;
          break;
        case Types.bool:
          null;
          break;
        case Types.isize:
          null;
          break;
        case Types.usize:
          null;
          break;
        case Types.void:
          null;
          break;
        case Types.anyref:
          null;
          break;
        case Types.number:
          null;
          break;
        case Types.boolean:
          null;
          break;
        case Types.classInstance:
          switch (args.classIds[argIdx]) {
            case idof<ArrayBuffer>():
              null;
              break;
            case idof<DataView>():
              null;
              break;
            case idof<Date>():
              null;
              break;
            case idof<Error>():
              null;
              break;
            case idof<String>():
              null;
              break;
            /* Possible to include idof<Array<String>>, though finite, all combinations not included here */
            /* */
            default:
              // Encountered a classInstance, type unspecified in analysis
              null;
              break;
          }
          break;
      }
    }
  }
}
