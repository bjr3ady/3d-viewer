const convert = require('fbx2gltf')

convert('./src/models/slotmachine_all_0.fbx', './src/models/slotmachine_all_0.glb').then(
  () => {console.log('success')},
  () => {console.log('error')}
)