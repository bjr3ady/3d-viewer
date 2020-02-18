import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import glbFile from './models/target.glb'
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
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.animate.bind(this)
    this.playAllClips.bind(this)
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
  }
  playAllClips() {
    this.clips.forEach((clip) => {
      this.mixer.clipAction(clip).reset().play()
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this))
    this.el.current.appendChild(this.renderer.domElement)
    this.scene.add(this.ambientLight)
    this.scene.add(this.directionalLight)

    //load gltf
    this.loader.load(glbFile, (gltf) =>{
      this.scene.add(gltf.scene)
      this.mixer = new THREE.AnimationMixer(gltf.scene)
      this.clips = gltf.animations || []
      
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.camera.position.set(0, 2, 3)

      this.animate()
      this.playAllClips()
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, (err) => {
      console.log('Error occured:' + err)
    })
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
