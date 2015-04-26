/*!
 * SVG.js Connectable Plugin
 * =========================
 *
 * A JavaScript library for connecting SVG things.
 * Created with <3 and JavaScript by the jillix developers.
 *
 * svg.connectable.js 1.0.1
 * Licensed under the MIT license.
 * */
;(function() {

    var container = null;
    var markers = null;

    /**
     * connectable
     * Connects two elements.
     *
     * @name connectable
     * @function
     * @param {Object} options An object containing the following fields:
     *
     *  - `container` (SVGElement): The line elements container.
     *  - `markers` (SVGElement): The marker elements container.
     *
     * @param {SVGElement} elmTarget The target SVG element.
     * @return {Object} The connectable object containing:
     *
     *  - `source` (SVGElement): The source element.
     *  - `target` (SVGElement): The target element.
     *  - `line` (SVGElement): The line element.
     *  - `marker` (SVGElement): The marker element.
     *  - `padEllipe` (Boolean): If `true`, the line coordinates will be placed with a padding.
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

        var marker = markers.marker(10, 10);
        var markerId = "triangle-" + Math.random().toString(16);
        var line = container.line().attr("marker-end", "url(#" + markerId + ")");

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
        var sPos = {};
        var tPos = {};

        // Append the SVG elements
        con.source = elmSource;
        con.target = elmTarget;
        con.line = line;
        con.marker = marker;

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
        con.computeLineCoordinates = function (con) {

            var sPos = con.source.bbox();
            var tPos = con.target.bbox();

            var x1 = sPos.x + sPos.width / 2;
            var y1 = sPos.y + sPos.height / 2;
            var x2 = tPos.x + tPos.width / 2;
            var y2 = tPos.y + tPos.height / 2;

            return {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
        };

        if (options.padEllipse) {
            con.computeLineCoordinates = function (con) {
                var sPos = con.source.transform();
                var tPos = con.target.transform();

                // Get ellipse radiuses
                var xR1 = parseFloat(con.source.node.querySelector("ellipse").getAttribute("rx"));
                var yR1 = parseFloat(con.source.node.querySelector("ellipse").getAttribute("ry"));

                var xR2 = parseFloat(con.source.node.querySelector("ellipse").getAttribute("rx"));
                var yR2 = parseFloat(con.source.node.querySelector("ellipse").getAttribute("ry"));
                
                // Get centers
                var sx = sPos.x + xR1 / 2;
                var sy = sPos.y + yR1 / 2;

                var tx = tPos.x + xR2 / 2;
                var ty = tPos.y + yR2 / 2;

                // Calculate distance from source center to target center
                var dx = tx - sx;
                var dy = ty - sy;
                var d = Math.sqrt(dx * dx + dy * dy);

                // Construct unit vector between centers
                var ux = dx / d;
                var uy = dy / d;

                // Point on source circle
                var x1 = sx + xR1 * ux;
                var y1 = sy + yR1 * uy;

                // Point on target circle
                var x2 = sx + (d - xR2 - 5) * ux;
                var y2 = sy + (d - yR2 - 5) * uy;

                return {
                    x1: x1 + xR1 / 2,
                    y1: y1 + yR1 / 2,
                    x2: x2 + xR2 / 2,
                    y2: y2 + yR2 / 2
                };
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
         * @return {undefined}
         */
        con.update = function () {
            line.attr(con.computeLineCoordinates(con));
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
         * @return {undefined}
         */
        con.setLineColor = function (color, c) {
            c = c || this;
            c.line.stroke(color);
            c.marker.fill(color);
        };

        return con;
    }

    SVG.extend(SVG.Element, {
        connectable: connectable
    });
}).call(this);
