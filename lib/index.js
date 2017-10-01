// Dependencies
var Id = require("idy")
  , SetOrGet = require("set-or-get")
  , IterateObject = require("iterate-object")
  , Deffy = require("deffy")
  ;

// Internal cache
var _connections = {}
  , _betweenTwoBubbles = {}
  , container = null
  , markers = null
  ;

/**
 * connectable
 * Connects two elements. If called multiple times, the lines will be curved.
 *
 * @name connectable
 * @function
 * @param {Object} options An object containing the following fields:
 *
 *  - `container` (SVGElement): The line elements container.
 *  - `markers` (SVGElement): The marker elements container.
 *  - `padEllipse` (Boolean): If `true`, the line coordinates will be placed with a padding.
 *
 * @param {SVGElement} elmTarget The target SVG element.
 * @return {Object} The connectable object containing:
 *
 *  - `source` (SVGElement): The source element.
 *  - `target` (SVGElement): The target element.
 *  - `line` (SVGElement): The line element.
 *  - `marker` (SVGElement): The marker element.
 *  - [`computeLineCoordinates` (Function)](#computelinecoordinatescon)
 *  - [`update` (Function)](#update)
 *  - [`setLineColor` (Function)](#setlinecolorcolor-c)
 */
function connectable(options, elmTarget) {

    var con = {};

    if (elmTarget === undefined) {
        elmTarget = options;
        options = {};
    }

    container = options.container || container;
    var elmSource = this;
    markers = options.markers || markers;

    options.k = options.k || 100;
    options.kk = options.kk || 10;

    var marker = markers.marker(10, 10)
      , markerId = "triangle-" + Id()
      , line = container.path().attr("marker-end", "url(#" + markerId + ")").fill("none")
      ;

    marker.attr({
        id: markerId,
        viewBox: "0 0 10 10",
        refX: "0",
        refY: "5",
        markerUnits: "strokeWidth",
        markerWidth: "4",
        markerHeight: "5"
    });

    marker.path().attr({
        d: "M 0 0 L 10 5 L 0 10 z"
    });

    // Source and target positions
    var sPos = {}
      , tPos = {}
      ;

    // Append the SVG elements
    con.source = elmSource;
    con.target = elmTarget;
    con.line = line;
    con.marker = marker;

    SetOrGet(_connections, con.source.id(), []).push(con);
    SetOrGet(_connections, con.target.id(), []).push(con);

    SetOrGet(_betweenTwoBubbles, {
        toString: function () {
            var ids = [con.source.id(), con.target.id()]
              , id1 = ids.join("->")
              , id2 = ids.reverse().join("->")
              ;

            con._ = con.id = id1;

            if (_betweenTwoBubbles[id2]) {
                con._ = id2;
                return id2;
            }

            con.id = id1;
            return id1;
        }
    }, []).push(con);

    /**
     * computeLineCoordinates
     * The function that computes the new coordinates.
     * It can be overriden with a custom function.
     *
     * @name computeLineCoordinates
     * @function
     * @param {Connectable} con The connectable instance.
     * @return {Object} An object containing the `x1`, `x2`, `y1` and `y2` coordinates.
     */
    con.computeLineCoordinates = function (cons) {

        var output = []
          , l = cons.length
          ;

        IterateObject(cons, function (con, i) {

            var sT = con.source.transform()
              , tT = con.target.transform()
              , sB = con.source.bbox()
              , tB = con.target.bbox()
              , x1 = sT.x + sB.width / 2
              , y1 = sT.y + sB.height / 2
              , x2 = tT.x + tB.width / 2
              , y2 = tT.y + tB.height / 2
              , cx = (x1 + x2) / 2
              , cy = (y1 + y2) / 2
              , dx = Math.abs((x1 - x2) / 2)
              , dy = Math.abs((y1 - y2) / 2)
              , dd = null
              , out = {
                    x1: x1
                  , y1: y1
                  , x2: x2
                  , y2: y2
                  , ex: x1
                  , ey: y1
                }
              ;

            if (i !== (l - 1) / 2) {
                dd = Math.sqrt(dx * dx + dy * dy);
                out.ex = cx + dy / dd * options.k * (i - (l - 1) / 2);
                out.ey = cy - dx / dd * options.k * (i - (l - 1) / 2);
            }
            output.push(out);
        });

        return output;
    };

    if (options.padEllipse) {
        con.computeLineCoordinates = function (cons) {

            var output = []
              , l = cons.length
              ;

            IterateObject(cons, function (con, i) {

                var elmS = con.source.node.querySelector("ellipse") || con.source.node.querySelector("circle")
                  , elmT = con.target.node.querySelector("ellipse") || con.target.node.querySelector("circle")
                  , xR1, xR2, yR1, yR2
                  , sT = con.source.transform()
                  , tT = con.target.transform()
                  , sB = con.source.bbox()
                  , tB = con.target.bbox()
                  ;

                if (elmS.tagName === "circle") {
                    xR1 = yR1 = parseFloat(elmS.getAttribute("r"));
                    xR2 = yR2 = parseFloat(elmT.getAttribute("r"));
                } else {
                    xR1 = parseFloat(elmS.getAttribute("rx"));
                    yR1 = parseFloat(elmS.getAttribute("ry"));

                    xR2 = parseFloat(elmT.getAttribute("rx"));
                    yR2 = parseFloat(elmT.getAttribute("ry"));
                }

                // Get centers
                var sx = sT.x + xR1 / 2
                  , sy = sT.y + yR1 / 2
                  , tx = tT.x + xR2 / 2
                  , ty = tT.y + yR2 / 2

                    // Calculate distance from source center to target center
                  , dx = tx - sx
                  , dy = ty - sy
                  , d = Math.sqrt(dx * dx + dy * dy)

                    // Construct unit vector between centers
                  , ux = dx / d
                  , uy = dy / d

                    // Point on source circle
                  , cx1 = sx + xR1 * ux
                  , cy1 = sy + yR1 * uy

                    // Point on target circle
                  , cx2 = sx + (d - xR2 - 5) * ux
                  , cy2 = sy + (d - yR2 - 5) * uy
                  ;

                var x1 = cx1 + xR1 / 2
                  , y1 = cy1 + yR1 / 2
                  , x2 = cx2 + xR2 / 2
                  , y2 = cy2 + yR2 / 2
                // TODO
                //  , step = (Math.PI / 2 / l) * (i % 2 !== 0 ? 1 : -1)
                //  , angle = 0
                  ;

                //if (i !== (l - 1) / 2) {
                //    angle = step * (i + 1);
                //}


                //var xC1 = (sT.x + xR1)
                //  , yC1 = (sT.y + yR1)
                //  , xC2 = (tT.y + xR2)
                //  , yC2 = (tT.y + yR2)
                //  , ddx1 = x1 - xC1
                //  , ddy1 = y1 - yC1
                //  , ddx2 = x2 - xC2
                //  , ddy2 = y2 - yC2
                //  , cosAngle = Math.cos(angle)
                //  , sinAngle = Math.sin(angle)
                //  , cosAngleM = Math.cos(-angle)
                //  , sinAngleM = Math.sin(-angle)
                //  ;

                // TODO This should change the points to arrange them on the circle
                //
                // x1 = ddx1 * cosAngle - ddy1 * sinAngle + xC1;
                // y1 = ddx1 * sinAngle + ddy1 * cosAngle + yC1;

                // x2 = ddx2 * cosAngleM - ddy2 * sinAngle + xC2;
                // y2 = ddx2 * sinAngleM + ddy2 * cosAngle + yC2;

                // ===================
                // x1 = cx1 + ddx1 * Math.cos(angle) - ddy1 * Math.sin(angle)
                // y1 = cy1 + ddx1 * Math.sin(angle) - ddy1 * Math.cos(angle)

                //x2 = cx2 + ddx2 * Math.cos(angle) - ddy2 * Math.sin(angle) + xR2
                //y2 = cy2 + ddx2 * Math.sin(angle) - ddy2 * Math.cos(angle) + yR2

                var cx = (x1 + x2) / 2
                  , cy = (y1 + y2) / 2
                  , dd = null
                  , out = {
                        x1: x1
                      , y1: y1
                      , x2: x2
                      , y2: y2
                      , ex: x1
                      , ey: y1
                    }
                  ;

                if (isNaN(out.x1)) {
                    out.x1 = sT.x + xR1 * 2;
                    out.y1 = sT.y + yR1 / 2
                    out.x2 = sT.x;
                    out.y2 = out.y1;
                    out.ex = (out.x1 + out.x2) / 2;
                    out.ey = out.y1 - (options.kk * (i + 1));
                } else {
                    dx = Math.abs((x1 - x2) / 2);
                    dy = Math.abs((y1 - y2) / 2);

                    if (i !== (l - 1) / 2) {
                        dd = Math.sqrt(dx * dx + dy * dy);
                        out.ex = cx + dy / dd * options.k * (i - (l - 1) / 2);
                        out.ey = cy - dx / dd * options.k * (i - (l - 1) / 2);
                    }
                }

                output.push(out);
            });

            return output;
        };
    }

    elmSource.cons = elmSource.cons || [];
    elmSource.cons.push(con);

    /**
     * update
     * Updates the line coordinates.
     *
     * @name update
     * @function
     */
    con.update = function () {
        var cons = Deffy(_betweenTwoBubbles[con._], [])
          , results = con.computeLineCoordinates(cons)
          ;

        IterateObject(results, function (r, i) {
            cons[i].line.plot(
                "M" + r.x1 + " " + r.y1
              + " Q" + r.ex + " " + r.ey
              + " " + r.x2 + " " + r.y2
            );
        });
    };

    con.update();
    elmSource.on("dragmove", con.update);
    elmTarget.on("dragmove", con.update);

    /**
     * setLineColor
     * Sets the line color.
     *
     * @name setLineColor
     * @function
     * @param {String} color The new color.
     * @param {Connectable} c The connectable instance.
     */
    con.setLineColor = function (color, c) {
        c = c || this;
        c.line.stroke(color);
        c.marker.fill(color);
    };

    return con;
}

if (typeof SVG === "function") {
    SVG.extend(SVG.Element, {
        connectable: connectable
    });
} else if (typeof window === "object") {
    throw new Error("SVG.js is not loaded but it is required.");
}

module.exports = connectable;
