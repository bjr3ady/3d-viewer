const convert = require('fbx2gltf')

convert('./src/models/target.FBX', './src/models/target.glb').then(
  () => {console.log('success')},
  () => {console.log('error')}
)