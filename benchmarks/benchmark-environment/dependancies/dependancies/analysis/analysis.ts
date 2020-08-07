import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
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

  genericApply(fname: string, fptr: usize): void;

  genericPostApply<ResType>(
    fname: string,
    fptr: usize,
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

  genericApply(fname: string, fptr: usize): void {
    /* Analysis would go here */
  }

  genericPostApply<ResType>(
    fname: string,
    fptr: usize,
    result: ResType
  ): ResType {
    /* Analysis would go here */
    return result;
  }
}
