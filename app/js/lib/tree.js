'use strict'

const _ = require('lodash');

class Tree {
  constructor(el) {
    var self = this;
    this.tree = el;

    this.tree.jstree({
      'core': {
        'check_callback': true,
        'multiple': false,
        'animation': 0,
        'themes': {'responsive': true}
      },
      'plugins': ['contextmenu', 'unique', 'types', 'state']
    });

    this.tree
        .bind(
            'loading.jstree',
            function(e, data) {
              log.info('Device tree loading....');
            })
        .bind(
            'load_all.jstree',
            function(e, data) {
              log.info('Device tree loaded');
            })
        .bind(
            'ready.jstree',
            function(e, data) {
              log.info('Device tree ready');
            })
        .bind(
            'hover_node.jstree',
            function(e, data) {
              self.onHover(e, data);
            })
        .bind('select_node.jstree', function(e, data) {
          self.onSelectNode(e, data);
        });
  }

  addNode(parent, data) {
    return this.tree.jstree().create_node(parent, data);
  }

  disableNode(id) {
    return this.tree.jstree().disable_node(id);
  }

  setParentNodeTreeId(parent) {
    this.tree.parentNodeId = parent;
  }

  setNodeTreeId(nodeId) {
    this.tree.nodeId = nodeId;
  }

  getTreeNode() {
    return {
      'text': `${this.name}`, 'icon': this.tree.icon
    }
  }

  onHover(e, data) {
    // console.log(e, data);
  }

  getNode(id) {
    return this.tree.jstree().get_node(id);
  }

  openNode(node) {
    this.tree.jstree().open_node(node);
  }

  expand(id) {
    var root = this.getNode(id);
    var top = root.children[0];
    this.openNode(top);
  }
}

exports.Tree = Tree
