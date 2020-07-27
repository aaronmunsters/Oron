# Oron

An instrumentation platform for assemblyscript

## Current state of the project

clone the current project recursively (to include other dependancies)

```
git clone https://github.com/aaronmunsters/Oron --recursive
```

All that works can be found in the following files:

- `assembly/index.ts` <= the main program
- `assembly/oronAdvice.ts` <= the advice specification

_Note_: `npx` is required to be installed for the transformation to take place.

To see the output of the first working example run the following code after pulling repo:

```
npm install && npm run basic-instrumented
```

The instrumented source-code can now be seen in `assembly/output.ts`

### Resources:

The benchmarks are based on the Sunspider Benchmark Suite, translated to TypeScript fixed to work for assembly based on [this repository](https://github.com/apurvaraman/sunspider-jsx/tree/master/js/tests/sunspider-1.0/ts)

### TODO:

1. Provide CLI to perform instrumentation: `npx oron inputFile inputFileAnalysis.ts outputfile.ts` and later maybe as output-extension `.wasm` (here analysis.ts contains subclass of advice)
2. Rename methods to carry same name as Aran/MDN naming scheme (e.g. orondefaults/dependancies/analysis.ts imports two methods "dynamic...", this should be renamed and wrapped in general Reflect object)
3. Pre, post and around traps (cfr. aop)
4. Benchmark!
5. cfr Linvail paper programs to check which one's I could support

6)  compile simple example
7)  run on examples from AS-repo
8)  Add feature to compile analysis first, to output ASC errors before the transformation takes place

Intefaces are not supported by the compiler, but they're allowed as a construct to allow for IDE's to guide the developer.

Fix known issues:

Find a way to overcome / explain why I have not: limitations:

1. Compound types; such as `StaticArray<i32>`
2. Method calls of object: Cannot access method 'energy' without calling it as it requires 'this' to be set.
3. To intercept native function calls such as Math.PI
4. Fix 'mistakes' that have been introduced by completing the typeset
