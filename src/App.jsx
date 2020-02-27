import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'
import bgImg from './models/gradients.png'
import ModelHandler from './modelHandler'
import Num from './numbers'
import './App.css'
import Btn from './Btn'


const scores = [3, 6, 9, 12, 15, 800000]
const acspet = window.innerWidth / window.innerHeight

class App extends React.Component {
  constructor(props) {
    super(props)
    this.el = React.createRef()
    this.mixer = null
    this.prevTime = null
    this.winSprite = null
    this.score = 0
    this.scene = new THREE.Scene()
    this.HUDScene = new THREE.Scene()
    this.NumberBoard = new Num(this.scene)
    this.camera = new THREE.PerspectiveCamera(90, acspet, 1, 100)
    this.HUDCamera = new THREE.OrthographicCamera(window.innerWidth/ -2, window.innerWidth/ 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000)
    this.HUDCamera.position.set(0, 0, 10)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, outputEncoding: THREE.sRGBEncoding, alpha: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.bgTexture = new THREE.TextureLoader().load(bgImg)
    this.modelHandler = new ModelHandler()

    this.animate = this.animate.bind(this)
    this.playAllClips = this.playAllClips.bind(this)
    this.addStats = this.addStats.bind(this)
    this.addLights = this.addLights.bind(this)
    this.calculateScores = this.calculateScores.bind(this)
  }
  addStats(stsNo) {
    let sts = new Stats()
    sts.dom.style.postion = 'relative'
    sts.dom.style.float = 'left'
    document.body.appendChild(sts.dom)
    sts.showPanel(stsNo)
    return sts
  }
  resize() {
    let width = window.innerWidth
    let height = window.innerHeight
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }
  animate() {
    this.fpsStats.update()
    requestAnimationFrame((dt) => {
      const time = (dt - this.prevTime) / 1000
      this.controls.update()
      this.mixer && this.mixer.update(time)
      this.renderer.render(this.scene, this.camera)
      this.renderer.render(this.HUDScene, this.HUDCamera)
      this.prevTime = dt
      this.animate()
      if (this.rollers && this.rollers.animate) {
        this.rollers.animate(dt)
      }
    })
  }
  playAllClips() {
    this.clips.forEach((clip) => {
      this.mixer.clipAction(clip).reset().play()
    })
  }
  addLights() {
    var topLight = new THREE.PointLight(0xffffff, 2, 8);
    topLight.position.set(0, 3, 3);
    topLight.castShadow = true
    this.scene.add(topLight)

    let bottomLight = new THREE.DirectionalLight(0xffffff, .35)
    bottomLight.position.set(0, -1.5, 3)
    bottomLight.castShadow = true
    this.scene.add(bottomLight)

    let leftLight = new THREE.DirectionalLight(0xffffff, 1)
    leftLight.position.set(-3, 3, -3)
    this.scene.add(leftLight)

    let rightLight = new THREE.DirectionalLight(0xffffff, 1)
    rightLight.position.set(3, 3, -3)
    this.scene.add(rightLight)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this))
    this.el.current.appendChild(this.renderer.domElement)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 1, 0)
    // this.controls.enablePan = false
    this.mixer = new THREE.AnimationMixer()
    this.camera.position.set(0, 1.2, 2)

    //Set background
    this.scene.background = this.bgTexture

    //FPS panel
    this.fpsStats = this.addStats(0)

    //Add lights
    this.addLights()

    //load gltf
    this.modelHandler.loadAll().then(models => {
      this.scene.add(...models[0]) // machine model
      this.winSprite = models[1]
      this.HUDScene.add(this.winSprite.sprite) // wining sprites
      this.rollers = models[2]
      this.scene.add(models[2].aRoller) // roller0 model
      this.scene.add(models[2].bRoller) // roller1 model
      this.scene.add(models[2].cRoller) // roller2 model
    })

    //Show axes
    this.scene.add(new THREE.AxesHelper(5))

    //Init number board
    this.NumberBoard.initNumbers()

    this.animate()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }
  calculateScores(aNum, bNum, cNum) {
    console.log(`num: ${aNum} | ${bNum} | ${cNum}`)
    if (this.NumberBoard && this.NumberBoard.showNumbers) {
      if (aNum === bNum && bNum === cNum) {
        this.score += scores[aNum] * 3
        this.NumberBoard.showNumbers(this.score)
        this.winSprite.play()
      } else if (aNum === bNum || aNum === cNum || bNum === cNum) {
        this.score += scores[aNum] * 2
        this.NumberBoard.showNumbers(this.score)
        this.winSprite.play()
      }
    }
  }
  render() {
    return (
      <div className="App" ref={this.el}>
        <Btn rollers={this.modelHandler.rollers} callback={this.calculateScores} />
      </div>
    )
  }
}

export default App
