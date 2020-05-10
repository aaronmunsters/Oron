# Oron

An instrumentation platform for assemblyscript

## Current state of the project

All that works can be found in the following files:

- `assembly/index.ts` <= the main program
- `assembly/oronAdvice.ts` <= the advice specification

_Note_: `npx` is required to be installed for the transformation to take place.

To see the output of the first working example run the following code after pulling repo:

```
npm install && npm run basic-instrumented
```

The instrumented source-code can now be seen in `assembly/output.ts`
