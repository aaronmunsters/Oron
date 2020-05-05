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

  preApply(fname: string): void;

  /* Desired, but currently not implemented
  apply<RetType, ArgTypes>(
    fname: string,
    f: Function,
    args: ArgTypes[]
  ): void;
  */

  singleApply<RetTyp, InTyp>(f: (arg: InTyp) => RetTyp, arg: InTyp): RetTyp;
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

  preApply(fname: string): void {
    return;
  }

  singleApply<RetTyp, InTyp>(f: (arg: InTyp) => RetTyp, arg: InTyp): RetTyp {
    /* Analysis would go here */
    return f(arg);
  }
}
