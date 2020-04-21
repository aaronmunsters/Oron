# Oron

An instrumentation platform for assemblyscript

## Current state of the project

Currently 'manually' adding generic traps to function applications.

Currently a generic `apply` has been implemented which can wrap any function application for a single argument.

Currently source-code transformation is the main focus, to check current status run

```
npm install
tsc oronTransform && node oronTransform
```

## TODO:

1. Fix the debugger
2. Fix the type resloving
3. Fix the generic apply
4. Correctly find a way to instrument objects (get and set) if they are a feature of the language
5. <del>add `get` and `set` => add typeArguments for `get` and `set` </del>
6. provide cli to perform transformation
7. Pre, post and around traps (cfr. aop)
8. Benchmark!
9. cfr Linvail paper programs to check which one's I could support

1) Implement analysis to perform call to empty wasm
2) Compare benchmarks of plain JS instrumentation and WASM-incl instrumentation
3) Develop draft for complete slides
4) ... work for other projects ...
5) Update comments
6) Code a class and perform a get and set opertation
7) Manually transform the code and see how I would implement an advice
8) Send over the original and transformed (by hand) and check if you agree
9) Try and do it automatically with the AssemblyScript parser

What he said:

1. first focus on get and set (using low level operation)
   "utility", "memory" (load) and "static type checks"

   get class layout => determine offset => load(object-offset, object-content)

2. Look into binary operations

3. correctly implement the single-argument-apply

4. contact him again!
