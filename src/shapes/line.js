var assign = require("lodash/object/assign");
var Shape = require("../mixins/shape");
var Styles = require("../mixins/styles");
var Vector = require('../vector');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Line = function(x, y, x2, y2) {
  this.shape();
  this.styles();
  this.vars.x = x;
  this.vars.y = y;
  this.vars.x2 = x2;
  this.vars.y2 = y2;
}

assign(Line.prototype, Shape, Styles, {

  type: "line",

  copy: function(parent) {
    var copy = new Line();
    copy.vars.x2 = this.vars.x2;
    copy.vars.y2 = this.vars.y2;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    var start = new Vector(this.vars.x, this.vars.y)
    var end = new Vector(this.vars.x2, this.vars.y2)
    var vec = end.sub(start).multiply(scalar).add(start);
    this.vars.x2 = vec.x;
    this.vars.y2 = vec.y;
    this.changed();
    return this;
  },

  move: function(x, y, relative) {
    var change = new Vector(this.vars.x2, this.vars.y2).sub(new Vector(this.vars.x, this.vars.y));
    this.vars.x = relative ? this.vars.x + x : x;
    this.vars.y = relative ? this.vars.y + y : y;
    this.vars.x2 = this.vars.x + change.x;
    this.vars.y2 = this.vars.y + change.y;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      x1: Utils.s(this.vars.x),
      y1: Utils.s(this.vars.y),
      x2: Utils.s(this.vars.x2),
      y2: Utils.s(this.vars.y2)
    }
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('line', attr);
  }

});

module.exports = Line;
