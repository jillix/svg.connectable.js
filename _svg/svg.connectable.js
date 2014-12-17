;(function() {

    var container = null;
    var markers = null;

    SVG.extend(SVG.Element, {
        connectable: function(options, elmTarget) {

            if (elmTarget === undefined) {
                elmTarget = options;
                options = {};
            }

            container = container || options.container;
            var elmSource = this;
            markers = markers || options.markers;

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

            function updateLine() {

                sPos = elmSource.transform();
                tPos = elmTarget.transform();

                var x1 = sPos.x;
                var y1 = sPos.y;
                var x2 = tPos.x;
                var y2 = tPos.y;

                var dx = x2 - x1;
                var dy = y2 - y1;

                if (Math.abs(dy) < 200) {
                    if (dx < 0) {
                        x1 -= 25;
                        x2 += 30;
                    } else {
                        x2 -= 30;
                        x1 += 25;
                    }
                } else {
                    if (dy < 0) {
                        y1 -= 25;
                        y2 += 30;
                    } else {
                        y2 -= 30;
                        y1 += 25;
                    }
                }

                line.attr({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
            }

            updateLine();

            elmSource.dragmove = updateLine;
            elmTarget.dragmove = updateLine;

            return {
                source: elmSource,
                target: elmTarget,
                line: line,
                marker: marker
            };
        }
    });
}).call(this);
