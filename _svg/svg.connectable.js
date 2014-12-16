;(function() {
    SVG.extend(SVG.Element, {
        connectable: function(options, elmTarget) {

            if (elmTarget === undefined) {
                elmTarget = options;
                options = {};
            }

            var elmSource = this;
            var line = options.container.line();

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

            elmSource.dragmove = updateLine;
            elmTarget.dragmove = updateLine;

            return elmSource;
        }
    });
}).call(this);
