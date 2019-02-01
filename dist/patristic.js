"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return root.patristic = factory();
    });
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.patristic = factory();
  }
})(typeof self !== 'undefined' ? self : void 0, function () {
  "use strict";
  /**
   * Patristic library version
   * @type {String}
   */

  var version = "0.2.3";
  /**
   * [Branch description]
   * @param       {[type]} data [description]
   * @constructor
   */

  function Branch(data) {
    Object.assign(this, {
      id: '',
      parent: null,
      length: 0,
      children: []
    }, data);
  }
  /**
   * [description]
   * @param  {[type]} length [description]
   * @return {[type]}        [description]
   */


  Branch.prototype.setLength = function (length) {
    this.length = length;
  };
  /**
   * [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */


  Branch.prototype.addChild = function (data) {
    var c;

    if (data instanceof Branch) {
      c = data;
      c.parent = this;
    } else {
      if (!data) data = {};
      c = new Branch(Object.assign(data, {
        parent: this
      }));
    }

    this.children.push(c);
    return c;
  };
  /**
   * [description]
   * @param  {[type]} data     [description]
   * @param  {[type]} siblings [description]
   * @return {[type]}          [description]
   */


  Branch.prototype.addParent = function (data, siblings) {
    var c;

    if (data instanceof Branch) {
      c = data;
    } else {
      if (!data) data = {};
      c = new Branch(Object.assign(data));
    }

    siblings.forEach(function (sib) {
      return sib.setParent(c);
    });
    c.children = [this].concat(siblings);
    this.parent = c;
    return c;
  };
  /**
   * [description]
   * @param  {[type]} child [description]
   * @return {[type]}       [description]
   */


  Branch.prototype.hasChild = function (child) {
    if (_typeof(child) === "object") child = child.id;
    return this.children.includes(child);
  };
  /**
   * [description]
   * @param  {[type]} child [description]
   * @return {[type]}       [description]
   */


  Branch.prototype.getChild = function (child) {
    if (_typeof(child) === "object") child = child.id;
    return this.children.find(function (c) {
      return c.id === child;
    });
  };
  /**
   * [description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */


  Branch.prototype.getDescendant = function (id) {
    var descendant;

    if (this.children) {
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];

        if (child.id === id) {
          descendant = child;
          break;
        }

        if (child.children) {
          descendant = child.getDescendant(id);
        }
      }
    }

    return descendant;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.getDescendants = function () {
    var descendants = [];

    if (this.children.length > 0) {
      this.children.forEach(function (child) {
        child.getDescendants().forEach(function (d) {
          return descendants.push(d);
        });
      });
    } else {
      return [this];
    }

    return descendants;
  };
  /**
   * [description]
   * @param  {[type]} descendant [description]
   * @return {[type]}            [description]
   */


  Branch.prototype.hasDescendant = function (descendant) {
    var any = false;
    var descendants = this.getDescendants();

    if (_typeof(descendant) === 'object') {
      descendants.forEach(function (d) {
        if (d === descendant) any = true;
      });
    } else {
      descendants.forEach(function (d) {
        if (d.id === descendant) any = true;
      });
    }

    return any;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.isRoot = function () {
    return this.parent === null;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.isLeaf = function () {
    return this.children.length === 0;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.getRoot = function () {
    var node = this;

    while (!node.isRoot()) {
      node = node.parent;
    }

    return node;
  };
  /**
   * [description]
   * @param  {[type]} parent [description]
   * @return {[type]}        [description]
   */


  Branch.prototype.isChildOf = function (parent) {
    if (_typeof(parent) === 'object') {
      return this.parent === parent;
    }

    return this.parent.id === parent;
  };
  /**
   * [description]
   * @param  {[type]} ancestor [description]
   * @return {[type]}          [description]
   */


  Branch.prototype.isDescendantOf = function (ancestor) {
    if (!ancestor || !this.parent) return false;
    if (this.parent === ancestor || this.parent.id === ancestor) return true;
    return this.parent.isDescendantOf(ancestor);
  };
  /**
   * [description]
   * @param  {[type]} child [description]
   * @return {[type]}       [description]
   */


  Branch.prototype.depthOf = function (child) {
    var distance = 0;
    if (typeof child === 'string') child = this.getDescendant(child);
    if (typeof child === 'undefined') return -1;
    var current = child;

    while (!current.isRoot()) {
      if (current === this) break;
      distance += current.length;
      current = current.parent;
    }

    return distance;
  };
  /**
   * [description]
   * @param  {[type]} a [description]
   * @param  {[type]} b [description]
   * @return {[type]}   [description]
   */


  Branch.prototype.distanceBetween = function (a, b) {
    var distance = -1;
    var descendants = this.getDescendants();
    if (typeof a == 'string') a = this.getDescendant(a);
    if (typeof b == 'string') b = this.getDescendant(b);

    if (descendants.includes(a) && descendants.includes(b)) {
      var node = a;

      while (!b.isDescendantOf(node)) {
        node = node.parent;
      }

      distance = node.depthOf(a) + node.depthOf(b);
    }

    return distance;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.remove = function () {
    var root = this.getRoot();
    this.isolate();
    return root;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.isolate = function () {
    var index = this.parent.children.indexOf(this);
    this.parent.children.splice(index, 1);
    this.setParent(null);
    return this;
  };
  /**
   * [description]
   * @param  {[type]} parent [description]
   * @return {[type]}        [description]
   */


  Branch.prototype.setParent = function (parent) {
    this.parent = parent;
    return this;
  };
  /**
   * [description]
   * @param  {boolean} nonrecursive [description]
   * @return {[type]}              [description]
   */


  Branch.prototype.fixParenthood = function (nonrecursive) {
    var _this = this;

    this.children.forEach(function (child) {
      if (!child.parent) child.parent = _this;
      if (child.parent !== _this) child.parent = _this;

      if (!nonrecursive && child.children.length > 0) {
        child.fixParenthood();
      }
    });
  };
  /**
   * [description]
   * @return {Branch} The new root branch
   */


  Branch.prototype.reroot = function () {
    if (this.isRoot()) return this;
    if (this.parent.isRoot()) return this.parent;
    var newRoot = this.isLeaf() ? this.parent : this;

    while (!newRoot.isRoot()) {
      newRoot.invert();
    }

    return newRoot;
  };
  /**
   * Swaps a child with its parent.
   * @return {Branch} The branch object on which it was called.
   */


  Branch.prototype.invert = function () {
    var oldParent = this.parent;

    if (oldParent) {
      this.parent = oldParent.parent;
      this.children.push(oldParent);
      oldParent.parent = this;
      oldParent.children.splice(oldParent.children.indexOf(this), 1);
    }

    return this;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.isConsistent = function () {
    var _this2 = this;

    if (!this.isRoot()) {
      if (!this.parent.children.includes(this)) return false;
    }

    if (!this.isLeaf()) {
      if (this.children.some(function (c) {
        return c.parent !== _this2;
      })) return false;
      return this.children.every(function (c) {
        return c.isConsistent();
      });
    }

    return true;
  };

  Branch.prototype.clone = function () {
    return this;
  };
  /**
   * [description]
   * @param  {[type]} sortfn [description]
   * @return {[type]}        [description]
   */


  Branch.prototype.reorder = function (sortfn) {
    if (!sortfn) sortfn = function sortfn(a, b) {
      if (a.length < b.length) return 1;
      if (a.length > b.length) return -1;
      return String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0;
    };
    var x = new Array();
    var i,
        node = this.getRoot(); // get depth

    node.depth = 0;

    for (i = node.length - 2; i >= 0; --i) {
      var q = node[i];
      q.depth = q.parent.depth + 1;
      if (q.children.length == 0) x.push(q);
    }

    x.sort(sortfn);

    for (i = 0; i < x.length; ++i) {
      x[i].weight = i, x[i].n_tips = 1;
    } // set weight for internal nodes


    for (i = 0; i < node.length; ++i) {
      var _q = node[i];

      if (_q.children.length) {
        // internal
        var j = void 0,
            n = 0,
            w = 0;

        for (j = 0; j < _q.children.length; ++j) {
          n += _q.children[j].n_tips;
          w += _q.children[j].weight;
        }

        _q.n_tips = n;
        _q.weight = w;
      }
    } // swap children


    for (i = 0; i < node.length; ++i) {
      if (node[i].children.length >= 2) {
        node[i].children.sort(sortfn);
      }
    }

    return this;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.toMatrix = function () {
    var descendants = this.getDescendants();
    var n = descendants.length;
    var matrix = new Array(n);

    for (var i = 0; i < n; i++) {
      matrix[i] = new Array(n);
      matrix[i][i] = 0;

      for (var j = 0; j < i; j++) {
        var distance = this.distanceBetween(descendants[i], descendants[j]);
        matrix[i][j] = distance;
        matrix[j][i] = distance;
      }
    }

    return matrix;
  };
  /**
   * [description]
   * @param  {[type]} nonterminus [description]
   * @return {[type]}             [description]
   */


  Branch.prototype.toNewick = function (nonterminus) {
    var out = '';
    if (this.id === '') out += '(';else out += this.id;
    out += this.children.map(function (child) {
      return child.toNewick(true);
    }).join(',');
    if (this.id === '') out += ')';
    if (this.length) out += ':' + numberToString(this.length);
    if (!nonterminus) out += ';';
    return out;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.toObject = function () {
    var output = {
      id: this.id,
      length: this.length
    };
    if (this.children.length > 0) output.children = this.children.map(function (c) {
      return c.toObject();
    });
    return output;
  };
  /**
   * [description]
   * @return {[type]} [description]
   */


  Branch.prototype.toJSON = function () {
    return JSON.stringify(this.toObject());
  };

  function numberToString(num) {
    var numStr = String(num);

    if (Math.abs(num) < 1.0) {
      var e = parseInt(num.toString().split('e-')[1]);

      if (e) {
        var negative = num < 0;
        if (negative) num *= -1;
        num *= Math.pow(10, e - 1);
        numStr = '0.' + new Array(e).join('0') + num.toString().substring(2);
        if (negative) numStr = "-" + numStr;
      }
    } else {
      var _e = parseInt(num.toString().split('+')[1]);

      if (_e > 20) {
        _e -= 20;
        num /= Math.pow(10, _e);
        numStr = num.toString() + new Array(_e + 1).join('0');
      }
    }

    return numStr;
  }
  /**
   * [description]
   * @param  {[type]} json          [description]
   * @param  {[type]} idLabel       [description]
   * @param  {[type]} lengthLabel   [description]
   * @param  {[type]} childrenLabel [description]
   * @return {[type]}               [description]
   */


  function parseJSON(json, idLabel, lengthLabel, childrenLabel) {
    if (!idLabel) idLabel = 'id';
    if (!lengthLabel) lengthLabel = 'length';
    if (!childrenLabel) childrenLabel = 'children';
    if (typeof json === 'string') json = JSON.parse(json);
    var root = new Branch({
      id: json[idLabel],
      length: json[lengthLabel]
    });

    if (json[childrenLabel] instanceof Array) {
      json[childrenLabel].forEach(function (child) {
        root.addChild(patristic.parseJSON(child));
      });
    }

    return root;
  }
  /**
   * Parses a matrix of distances and returns the root Branch of the output tree
   * Note that this is adapted from Maciej Korzepa's neighbor-joining, which is
   * released for modification under the MIT License.
   * @param  {Array} matrix An array of n arrays of length n
   * @param  {Array} labels An array of strings corresponding to the values in matrix
   * @return {Branch} A Branch object representing the root node of the tree inferred by neighbor joining on matrix
   */


  function parseMatrix(matrix, labels) {
    var that = {};
    var N = that.N = matrix.length;
    if (!labels) labels = _toConsumableArray(Array(N).keys());
    that.cN = that.N;
    that.D = matrix;
    that.labels = labels;
    that.labelToTaxon = {};
    that.currIndexToLabel = new Array(N);
    that.rowChange = new Array(N);
    that.newRow = new Array(N);
    that.labelToNode = new Array(2 * N);
    that.nextIndex = N;
    that.I = new Array(that.N);
    that.S = new Array(that.N);

    for (var i = 0; i < that.N; i++) {
      var sortedRow = sortWithIndices(that.D[i], i, true);
      that.S[i] = sortedRow;
      that.I[i] = sortedRow.sortIndices;
    }

    that.removedIndices = new Set();
    that.indicesLeft = new Set();

    for (var _i = 0; _i < N; _i++) {
      that.currIndexToLabel[_i] = _i;
      that.indicesLeft.add(_i);
    }

    that.rowSumMax = 0;
    that.PNewick = "";
    var minI, minJ, d1, d2, l1, l2, node1, node2, node3;

    function setUpNode(labelIndex, distance) {
      var node;

      if (labelIndex < that.N) {
        node = new Branch({
          id: that.labels[labelIndex],
          length: distance
        });
        that.labelToNode[labelIndex] = node;
      } else {
        node = that.labelToNode[labelIndex];
        node.setLength(distance);
      }

      return node;
    }

    that.rowSums = sumRows(that.D);

    for (var _i2 = 0; _i2 < that.cN; _i2++) {
      if (that.rowSums[_i2] > that.rowSumMax) that.rowSumMax = that.rowSums[_i2];
    }

    while (that.cN > 2) {
      //if (that.cN % 100 == 0 ) console.log(that.cN);
      var _search = search(that);

      minI = _search.minI;
      minJ = _search.minJ;
      d1 = 0.5 * that.D[minI][minJ] + (that.rowSums[minI] - that.rowSums[minJ]) / (2 * that.cN - 4);
      d2 = that.D[minI][minJ] - d1;
      l1 = that.currIndexToLabel[minI];
      l2 = that.currIndexToLabel[minJ];
      node1 = setUpNode(l1, d1);
      node2 = setUpNode(l2, d2);
      node3 = new Branch({
        children: [node1, node2]
      });
      recalculateDistanceMatrix(that, minI, minJ);
      var sorted = sortWithIndices(that.D[minJ], minJ, true);
      that.S[minJ] = sorted;
      that.I[minJ] = sorted.sortIndices;
      that.S[minI] = that.I[minI] = [];
      that.cN--;
      that.labelToNode[that.nextIndex] = node3;
      that.currIndexToLabel[minI] = -1;
      that.currIndexToLabel[minJ] = that.nextIndex++;
    }

    var left = that.indicesLeft.values();
    minI = left.next().value;
    minJ = left.next().value;
    l1 = that.currIndexToLabel[minI];
    l2 = that.currIndexToLabel[minJ];
    d1 = d2 = that.D[minI][minJ] / 2;
    node1 = setUpNode(l1, d1);
    node2 = setUpNode(l2, d2);
    var tree = new Branch({
      children: [node1, node2]
    });
    tree.fixParenthood();
    return tree;
  }

  function search(t) {
    var qMin = Infinity,
        D = t.D,
        cN = t.cN,
        n2 = cN - 2,
        S = t.S,
        I = t.I,
        rowSums = t.rowSums,
        removedColumns = t.removedIndices,
        uMax = t.rowSumMax,
        q,
        minI = -1,
        minJ = -1,
        c2; // initial guess for qMin

    for (var r = 0; r < t.N; r++) {
      if (removedColumns.has(r)) continue;
      c2 = I[r][0];
      if (removedColumns.has(c2)) continue;
      q = D[r][c2] * n2 - rowSums[r] - rowSums[c2];

      if (q < qMin) {
        qMin = q;
        minI = r;
        minJ = c2;
      }
    }

    for (var _r = 0; _r < t.N; _r++) {
      if (removedColumns.has(_r)) continue;

      for (var c = 0; c < S[_r].length; c++) {
        c2 = I[_r][c];
        if (removedColumns.has(c2)) continue;
        if (S[_r][c] * n2 - rowSums[_r] - uMax > qMin) break;
        q = D[_r][c2] * n2 - rowSums[_r] - rowSums[c2];

        if (q < qMin) {
          qMin = q;
          minI = _r;
          minJ = c2;
        }
      }
    }

    return {
      minI: minI,
      minJ: minJ
    };
  }

  function recalculateDistanceMatrix(t, joinedIndex1, joinedIndex2) {
    var D = t.D,
        n = D.length,
        sum = 0,
        aux,
        aux2,
        removedIndices = t.removedIndices,
        rowSums = t.rowSums,
        newRow = t.newRow,
        rowChange = t.rowChange,
        newMax = 0;
    removedIndices.add(joinedIndex1);

    for (var i = 0; i < n; i++) {
      if (removedIndices.has(i)) continue;
      aux = D[joinedIndex1][i] + D[joinedIndex2][i];
      aux2 = D[joinedIndex1][joinedIndex2];
      newRow[i] = 0.5 * (aux - aux2);
      sum += newRow[i];
      rowChange[i] = -0.5 * (aux + aux2);
    }

    for (var _i3 = 0; _i3 < n; _i3++) {
      D[joinedIndex1][_i3] = -1;
      D[_i3][joinedIndex1] = -1;
      if (removedIndices.has(_i3)) continue;
      D[joinedIndex2][_i3] = newRow[_i3];
      D[_i3][joinedIndex2] = newRow[_i3];
      rowSums[_i3] += rowChange[_i3];
      if (rowSums[_i3] > newMax) newMax = rowSums[_i3];
    }

    rowSums[joinedIndex1] = 0;
    rowSums[joinedIndex2] = sum;
    if (sum > newMax) newMax = sum;
    t.rowSumMax = newMax;
    t.indicesLeft.delete(joinedIndex1);
  }

  function sumRows(a) {
    var n = a.length,
        sums = new Array(n);

    for (var i = 0; i < n; i++) {
      var sum = 0;

      for (var j = 0; j < n; j++) {
        var v = parseFloat(a[i][j]);
        if (typeof v !== 'number') continue;
        sum += a[i][j];
      }

      sums[i] = sum;
    }

    return sums;
  }

  function sortWithIndices(toSort, skip) {
    if (typeof skip === 'undefined') skip = -1;
    var n = toSort.length;
    var indexCopy = new Array(n);
    var valueCopy = new Array(n);
    var i2 = 0;

    for (var i = 0; i < n; i++) {
      if (toSort[i] === -1 || i === skip) continue;
      indexCopy[i2] = i;
      valueCopy[i2++] = toSort[i];
    }

    indexCopy.length = i2;
    valueCopy.length = i2;
    indexCopy.sort(function (a, b) {
      return toSort[a] - toSort[b];
    });
    valueCopy.sortIndices = indexCopy;

    for (var j = 0; j < i2; j++) {
      valueCopy[j] = toSort[indexCopy[j]];
    }

    return valueCopy;
  }
  /**
    * Parses a Newick String and returns a Branch object representing the root
    * of the output Tree.
    * Note that this is adapted Jason Davies' newick.js, which is released for
    * modification under the MIT License.
    * @param  {string} newick A Newick String
    * @return {Branch}        A Branch representing the root of the output
    */


  function parseNewick(newick) {
    var ancestors = [],
        tree = new Branch(),
        tokens = newick.split(/\s*(;|\(|\)|,|:)\s*/),
        n = tokens.length;

    for (var t = 0; t < n; t++) {
      var token = tokens[t];
      var c = void 0;

      switch (token) {
        case "(":
          // new branchset
          c = tree.addChild();
          ancestors.push(tree);
          tree = c;
          break;

        case ",":
          // another branch
          c = ancestors[ancestors.length - 1].addChild();
          tree = c;
          break;

        case ")":
          // optional name next
          tree = ancestors.pop();
          break;

        case ":":
          // optional length next
          break;

        default:
          var x = tokens[t - 1];

          if (x == ')' || x == '(' || x == ',') {
            tree.id = token;
          } else if (x == ':') {
            tree.length = parseFloat(token);
          }

      }
    }

    return tree;
  }

  return {
    version: version,
    Branch: Branch,
    parseJSON: parseJSON,
    parseMatrix: parseMatrix,
    parseNewick: parseNewick
  };
});

