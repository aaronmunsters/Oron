import {
  dynamicPropertyRead,
  dynamicPropertyWrite,
} from "./analysisDependancies";

/* #########################################
   Analysis provided by instrumentation user
   ######################################### */

export function getTrap<C, ReturnValue>(
  classInstance: C,
  key: string,
  offset: usize
): ReturnValue {
  /* Specify analysis here */
  return dynamicPropertyRead<C, ReturnValue>(classInstance, offset);
}

export function setTrap<C, V>(
  classInstance: C,
  value: V,
  key: string,
  offset: usize
): void {
  /* Specify analysis here */
  dynamicPropertyWrite<C, V>(classInstance, value, offset);
}
