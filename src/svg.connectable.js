/*!
 * SVG.js Connectable Plugin
 * =========================
 *
 * A JavaScript library for connecting SVG things.
 * Created with <3 and JavaScript by the jillix developers.
 *
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
     *  - [`computeLineCoordinates` (Function)](#concomputeLineCoordinatescon)
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

            var sPos = con.source.transform();
            var tPos = con.target.transform();

            var x1 = sPos.x;
            var y1 = sPos.y;
            var x2 = tPos.x;
            var y2 = tPos.y;

            return {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
        };

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
