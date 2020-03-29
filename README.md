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

1. <del>add `get` and `set`</del> => add typeArguments for `get` and `set`
2. provide cli to perform transformation
