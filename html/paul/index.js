
// See: https://github.com/andrejewski/paul

function Paul(walkFn) {
  if(!(this instanceof Paul)) {
    return new Paul(walkFn)
  }
  let walker = this.walker = Paul.walker(walkFn)

  this.map = Paul.map(walker)
  this.filter = Paul.filter(walker)
  this.where = Paul.where(walker)

  let depthIter = this.depthIterator = Paul.depthIterator(walker)
  let breadthIter = this.breadthIterator = Paul.breadthIterator(walker)

  let methods = ['forEach', 'find', 'findWhere', 'reduce', 'parent']
  for(let i = 0; i < methods.length; i++) {
    let method = methods[i]
    let Method = cap(method)

    this['depth'+Method] = Paul[method](depthIter)
    this['breadth'+Method] = Paul[method](breadthIter)
  }

  this.depthSiblings = Paul.siblings(walker, depthIter)
  this.breadthSiblings = Paul.siblings(walker, breadthIter)
}

Paul.walker = function walker(walkFn) {
  let thisWalker = Array.isArray(walkFn)
    ? function(node, walk) {
      for(let i = 0; i < walkFn.length; i++) {
        let key = walkFn[i]
        if(deepHas(node, key)) walk(key)
      }
    }
    : walkFn

  return function(tree) {
    let steps = [] // [[String key, Node node]]
    thisWalker(tree, function(prop, node) {
      if(node === void 0) {
        steps.push([prop, deepGet(tree, prop)])
      } else {
        steps.push([prop, node])
      }
    })
    return steps
  }
}

Paul.map = function map(walker) {
  return function _map(node, func) {
    let steps = walker(node)
    let notKeys = []
    for(let i = 0; i < steps.length; i++) {
      notKeys.push(steps[i][0])
    }
    let ret = func(deepCopy(node, notKeys))
    for(let i = 0; i < steps.length; i++) {
      let kid
      let prop = steps[i][0]
      let child = steps[i][1]
      if(Array.isArray(child)) {
        kid = []
        for(let j = 0; j < child.length; j++) {
          kid.push(this.map(child[j], func))
        }
      } else {
        kid = this.map(child, func)
      }
      deepSet(ret, prop, kid)
    }
    return ret
  }
}

Paul.filter = function filter(walker) {
  return function _filter(node, func) {
    if(!func(node)) return undefined
    let steps = walker(node)
    let notKeys = []
    for(let i = 0; i < steps.length; i++) {
      notKeys.push(steps[i][0])
    }
    let ret = deepCopy(node, notKeys)
    for(let i = 0; i < steps.length; i++) {
      let kid = null
      let prop = steps[i][0]
      let child = steps[i][1]
      if(Array.isArray(child)) {
        kid = []
        for(let j = 0; j < child.length; j++) {
          let son = child[j]
          if(_filter(son, func)) kid.push(son)
        }
      } else if(_filter(child, func)) {
        kid = child
      }
      deepSet(ret, prop, kid)
    }
    return ret
  }
}

Paul.where = function where(walker) {
  return function _where(node, obj) {
    return Paul.filter(walker)(node, whereFilter(obj))
  }
}

function getChildren(walker, node) {
  let children = []
  let steps = walker(node)
  for(let i = 0; i < steps.length; i++) {
    children = children.concat(steps[i][1])
  }
  return children
}

Paul.depthIterator = function depthIterator(walker) {
  return function _depthIterator(tree) {
    let levels = [[tree]]
    let sweeps = [0]

    function fromEnd(arr, i) {
      return arr[arr.length - 1 - i]
    }

    return {
      next: function next() {
        if(!sweeps.length) return { done: true }
        let nodes = fromEnd(levels, 0)
        let index = fromEnd(sweeps, 0)
        if(index < nodes.length) {
          sweeps[sweeps.length - 1]++

          let adults = fromEnd(levels, 1)
          let parent = adults
            ? adults[fromEnd(sweeps, 1) - 1]
            : undefined

          let children = getChildren(walker, nodes[index])
          if(children.length) {
            levels.push(children)
            sweeps.push(0)
          }

          return {
            done: false,
            value: nodes[index],
            parent: parent
          }
        } else {
          levels.pop()
          sweeps.pop()
          return next()
        }
      }
    }
  }
}

Paul.breadthIterator = function breadthIterator(walker) {
  return function _breadthIterator(tree) {
    let elder = undefined
    let nodes = []
    let index = 0

    let subnodes = [tree]
    let subindex = 0

    let level = [tree]

    return {
      next: function next() {
        if(subindex < subnodes.length) {
          return {
            done: false,
            value: subnodes[subindex++],
            parent: elder
          }
        } else if(index < nodes.length) {
          elder = nodes[index++]
          subnodes = getChildren(walker, elder)
          subindex = 0

          level = level.concat(subnodes)
          return next()
        } else {
          if(!level.length) {
            return { done: true }
          }

          nodes = level
          index = 0
          level = []
          return next()
        }
      }
    }
  }
}

Paul.forEach = function forEach(iterator) {
  return function _forEach(tree, func) {
    let iter = iterator(tree)
    let res
    while(!(res = iter.next()).done) {
      func(res.value, res.parent, tree)
    }
  }
}

Paul.find = function find(iterator) {
  return function _find(tree, func) {
    let iter = iterator(tree)
    let res
    while(!(res = iter.next()).done) {
      if(func(res.value, res.parent, tree)) return res.value
    }
    return undefined
  }
}

Paul.findWhere = function findWhere(iterator) {
  return function _findWhere(tree, obj) {
    return Paul.find(iterator)(tree, whereFilter(obj))
  }
}

Paul.reduce = function reduce(iterator) {
  return function _reduce(tree, func, memo) {
    let iter = iterator(tree)
    let res
    while(!(res = iter.next()).done) {
      if(memo === void 0) {
        memo = res.value
      } else {
        memo = func(memo, res.value, res.parent, tree)
      }
    }
    return memo
  }
}

Paul.parent = function parent(iterator) {
  return function _parent(tree, node) {
    if(node !== tree) {
      let iter = iterator(tree)
      let res
      while(!(res = iter.next()).done) {
        if(res.value === node) {
          return res.parent
        }
      }
    }
    return undefined
  }
}

Paul.siblings = function siblings(walker, iterator) {
  return function _siblings(tree, node) {
    let parent = Paul.parent(iterator)(tree, node)
    if(parent) {
      let steps = walker(parent)
      for(let i = 0; i < steps.length; i++) {
        let nodes = steps[i][1]
        if(Array.isArray(nodes)) {
          let index = nodes.indexOf(node)
          if(~index) return {
            left: nodes.slice(0, index),
            right: nodes.slice(index + 1)
          }
        }
      }
    }
    return undefined
  }
}

Paul.walk = function walk(node, func) {
  function _walk(node) {
    let rest = Array.prototype.slice.call(arguments, 1)
    if(Array.isArray(node)) {
      let nodes = []
      for(let i = 0; i < node.length; i++) {
        nodes.push(func.apply(null, [node[i], _walk].concat(rest)))
      }
      return nodes
    }
    return func.apply(null, [node, _walk].concat(rest))
  }

  if(func === void 0) {
    func = node
    return _walk
  }

  let rest = Array.prototype.slice.call(arguments, 2)
  return _walk.apply(null, [node].concat(rest))
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function deepCopy(obj, notKeys) {
  let ret = {}
  for(let key in obj) {
    if(obj.hasOwnProperty(key) && !~notKeys.indexOf(key)) {
      let val = obj[key]
      if(typeof val === 'object') {
        let head = key + '.'
        ret[key] = deepCopy(val, notKeys.reduce(function(s, c) {
          if(!c.indexOf(head)) {
            s.push(c.slice(head.length))
          }
          return s
        }, []))
      } else {
        ret[key] = val
      }
    }
  }
  return ret
}

function deepHas(obj, prop) {
  let levels = prop.split('.')
  for(let i = 0; i < levels.length; i++) {
    obj = obj[levels[i]]
    if(!obj) return false
  }
  return true
}

function deepGet(obj, prop) {
  let levels = prop.split('.')
  for(let i = 0; i < levels.length; i++) {
    obj = obj[levels[i]]
  }
  return obj
}

function deepSet(obj, prop, value) {
  let levels = prop.split('.')
  let end = levels.length - 1
  for(let i = 0; i < end; i++) {
    obj = obj[levels[i]]
  }
  obj[levels[end]] = value
}

function whereFilter(obj) {
  return function(node) {
    for(let key in obj) {
      if(obj.hasOwnProperty(key)) {
        if(obj[key] !== node[key]) return false
      }
    }
    return true
  }
}

module.exports = Paul