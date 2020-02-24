import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import glbFile from './models/slotmathinel_01.glb'
import rollFile from './models/roll_01.glb'
import Stats from 'stats.js'
import bgImg from './models/gradients.png'
import Num from './numbers'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.el = React.createRef()
    this.mixer = null
    this.prevTime = null
    this.clips = []
    this.scene = new THREE.Scene()
    this.NumberBoard = new Num(this.scene)
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 100)
    this.renderer = new THREE.WebGLRenderer({antialias: true, outputEncoding: THREE.sRGBEncoding})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.loader = new GLTFLoader()
    this.worldLight = new THREE.HemisphereLight(0xffffff, 50)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    this.bgTexture = new THREE.TextureLoader().load(bgImg)
    
    this.animate.bind(this)
    this.playAllClips.bind(this)
    this.loadGltf.bind(this)
    this.addStats.bind(this)
    this.addAxis.bind(this)
    this.addLights.bind(this)
    this.addFloor.bind(this)
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
    requestAnimationFrame((dt) => {
      const time = (dt - this.prevTime) / 1000
      this.controls.update()
      this.mixer && this.mixer.update(time)
      this.renderer.render(this.scene, this.camera)
      this.prevTime = dt
      this.animate()
    })
    this.fpsStats.update()
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
        // console.log(gltf.scene)
        this.clips.push(gltf.animations)
        resolve()
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  addAxis() {
    //red
    var xline = new THREE.Line( new THREE.Geometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 0, 0)
    ]), new THREE.LineBasicMaterial( { color: 0xff0000 } ) )
    //green
    var yline = new THREE.Line( new THREE.Geometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5, 0)
    ]), new THREE.LineBasicMaterial( { color: 0x00ff00 } ) )
    //blue
    var zline = new THREE.Line( new THREE.Geometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 5)
    ]), new THREE.LineBasicMaterial( { color: 0x0000ff } ) )
    this.scene.add(xline)
    this.scene.add(yline)
    this.scene.add(zline)
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
    this.controls.target.set(0, 0.5, 0)
    // this.controls.enablePan = false
    this.mixer = new THREE.AnimationMixer()
    this.camera.position.set(1, 1.2, 3)

    //Set background
    this.scene.background = this.bgTexture

    //FPS panel
    this.fpsStats = this.addStats(0)

    //Add lights
    this.addLights()

    //Add floor
    // this.addFloor()

    //load gltf
    this.loadGltf(glbFile).then()
    this.loadGltf(rollFile).then()
    this.NumberBoard.showNumbers(39412345.31)

    this.addAxis()

    this.animate()
    this.playAllClips()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }
  render() {
    return (
      <div className="App" ref={this.el}></div>
    )
  }
}

export default App
