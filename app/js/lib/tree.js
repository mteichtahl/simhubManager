'use strict'

const _ = require('lodash')

class Tree {
  constructor (el) {
    this.tree = el
    this.tree.jstree({
      'core': {
        'check_callback': true,
        'multiple': false,
        'animation': 0,
        'themes': {
          'responsive': false
        }
      },
      'plugins': ['contextmenu', 'unique', 'types', 'state']
    })
  }

  addNode (parent, data) {
    return this.tree.jstree().create_node(parent, data)
  }

  disableNode (id) {
    return this.tree.jstree().disable_node(id)
  }
}

exports.Tree = Tree
