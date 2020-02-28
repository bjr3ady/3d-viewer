import numImg from './models/Numbers.png'
import * as THREE from 'three'

const numMap = [
  { u: 0.01, v: 0.68 }, //0
  { u: 0.2, v: 0.68 }, //1
  { u: 0.39, v: 0.68 }, //2
  { u: 0.57, v: 0.68 }, //3
  { u: 0.76, v: 0.68 }, //4
  { u: 0.01, v: 0.36 }, //5
  { u: 0.2, v: 0.36 }, //6
  { u: 0.38, v: 0.37 }, //7
  { u: 0.57, v: 0.36 }, //8
  { u: 0.76, v: 0.36 }, //9
  { u: 0.7, v: 0.05 } //,
]

const xAxis = [-0.07, -0.12, -0.17, -0.21, -0.25, -0.30]

const BET_LIMIT = 99999

function addPeriod(reversedNumStr) {
  let result = []
  result.push(reversedNumStr.substr(0, 3))
  result.push(',')
  result.push(reversedNumStr.substring(3, reversedNumStr.length))
  return result.join('')
}

function addKStr(reversedNumStr) {

}

function setNumber(num, index, group) {
  console.log(num)
  if (!num) { return }
  let target = null
  group.children.forEach((mesh) => {
    if (mesh.userData.index === index) {
      target = mesh
      return
    }
  })
  let material = target.material
  let texture = material.map
  texture.offset.set(numMap[num].u, numMap[num].v)
}

function reverseNumString(betNum) {
  let str = betNum + ''
  let strArr = []
  for (let i = 0; i < str.length; i++) {
    strArr.push(str[i])
  }
  strArr = strArr.reverse()
  if (strArr.length < 5) {
    for(let i = 0; i < (5 - strArr.length); i++) {
      strArr.push('0')
    }
  }
  return addPeriod(strArr.join(''))
}

export default class Bet {
  constructor(scene, app) {
    this.scene = scene
    this.bet = 0
    this.app = app
    this.plusBtnDown = this.plusBtnDown.bind(this)
    this.plusBtnUp = this.plusBtnUp.bind(this)
    this.minusBtnDown = this.minusBtnDown.bind(this)
    this.minusBtnUp = this.minusBtnUp.bind(this)
    this.showBet = this.showBet.bind(this)
  }
  createNumberMesh(t, num, x) {
    let texture = t.clone()
    texture.needsUpdate = true
    texture.repeat.set(0.22, 0.33)
    texture.offset.set(numMap[num].u, numMap[num].v)
    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, flatShading: true})
    let geometry = new THREE.PlaneGeometry(0.045, 0.08)
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 0.923, 0.74)
    mesh.rotation.set(Math.PI - 3.89, 0, 0)
    return mesh
  }
  initNumbers() {
    new THREE.TextureLoader().load(numImg, (texture) => {
      texture.wrapT = THREE.ReplaceStencilOp
      this.group = new THREE.Group()
      this.scene.add(this.group)
      for (let i = 0; i < 6; i++) {
        let mesh = null
        if (i === 3) {
          mesh = this.createNumberMesh(texture, 10, xAxis[3])
        } else {
          mesh = this.createNumberMesh(texture, 0, xAxis[i])
        }
        mesh.userData = {index: i}
        this.group.add(mesh)
      }
    })
  }
  showBet() {
    let reverseBetStr = reverseNumString(this.bet)
    console.log(`showBet => ${reverseBetStr}`)
    for(let i = 0; i < reverseBetStr.length; i++) {
      if (reverseBetStr[i] === ',') {
        continue
      }
      setNumber(reverseBetStr[i], i, this.group)
    }
  }
  plusBtnDown(target) {
    if (this.app.rollers.isRolling) {
      return
    }
    target.position.y = 0.1
  }
  plusBtnUp(target, num) {
    if (this.app.rollers.isRolling) {
      return
    }
    target.position.y = 0.0735590010881424
    if ((this.bet + num) > BET_LIMIT) {
      return
    }
    this.bet += num
    this.showBet()
  }
  minusBtnDown(target) {
    if (this.app.rollers.isRolling) {
      return
    }
    target.position.y = 0.1
  }
  minusBtnUp(target, num) {
    if (this.app.rollers.isRolling) {
      return
    }
    target.position.y = 0.0681731924414635
    if ((this.bet - num) <= 0) {
      return
    }
    this.bet -= num
    this.showBet()
  }
}