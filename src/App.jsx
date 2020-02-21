import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import glbFile from './models/slotmathinel_01.glb'
import rollFile from './models/roll_01.glb'
import Stats from 'stats.js'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.el = React.createRef()
    this.mixer = null
    this.prevTime = null
    this.clips = []
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.loader = new GLTFLoader()
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.animate.bind(this)
    this.playAllClips.bind(this)
    this.loadGltf.bind(this)
    this.addStats.bind(this)
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
  loadGltf(file) {
    return new Promise((resolve, reject) => {
      this.loader.load(file, (gltf) => {
        this.scene.add(gltf.scene)
        this.clips.push(gltf.animations)
        resolve()
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this))
    this.el.current.appendChild(this.renderer.domElement)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.mixer = new THREE.AnimationMixer()
    this.camera.position.set(0, 2, 3)
    this.ambientLight.position.set(-1, 1, 1)

    //FPS panel
    this.fpsStats = this.addStats(0)

    //Add lights
    this.scene.add(this.ambientLight)
    this.scene.add(this.directionalLight)

    //load gltf
    // this.loader.load(glbFile, (gltf) =>{
    //   this.scene.add(gltf.scene)
    //   this.clips.push(gltf.animations)

    // }, (xhr) => {
    //   console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    // }, (err) => {
    //   console.log('Error occured:' + err)
    // })

    this.loadGltf(glbFile)
    this.loadGltf(rollFile)

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
