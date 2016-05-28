var assign = require("lodash/object/assign");
var Shape = require("../mixins/shape");
var Box = require("../mixins/box");
var Styles = require("../mixins/styles");
var Polygon = require('./polygon');
var Utils = require('../utils');
var svg = require('virtual-dom/virtual-hyperscript/svg');

var Ellipse = function(x, y, width, height) {
  this.shape();
  this.box();
  this.styles();
  this.vars.x = x;
  this.vars.y = y;
  this.vars.width = width;
  this.vars.height = height;
}

Ellipse.prototype = {

  toPolygon: function(opts, parent) {

    var numVectors = 16;

    // if we're calculating the number of vectors based on spacing
    // find circumference and divide by spacing.
    if(opts && opts.spacing) {
      var circumference = Math.PI * (this.vars.width+this.vars.height);
      numVectors = circumference / opts.spacing;
    }

    var vectorAngle = 360/numVectors;

    var poly =  new Polygon(this.vars.x, this.vars.y);
    for(var i = 0; i < numVectors; i++) {
      var x = Math.cos(Utils.radians(i * vectorAngle)) * this.vars.width;
      var y = Math.sin(Utils.radians(i * vectorAngle)) * this.vars.height;
      poly.lineTo(x, y);
    }

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  },

  scale: function(scalar) {
    this.scaleBox(scalar);
    this.scaleStyles(scalar);
    this.changed();
    return this;
  },

  copy: function(parent) {
    var copy = new Ellipse();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  },

  render: function(opts) {
    var attr = {
      cx: Utils.s(this.vars.x),
      cy: Utils.s(this.vars.y),
      rx: Utils.s(this.vars.width / 2),
      ry: Utils.s(this.vars.height / 2)
    }
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('ellipse', attr);
  }

}

assign(Ellipse.prototype, Shape, Box, Styles, {type: "ellipse"});

module.exports = Ellipse;
