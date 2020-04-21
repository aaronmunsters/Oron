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
