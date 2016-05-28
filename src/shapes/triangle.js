var assign = require("lodash/object/assign");
var Shape = require("../mixins/shape");
var Styles = require("../mixins/styles");
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Triangle = function(x, y, x2, y2, x3, y3) {
  this.shape();
  this.styles();
  this.vars.x = x;
  this.vars.y = y;

  // Make variables relative to 0,0 as
  // x,y will be used in transform
  this.vars.x2 = x2 - x;
  this.vars.y2 = y2 - y;
  this.vars.x3 = x3 - x;
  this.vars.y3 = y3 - y;
}

Triangle.prototype = {

  copy: function(parent) {
    var copy = new Triangle();
    copy.vars.x2 = this.vars.x2;
    copy.vars.y2 = this.vars.y2;
    copy.vars.x3 = this.vars.x3;
    copy.vars.y3 = this.vars.y3;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  scale: function(scalar) {
    this.scaleStyles(scalar);
    this.vars.x2 *= scalar;
    this.vars.y2 *= scalar;
    this.vars.x3 *= scalar;
    this.vars.y3 *= scalar;
    this.changed();
    return this;
  },

  render: function(opts) {
    var attr = {
      points: '0 0 ' + this.vars.x2 + ' ' + this.vars.y2 + ' ' + this.vars.x3 + ' ' + this.vars.y3
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('polygon', attr);
  }

}

assign(Triangle.prototype, Shape, Styles, {type: "triangle"});

module.exports = Triangle;
