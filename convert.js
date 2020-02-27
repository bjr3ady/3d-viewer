const convert = require('fbx2gltf')

convert('./src/models/win_sprite.fbx', './src/models/win_sprite.glb').then(
  () => {console.log('success')},
  () => {console.log('error')}
)