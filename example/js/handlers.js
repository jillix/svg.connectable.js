$(document).ready(function () {
    var svg = new SVG($(".graph").get(0)).size("100%", 900);
    var links = svg.group();
    var markers = svg.group();
    var nodes = svg.group();

    var g1 = nodes.group().translate(300, 200).draggable();
    g1.circle(80).fill("#C2185B");

    var g2 = nodes.group().translate(100, 200).draggable();
    g2.circle(50).fill("#E91E63");

    var g3 = nodes.group().translate(200, 400).draggable();
    g3.circle(100).fill("#FF5252");

    g1.connectable({
        container: links,
        markers: markers
    }, g2).setLineColor("#5D4037");

    g2.connectable({
        padEllipse: true
    }, g3).setLineColor("#5D4037")
});
