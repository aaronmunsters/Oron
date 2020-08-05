# Oron

An instrumentation platform for assemblyscript.

## Usage

Implement an `analysis.ts` by extending `OronAnalysis` and then export instrumented code by running on a terminal:

```
npx oron <input>.ts <analysis>.ts <output>.ts
```

## Development

You can run the benchmarks by cloning this repo and running:

```
npm run benchmarks
```

You can run the tests by cloning this repo and running:

```
npm run test
```

### Resources:

The benchmarks are based on the Sunspider Benchmark Suite, translated to TypeScript fixed to work for assembly based on [this repository](https://github.com/apurvaraman/sunspider-jsx/tree/master/js/tests/sunspider-1.0/ts)

### Known issues:

- Intefaces in AssemblyScript are not supported by the compiler, but they're allowed as a construct to allow for IDE's to guide the developer.

- Intercepting native functions/properties is not always possible, as they might be implemented on a different level (eg. compiler takes care of it), thus to remain consistent most native operations are not instrumented.

  - Requesting the length of a `StaticArray` will not be instrumented as it is a static property inside the memory block of the array and these type of exceptions are not incorporated in this work (to keep the codebase small)

## TODO:

1. Provide CLI to output compiled code: `npx oron inputFile inputFileAnalysis.ts outputfile.wasm/wat`
2. Rename methods to carry same name as Aran/MDN naming scheme (e.g. dependancies/analysis/analysis.ts imports two methods "dynamic...", this should be renamed and wrapped in general Reflect object)
3. Pre, post and around traps (cfr. aop)
