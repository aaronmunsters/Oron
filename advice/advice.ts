/* #################################
   Advice to perform instrumentation
   ################################# */

// type Function<RetTyp, InTyp> = (...args: InTyp[]) => RetTyp;

function singleApply<RetTyp, InTyp>(
  f: (...args: InTyp[]) => RetTyp, // the provided function
  arg: InTyp // optional extra argument
): RetTyp {
  return f(arg); // empty analysis
}

/*
function apply<RetTyp, InTyp>(
  f: Function<RetTyp, InTyp>, // the provided function
  ...args: InTyp[] // optional extra arguments
): RetTyp {
  return f(...args);
}
*/

function genericGet<K, V>(mapping: Map<K, V>, key: K): V {
  return mapping.get(key); // empty analysis
}

function genericSet<K, V>(mapping: Map<K, V>, key: K, val: V): void {
  mapping.set(key, val); // empty analysis
}
