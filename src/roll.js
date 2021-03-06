import rollFile from './models/roll_01.glb'
import * as TWEEN from 'es6-tween'

function newRollModel(originalModel) {
  let newModel = originalModel.clone()
  newModel.children.forEach((chi) => {
    if (chi.type === 'Mesh') {
      chi.material.flatShading = true
      // chi.material.roughness = .6
      chi.material.metalness = .3
      chi.material.morphNormals = true
    }
  })
  newModel.needsUpdate = true
  return newModel
}

const R = 3

export default class Roll {
  constructor(loader) {
    this.loader = loader
    this.isRolling = false
    this.isProc = false
    this.callback = null
    this.goal = []
    this.tween = null
    this.aRoller = this.bRoller = this.cRoller = null
  }
  loadRollModels() {
    return new Promise((resolve, reject) => {
      this.loader.load(rollFile, (gltf) => {
        this.cRoller = newRollModel(gltf.scene.children[0])
        this.bRoller = newRollModel(gltf.scene.children[0])
        this.aRoller = newRollModel(gltf.scene.children[0])
        this.bRoller.position.set(0, 1.25, 0.26)
        this.aRoller.position.set(-0.30, 1.25, 0.26)
        resolve([this.aRoller, this.bRoller, this.cRoller])
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  roll(roller, index) {
    roller.rotation.x = (Math.PI / R) * index
  }
  stopAt(roller, index, order) {
    return new Promise((resolve) => {
      let rotationX = {x: roller.rotation.x}
      console.log(`stop: ${(Math.PI / R) * index} index: ${index}`)
      new TWEEN.Tween(rotationX)
        .to({x: (Math.PI / R) * index}, order * 300)
        .easing(TWEEN.Easing.Linear)
        .on('update', () => {
          roller.rotation.x = rotationX.x
        })
        .on('complete', resolve)
        .start()
    })
  }
  setTo(aIndex, bIndex, cIndex, handler) {
    Promise.all([
      this.stopAt(this.aRoller, aIndex, 1),
      this.stopAt(this.bRoller, bIndex, 2),
      this.stopAt(this.cRoller, cIndex, 3)
    ]).then(handler)
  }
  animate(dt) {
    if (this.isRolling) {
      this.roll(this.cRoller, dt)
      this.roll(this.bRoller, dt)
      this.roll(this.aRoller, dt)
    } else {
      if (this.goal.length === 0) {
        return
      }
      if (this.isProc) {
        TWEEN.update()
        return
      }
      this.isProc = true
      this.setTo(this.goal[0], this.goal[1], this.goal[2], () => {
        this.isProc = false
        if (this.callback) {
          this.callback(this.goal[0], this.goal[1], this.goal[2])
          this.goal = []
          this.isRolling = false
          console.log('callback...')
        }
      })
    }
  }
}