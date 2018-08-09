## Rollup code-splitting issue

This repo is a minimal reproduction of a rollup code-splitting issue.

The issue seems to be related to using the `export * from 'x'` form. The symptom is the generation of malformed exports in generated chunks.

Run `yarn build` to build the chunks. They are outputted to the `public` folder.

Run `yarn start` to start an http server on port 8080. Navigate to http://localhost:8080 to see the runtime error from the malformed chunks.

## Details

One malformed chunk looks like this:

```javascript
'use strict';

require('./chunk-fb422dac.js');

function foo() {
  console.log('foo');
}

exports.foo = foo;
exports.broken = broken;
```

where `broken` is not defined in `exports.broken = broken;`

and another looks like this:

```javascript
'use strict';

require('./chunk-fb422dac.js');

function bar() {
  console.log('bar');
}

exports.bar = bar;
exports.broken = __chunk_2.broken;
```

where `__chunk_2` is not defined in `exports.broken = __chunk_2.broken;`;

## Rollup

I traced through the rollup code briefly and found that these exports are being added to the chunk in `Chunk.ts` here https://github.com/rollup/rollup/blob/master/src/Chunk.ts#L300:

```javascript
// namespace variable can indicate multiple imports
if (traced.variable.isNamespace) {
  const namespaceVariables =
    (<NamespaceVariable>traced.variable).originals ||
    (<ExternalVariable>traced.variable).module.declarations;

  for (const importName of Object.keys(namespaceVariables)) {
    const original = namespaceVariables[importName];
    if (original.included) {
      if (traced.module.chunk) {
        traced.module.chunk.exports.set(original, traced.module);
      }
      this.imports.set(original, traced.module);
    }
  }
}
```
