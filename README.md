svg.connectable.js
==================
A JavaScript library for connecting SVG things.

## Usage

This library depends on:

 - [SVG.js](https://github.com/wout/svg.js)
 - [svg.draggable.js](https://github.com/jillix/svg.draggable.js)

```html
<script src="path/to/svg.js"></script>
<script src="path/to/svg.draggable.js"></script>
<script src="path/to/svg.connectable.js"></script>
<script>
    // ...
    elm1.connectable({
        container: lines,
        markers: markers
    }, elm2);
    // ...
</script>
```

## Documentation

### `connectable(options, elmTarget)`
Connects two elements.

#### Params
- **Object** `options`: An object containing the following fields:
 - `container` (SVGElement): The line elements container.
 - `markers` (SVGElement): The marker elements container.

- **SVGElement** `elmTarget`: The target SVG element.

#### Return
- **Object** The connectable object containing:
 - `source` (SVGElement): The source element.
 - `target` (SVGElement): The target element.
 - `line` (SVGElement): The line element.
 - `marker` (SVGElement): The marker element.
 - [`computeLineCoordinates` (Function)](#concomputeLineCoordinatescon)
 - [`update` (Function)](#update)
 - [`setLineColor` (Function)](#setlinecolorcolor-c)

### `computeLineCoordinates(con)`
The function that computes the new coordinates.
It can be overriden with a custom function.

#### Params
- **Connectable** `con`: The connectable instance.

#### Return
- **Object** An object containing the `x1`, `x2`, `y1` and `y2` coordinates.

### `update()`
Updates the line coordinates.

### `setLineColor(color, c)`
Sets the line color.

#### Params
- **String** `color`: The new color.
- **Connectable** `c`: The connectable instance.

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
