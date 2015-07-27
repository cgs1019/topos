goog.provide('topos.math.QuadTree');

goog.scope(function() {

var math = topos.math;

math.QuadTree = function(depth, parent, range, vertices) {
  this.parent = parent;
  this.range = range;
  this.active = true;
  this.visible = true;
  this.children = null;

  if (depth > 0) {
    this.active = false;
    this.children = [];
    // Generate children in counterclockwise order from bottom-left:
    // [sw, se, ne, nw]
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        this.children.push(
            new math.QuadTree(
              depth - 1,
              this,
              {
                l: range.l + ((i + j) % 2 + 0) * (range.r - range.l) / 2,
                r: range.l + ((i + j) % 2 + 1) * (range.r - range.l) / 2,
                f: range.f + (i + 0) * (range.b - range.f) / 2,
                b: range.f + (i + 1) * (range.b - range.f) / 2
              },
              vertices));
      }
    }
    this.bounding_box = math.Util.CombineBoundingBoxes(
        this.children[0].bounding_box,
        this.children[1].bounding_box,
        this.children[2].bounding_box,
        this.children[3].bounding_box);
  } else {
    this.bounding_box = math.Util.ComputeBoundingBox(
            vertices[range.l][range.f],
            vertices[range.r][range.f],
            vertices[range.l][range.b],
            vertices[range.r][range.b]);
  }
}

});  // goog.scope
