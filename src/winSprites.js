import * as THREE from 'three'

export default class SpriteAnimation {
  constructor(textures) {
    this.textures = textures
    this.isPlaying = false
    this.currentFrameIndex = 0
    this.currentTexture = this.textures[this.currentFrameIndex]
    this.sprite = null
    this.startDt = null
  }
  create(fps) {
    if (!this.mesh) {
      this.fps = fps
      let material = new THREE.SpriteMaterial({ map: this.currentTexture, transparent: true, flatShading: true})
      material.needsUpdate = true
      this.sprite = new THREE.Sprite(material)
      this.sprite.scale.set(475, 800, 1)
      this.sprite.position.set(0, 30, 1)
      this.reset()
    } else {
      this.sprite.material.map = this.currentTexture
    }
    return this
  }
  animate() {
    this.currentFrameIndex ++
    this.currentTexture = this.textures[this.currentFrameIndex]
    this.sprite.material.map = this.currentTexture
    return this.currentFrameIndex + 1 === this.textures.length
  }
  reset() {
    this.isPlaying = false
    this.currentFrameIndex = 0
    this.currentTexture = this.textures[this.currentFrameIndex]
    this.sprite.material.map = this.currentTexture
    this.sprite.material.opacity = 0
    console.log('reset')
    console.log(this.sprite)
  }
  play() {
    if (this.isPlaying) {
      requestAnimationFrame(() => {
        if (this.animate()) {
          this.reset()
          return
        }
        setTimeout(() => {
          this.play()
        }, this.fps)
      })
    } else {
      this.isPlaying = true
      this.sprite.material.opacity = 1
      this.play()
    }
  }
}