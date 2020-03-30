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
3. Correctly find a way to instrument objects (get and set) if they are a feature of the language
4. <del>add `get` and `set` => add typeArguments for `get` and `set` </del>
5. provide cli to perform transformation
6. Pre, post and around traps (cfr. aop)
7. Benchmark!
