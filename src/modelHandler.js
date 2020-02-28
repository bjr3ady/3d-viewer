import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import machineFile from './models/slotmachine_all.glb'
import sprites from './models/win-anim/sprites'
import winSp from './winSprites'
import bgImg from './models/gradients.png'
import * as THREE from 'three'
import Roll from './roll'

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

const createJackportMaterial = function () {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(bgImg, (texture) => {
      resolve(new THREE.MeshBasicMaterial({ map: texture, flatShading: true}))
      }, undefined, err => {
        reject(err)
      })
    })
}

export default class ModelHandler {
  constructor() {
    this.loader = new GLTFLoader()
    this.rollers = new Roll(this.loader)
  }
  loadGlb(file) {
    return new Promise((resolve, reject) => {
      this.loader.load(file, (gltf) => {
        resolve(gltf)
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  loadMachine() {
    return new Promise((resolve, reject) => {
      let result = []
      this.loadGlb(machineFile).then(scene => {
        let machineModel = fetchObject(scene.scene, 'Mesh', 'machine')
        if (machineModel) {
          machineModel.rotation.set(0, Math.PI, 0)
          result.push(machineModel)
        }

        let minJackport = fetchObject(scene.scene, 'Mesh', 'jackport_min')
        if (minJackport) {
          minJackport.position.z = -minJackport.position.z
          minJackport.position.x = -minJackport.position.x
          minJackport.rotation.x = -minJackport.rotation.x
          result.push(minJackport)
        }

        let jackPort = fetchObject(scene.scene, 'Mesh', 'jackport')
        if (jackPort) {
          jackPort.position.z = -jackPort.position.z
          jackPort.rotation.x = -jackPort.rotation.x
          result.push(jackPort)
        }

        let btnFrame = fetchObject(scene.scene, 'Mesh', 'btn_frame')
        if (btnFrame) {
          btnFrame.position.z = -btnFrame.position.z
          btnFrame.position.x = -btnFrame.position.x
          btnFrame.rotation.x = Math.PI -btnFrame.rotation.x
          btnFrame.rotation.z = Math.PI -btnFrame.rotation.z
          result.push(btnFrame)
          console.log(btnFrame)
        }

        let spinFrame = fetchObject(scene.scene, 'Mesh', 'spin_frame')
        if (spinFrame) {
          spinFrame.position.z = -spinFrame.position.z
          spinFrame.position.x = -spinFrame.position.x
          spinFrame.rotation.x = -spinFrame.rotation.x
          spinFrame.rotation.y = Math.PI -spinFrame.rotation.y
          result.push(spinFrame)
        }
        createJackportMaterial().then(mat => {
          minJackport.material = mat
          jackPort.material = mat
          resolve(result)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }
  loadWinSprite() {
    let txLoader = new THREE.TextureLoader()
    return new Promise((resolve, reject) => {
      let promises = []
      for (let i = 0; i < sprites.length; i++) {
        promises.push(
          new Promise((r, j) => {
            txLoader.load(sprites[i], tx => {
              r(tx)
            }, undefined, err => {
              j(err)
            })
          })
        )
      }
      Promise.all(promises).then(results => {
        let sp = new winSp(results)
        resolve(sp.create(24))
      }).catch(err => {
        reject(err)
      })
    })
  }
  loadAll() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.loadMachine(),
        this.loadWinSprite(),
        this.rollers.loadRollModels()
      ]).then(results => {
        resolve([
          results[0],
          results[1],
          this.rollers
        ])
      }).catch(err => {
        reject(err)
      })
    })
  }
}