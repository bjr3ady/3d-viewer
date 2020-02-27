export default class Btn {
  constructor(rollers, callback) {
    this.enabled = true
    this.btnClick = this.btnClick.bind(this)
    this.rollers = rollers
    this.callback = callback
    this.rollers.callback = callback
  }
  btnDown(target) {
    console.log(`mouse down`)
    console.log(target)
    let btnMesh = target.children[0]
    btnMesh.position.y = 0.1
  }
  btnUp(target) {
    let btnMesh = target.children[0]
    btnMesh.position.set(-0.000724175537470728, 0.0399664118885994, -0.000770799932070076)
  }
  btnClick(target, e) {
    this.btnUp(target)
    if (this.enabled) {
      e.preventDefault()
      this.enabled = false
      if (this.rollers && this.callback) {
        if (!this.rollers.isRolling) {
          for (var i = 0; i < 3; i++) {
            this.rollers.goal.push(Math.round(Math.random() * 5))
          }
        }
        this.rollers.isRolling = !this.rollers.isRolling
        setTimeout(() => {
          this.rollers.isRolling = !this.rollers.isRolling
        }, 2000)
        setTimeout(() => {
          this.enabled =  true
        }, 3000);
      }
    }
  }
}