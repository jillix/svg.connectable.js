window.addEventListener("load", function () {
    var svg = new SVG(document.querySelector(".graph")).size("100%", 500);

    // Plain draggy
    svg.rect(70, 100)
       .center(70, 90)
       .fill("#388E3C")
       .draggy()
       ;

    // Grouped draggy
    var group = svg.group().draggy();
    group.rect(100, 100).center(180, 90).fill("#4CAF50");
    group.rect(100, 100).center(180, 200).fill("#C8E6C9");

    // Constraind with object
    var elm = svg.rect(100,100).fill("#8BC34A").center(290, 90).draggy({
        minX: 200
      , minY: 50
      , maxX: 600
      , maxY: 200
    });

    var s = null
      , t = null
      ;

    elm.on("dragstart", function() {
      s = elm.clone().opacity(0.2);
    });

    elm.on("dragmove", function() {
      s.animate(200, '>').move(elm.x(), elm.y());
    });

    elm.on("dragend", function() {
      s.remove();
    });

    // Constraind with function
    svg.rect(100,100).fill("#009688").center(70, 220).draggy(function(x, y) {
        return {
            x: x < 400
          , y: y < 300
        };
    });
});
