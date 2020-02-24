import rollFile from './models/roll_01.glb'

function newRollModel(originalModel) {
  var newModel = originalModel.clone()
  newModel.needsUpdate = true
  return newModel
}

export default class Roll {
  constructor(scene, loader) {
    this.scene = scene
    this.loader = loader
    this.isRolling = false
    this.callback = null
    this.goal = []
    this.aRoller = this.bRoller = this.cRoller = null
  }
  loadRollModels() {
    return new Promise((resolve, reject) => {
      this.loader.load(rollFile, (gltf) => {
        this.cRoller = gltf.scene.children[0]
        this.bRoller = newRollModel(this.cRoller)
        this.aRoller = newRollModel(this.cRoller)
        this.scene.add(this.cRoller)
        this.bRoller.position.set(0, 1.25, 0.26)
        this.scene.add(this.bRoller)
        this.aRoller.position.set(-0.30, 1.25, 0.26)
        this.scene.add(this.aRoller)
        resolve()
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  roll(roller, index) {
    if (roller && index) {
      return new Promise((resolve) => {
        if (index) {
          setTimeout(() => {
            roller.rotation.x = (Math.PI / 3) * index
            resolve()
          }, 1000)
        }
      })
    }
  }
  stop(roller, index) {
    return new Promise((resolve) => {
      if (index) {
        setTimeout(() => {
          roller.rotation.x = (Math.PI / 3) * index
          resolve()
        }, 1000)
      }
    })
  }
  setTo(aIndex, bIndex, cIndex, handler) {
    this.stop(this.aRoller, aIndex)
      .then(this.stop(this.bRoller, bIndex)
      .then(this.stop(this.cRoller, cIndex)
      .then(handler)
    ))
  }
  animate(dt) {
    if (this.isRolling) {
      this.roll(this.cRoller, dt)
        .then(this.roll(this.bRoller, dt)
        .then(this.roll(this.aRoller, dt)
      ))
    } else {
      this.setTo(this.goal[0], this.goal[1], this.goal[2], () => {
        setTimeout(() => {
          if (this.callback) {
            this.callback(this.goal[0], this.goal[1], this.goal[2])
              this.callback = null
              this.goal = []
              this.isRolling = false
              console.log('callback...')
          }
        }, 300)
      })
    }
  }
}