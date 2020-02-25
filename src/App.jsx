import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import glbFile from './models/slotmathinel_01.glb'
import Stats from 'stats.js'
import bgImg from './models/gradients.png'
import Num from './numbers'
import Roll from './roll'
import './App.css'
import Btn from './Btn'

const scores = [3, 6, 9, 12, 15, 800000]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.el = React.createRef()
    this.mixer = null
    this.prevTime = null
    this.score = 0
    this.scene = new THREE.Scene()
    this.NumberBoard = new Num(this.scene)
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 100)
    this.renderer = new THREE.WebGLRenderer({antialias: true, outputEncoding: THREE.sRGBEncoding})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.loader = new GLTFLoader()
    this.rollers = new Roll(this.scene, this.loader)
    this.worldLight = new THREE.HemisphereLight(0xffffff, 50)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    this.bgTexture = new THREE.TextureLoader().load(bgImg)
    
    this.animate = this.animate.bind(this)
    this.playAllClips = this.playAllClips.bind(this)
    this.loadGltf = this.loadGltf.bind(this)
    this.addStats = this.addStats.bind(this)
    this.addLights = this.addLights.bind(this)
    this.addFloor = this.addFloor.bind(this)
    this.calculateScores = this.calculateScores.bind(this)
  }
  addStats(stsNo){
    var sts = new Stats()
    sts.dom.style.postion = 'relative'
    sts.dom.style.float = 'left'
    document.body.appendChild(sts.dom)
    sts.showPanel(stsNo)
    return sts
  }
  resize() {
    var width = window.innerWidth
    var height = window.innerHeight
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
  walkMeshes(scene) {
    var meshes = new THREE.Group()
    if (scene && scene.children && scene.children.length) {
      scene.children.forEach((child) => {
        if (child.type === 'Mesh') {
          meshes.add(new THREE.Mesh(child.geometry, child.material))
        } else {
          this.walkMeshes(child)
        }
      })
    }
    return meshes
  }
  loadGltf(file) {
    return new Promise((resolve, reject) => {
      this.loader.load(file, (gltf) => {
        this.scene.add(gltf.scene)
        resolve()
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  addLights() {
    var topLight = new THREE.DirectionalLight(0xffffff, 2)
    topLight.position.set(0, 3, 3)
    this.scene.add(topLight)
    
    var leftLight = new THREE.DirectionalLight(0xffffff, 1)
    leftLight.position.set(-3, 3, -3)
    this.scene.add(leftLight)

    var rightLight = new THREE.DirectionalLight(0xffffff, 1)
    rightLight.position.set(3, 3, -3)
    this.scene.add(rightLight)
  }
  addFloor() {
    var geometry = new THREE.Geometry()
    var material = new THREE.MeshStandardMaterial( { color : 0xffffff } )
    geometry.vertices.push( new THREE.Vector3( -50, -50, 0 ) )
    geometry.vertices.push( new THREE.Vector3(  50, -50, 0 ) )
    geometry.vertices.push( new THREE.Vector3(  50,  50, 0 ) )
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    this.scene.add(new THREE.Mesh( geometry, material ))
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this))
    this.el.current.appendChild(this.renderer.domElement)
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 1, 0)
    this.controls.enablePan = false
    this.mixer = new THREE.AnimationMixer()
    this.camera.position.set(0, 1.2, 2)

    //Set background
    this.scene.background = this.bgTexture

    //FPS panel
    this.fpsStats = this.addStats(0)

    //Add lights
    this.addLights()

    //Add floor
    // this.addFloor()

    //load gltf
    this.loadGltf(glbFile)
    this.rollers.loadRollModels()

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
      } else if (aNum === bNum || aNum === cNum || bNum === cNum) {
        this.score += scores[aNum] * 2
        this.NumberBoard.showNumbers(this.score)
      }
    }
  }
  render() {
    return (
      <div className="App" ref={this.el}>
        <Btn rollers={this.rollers} callback={this.calculateScores} />
      </div>
    )
  }
}

export default App
