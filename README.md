# svg.connectable.js
A JavaScript library for connecting SVG things.

## Installation
Run the following commands to download and install the application:

```sh
$ git clone https://github.com/jillix/svg.connectable.git svg.connectable.js
$ cd svg.connectable.js
$ npm install
```

## Documentation

## `connectable(options, elmTarget)`
Connects two elements.

### Params 
- **Object** `options`: An object containing the following fields: 
 - `container` (SVGElement): The line elements container.
 - `markers` (SVGElement): The marker elements container.

- **SVGElement** `elmTarget`: The target SVG element.

### Return
- **Object** The connectable object containing: 
 - `source` (SVGElement): The source element.
 - `target` (SVGElement): The target element.
 - `line` (SVGElement): The line element.
 - `marker` (SVGElement): The marker element.
 - [`computeLineCoordinates` (Function)](#concomputeLineCoordinatescon)
 - [`update` (Function)](#update)
 - [`setLineColor` (Function)](#setlinecolorcolor-c)

## `computeLineCoordinates(con)`
The function that computes the new coordinates.
It can be overriden with a custom function.

### Params 
- **Connectable** `con`: The connectable instance.

### Return
- **Object** An object containing the following fields:

## `update()`
Updates the line coordinates.

### Return
- **** 

## `setLineColor(color, c)`
Sets the line color.

### Params 
- **String** `color`: The new color.
- **Connectable** `c`: The connectable instance.

### Return
- **** 



## How to contribute

1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.
