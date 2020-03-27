# Oron
An instrumentation platform for assemblyscript

## Current state of the project
Currently 'manually' adding generic traps to function applications.

Currently a generic `apply` has been implemented which can wrap any function application for a single argument.

To run the current setup, do the following *in the root directory of the project*:

```
npm install
npx asc ./assembly/index.ts --binaryFile ./build/optimized.wasm
node program.js
```

This will run a single test to check whether the wrapped function still performs the same action.
Currently it is required to manually change the function application by the wrapped function and its arguments.
This is refering to line 33 and 34 in file `./assembly/index.ts`.

## TODO:
1. add `get` and `set`
2. perform ast transformation
3. provide cli to perform transformation
