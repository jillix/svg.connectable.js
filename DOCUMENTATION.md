## Documentation

You can see below the API reference of this module.

### `connectable(options, elmTarget)`
Connects two elements. If called multiple times, the lines will be curved.

#### Params

- **Object** `options`: An object containing the following fields:
 - `container` (SVGElement): The line elements container.
 - `markers` (SVGElement): The marker elements container.
 - `padEllipse` (Boolean): If `true`, the line coordinates will be placed with a padding.
- **SVGElement** `elmTarget`: The target SVG element.

#### Return
- **Object** The connectable object containing:
 - `source` (SVGElement): The source element.
 - `target` (SVGElement): The target element.
 - `line` (SVGElement): The line element.
 - `marker` (SVGElement): The marker element.
 - [`computeLineCoordinates` (Function)](#computelinecoordinatescon)
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

