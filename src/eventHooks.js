import * as THREE from 'three'

const fetchObject = function (node, typeName, meshName) {
  var result = null
  if (node.children && node.children.length) {
    for (var i = 0; i < node.children.length; i++) {
      if (result != null) {
        break
      }
      if (node.children[i].type === typeName && node.children[i].name === meshName) {
        return node.children[i]
      } else {
        result = fetchObject(node.children[i], typeName, meshName)
      }
    }
  }
  return result
}

export default class EventHook {
  constructor(el, scene, renderer, camera) {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.el = el
  }
  bind(targetName, eventName, callback) {
    this.el.addEventListener(eventName, (e) => {
      e.preventDefault()
      this.mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1
      this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.camera)
      let target = fetchObject(this.scene, 'Mesh', targetName)
      if (!target) {
        return
      }
      
      let intersects  = this.raycaster.intersectObjects(this.scene.children, true)
      for(let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object
        if (obj instanceof THREE.Mesh) {
          if (obj.uuid && target.uuid && obj.uuid === target.uuid) {
            callback(target, e)
          }
        }
      }
    }, false)
  }
}