;(function() {

    var isInited = false;
    var marker = null;
    SVG.extend(SVG.Element, {
        connectable: function(options, elmTarget) {

            if (elmTarget === undefined) {
                elmTarget = options;
                options = {};
            }

            var elmSource = this;
            var line = options.container.line();
            var markers = options.markers;

            // Source and target positions
            var sPos = {};
            var tPos = {};

            function updateLine() {

                sPos = elmSource.transform();
                tPos = elmTarget.transform();

                line.attr({
                    x1: sPos.x,
                    y1: sPos.y,
                    x2: tPos.x,
                    y2: tPos.y
                });
            }

            if (isInited === false) {
                marker = markers.marker();
                marker.attr({
                    id: "triangle",
                    viewBox: "0 0 10 10",
                    refX: "0",
                    refY: "5",
                    markerUnits: "strokeWidth",
                    markerWidth: "4",
                    markerHeight: "5",
                    orient: "auto"
                });

                marker.path().attr({
                    d: "M 0 0 L 10 5 L 0 10 z"
                });

                isInited = true;
            }


            elmSource.dragmove = updateLine;
            elmTarget.dragmove = updateLine;

            return elmSource;
        }
    });
}).call(this);
