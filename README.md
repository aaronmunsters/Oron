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

1. Perform correct benchmarks => WASM module encapsulates traps (imports JS functions) and applies them upon calling them
2. Provide proper superclass for analysis developer to extend this class and specify own analysis => type support (y) but ... tree will use syntactic information to inject the specified traps in the program, selectively! => considered a clean interface using namespaces to write code against
3. Provide CLI to perform instrumentation: `npx oron inputFile inputFileAnalysis.ts outputfile.ts` and later maybe as output-extension `.wasm` (here analysis.ts contains subclass of advice)
4. Rename methods to carry same name as Aran/MDN naming scheme (e.g. orondefaults/dependancies/analysis.ts imports two methods "dynamic...", this should be renamed and wrapped in general Reflect object)
5. Fix the generic apply ( & correct implementation of single-argument apply)
6. Check for following: "Read all elements in the namespace and do the transformations against the code"
7. Pre, post and around traps (cfr. aop)
8. Benchmark!
9. cfr Linvail paper programs to check which one's I could support
