# Static Pages / Mustache Writer

Renders page data via Mustache templates.

Uses the [Mustache](https://www.npmjs.com/package/mustache) package under the hood.

This package is part of the StaticPagesJs project, see:
- Documentation: [staticpagesjs.github.io](https://staticpagesjs.github.io/)
- Core: [@static-pages/core](https://www.npmjs.com/package/@static-pages/core)

## Options

| Option | Type | Default value | Description |
|--------|------|---------------|-------------|
| `view` | `string \| (d: Data) => string` | `main.mustache` | Template to render. If it's a function it gets evaluated on each render call. |
| `viewsDir` | `string \| string[]` | `views` | One or more directory path where the templates are found. |
| `outDir` | `string` | `build` | Directory where the rendered output is saved. |
| `outFile` | `string \| (d: Data) => string` | *see outFile section* | Path of the rendered output relative to `outDir`. |
| `onOverwrite` | `(d: string) => void` | `console.warn(...)` | Callback function that gets executed when a file name collision occurs. |
| `onInvalidPath` | `(d: string) => void` | `console.warn(...)` | Callback function that gets executed when a file name contains invalid characters. |
| `showdownEnabled` | `string[]` | `[]` | Transform these variables to markdown; uses [showdown](http://showdownjs.com/). |
| `showdownOptions` | `showdown.ConverterOptions` | `{ simpleLineBreaks: true, ghCompatibleHeaderId: true, customizedHeaderId: true, tables: true }` | Custom options for the showdown markdown renderer. |

### `outFile` defaults
The default behaviour is to guess file path by a few possible properties of the data:

- if `data.output.path` is defined, use that.
- if `data.output.url` is defined, append `.html` and use that.
- if `data.header.path` is defined, replace extension to `.html` and use that.
- if nothing matches, name it `unnamed-{n}.html` where `{n}` is a counter.
