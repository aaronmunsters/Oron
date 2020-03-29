/* ######################
   Original program below
   ###################### */

export function getValue(index: i32): String {
  let mapping: Map<i32, string> = new Map();
  //genericSet<i32, string>(mapping, 1, "hello world");
  mapping.set(1, "hello world");
  //genericSet<i32, string>(mapping, 2, "this is a string");
  mapping.set(2, "this is a string");
  //genericSet<i32, string>(mapping, 3, "will it work?");
  mapping.set(3, "will it work?");

  //return genericGet<i32, string>(mapping, index, mapping.get(index));
  return mapping.get(index);
}
