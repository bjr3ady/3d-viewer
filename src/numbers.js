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
  { u: 0.05, v: 0.05 }, //M
  { u: 0.29, v: 0.05 }, //k
  { u: 0.54, v: 0.05 }, //.
  { u: 0.7, v: 0.05 } //,
]

const xAxis = [0.46, 0.35, 0.27, 0.19, 0.08, -0.03, -0.11, -0.19, -0.30, -0.41]

function convertK(num) {
  num /= 1000
  num = num.toFixed(2)
  return num
}

function convertM(num) {
  num /= (1000 * 1000)
  num = num.toFixed(2)
  return num
}

function reverseString(str) {
  var strArr = []
  for (var i = 0; i < str.length; i++) {
    strArr.push(str[i])
  }
  strArr = strArr.reverse()
  return strArr.join('')
}

//Append an extension of K or M to represent 1000 and 1000 * 1000
function appendKMEx(numString, exChar) {
  var numStr = reverseString(numString)
  var strArr = []
  strArr.push(numStr.substr(0, 3))
  strArr.push(exChar)
  strArr.push(numStr.substring(3, numStr.length))
  return strArr.join('')
}

function appendDotToNumStr(num) {
  var numStr = num + ''
  if (numStr.indexOf('.') <= 0) {
    numStr += '.00'
  } else {
    var tmpArr = numStr.split('.')
    if (tmpArr[1].length === 1) {
      numStr += '0'
    }
  }
  return numStr
}

function setNumber(num, index, group) {
  if (!num) { return }
  var target = null
  group.children.forEach((mesh) => {
    if (mesh.userData.index === index) {
      target = mesh
      return
    }
  })
  var material = target.material
  var texture = material.map
  texture.offset.set(numMap[num].u, numMap[num].v)
}

export default class Number {
  constructor(scene) {
    this.scene = scene
    this.group = null
    this.createNumberMesh = this.createNumberMesh.bind(this)
    this.showNumbers = this.showNumbers.bind(this)
  }
  transformNumber(num) {
    var strNumArr = []
    var numStr = appendDotToNumStr(num)
    if (num >= 9999999.99) {
      num = convertM(num)
      numStr = appendKMEx(num + '', 'M')
    } else if (num >= 999999.99) {
      num = convertK(num)
      numStr = appendKMEx(num + '', 'k')
    } else {
      numStr = reverseString(numStr)
    }
    if (numStr.length >= 7) {
      var tmpStr = numStr.substr(0, 6)
      tmpStr += ','
      tmpStr += numStr.substring(6, numStr.length)
      numStr = tmpStr
    }
    for (var i = 0; i < numStr.length; i++) {
      strNumArr.push(numStr[i])
    }
    return strNumArr
  }
  createNumberMesh(t, num, x) {
    var texture = t.clone()
    texture.needsUpdate = true
    texture.repeat.set(0.22, 0.33)
    texture.offset.set(numMap[num].u, numMap[num].v)
    var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    var geometry = new THREE.PlaneGeometry(0.1, 0.15)
    var mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 1.77, 0.421)
    return mesh
  }
  initNumbers() {
    new THREE.TextureLoader().load(numImg, (texture) => {
      texture.wrapT = THREE.ReplaceStencilOp
      this.group = new THREE.Group()
      this.scene.add(this.group)
      for (var i = 0; i < 10; i++) {
        var mesh = null
        if (i === 2) {
          mesh = this.createNumberMesh(texture, 12, xAxis[2])
        } else if (i === 6) {
          mesh = this.createNumberMesh(texture, 13, xAxis[6])
        } else {
          mesh = this.createNumberMesh(texture, 0, xAxis[i])
        }
        mesh.userData = {index: i}
        this.group.add(mesh)
      }
    })
  }
  showNumbers(num) {
    if (!num) { return }
    var numStrArr = this.transformNumber(num)
    if (numStrArr.length < 10) {
      var l = 10 - numStrArr.length
      for (var i = 0; i < l; i++) {
        numStrArr.push('0')
      }
      numStrArr[6] = ','
    }
    console.log(`Number string to show: ${numStrArr.join('')}`)
    numStrArr.forEach((nStr, index) => {
      if (nStr === '.') {
        setNumber(12, 2, this.group)
      } else if (nStr === 'k') {
        setNumber(11, 3, this.group)
      } else if (nStr === 'M') {
        setNumber(10, 3, this.group)
      } else if (nStr === ',') {
        setNumber(13, 6, this.group)
      } else {
        setNumber(nStr * 1, index, this.group)
      }
    })
    console.log(`Finish render scores...  Score: ${num}`)
  }
}