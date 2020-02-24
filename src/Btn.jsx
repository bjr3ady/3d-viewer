import * as React from 'react'
import './btn.css'

export default class Btn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      goal: props.goal,
      callback: props.callback,
      rollers: props.rollers,
      enabled: true,
      txt: 'Click'
    }
    this.btnClick = this.btnClick.bind(this)
  }
  btnClick(e) {
    if (this.state.enabled) {
      console.log('click')
      e.preventDefault()
      this.setState({enabled: false, txt: 'Waiting...'})
      if (this.state && this.state.rollers && this.state.callback) {
        // this.state.rollers.goal = this.state.goal
        if (!this.state.rollers.isRolling) {
          for (var i = 0; i < 3; i++) {
            this.state.rollers.goal.push(Math.round(Math.random() * 5 + 1))
          }
        }
        this.state.rollers.callback = this.state.callback
        this.state.rollers.isRolling = !this.state.rollers.isRolling
        setTimeout(() => {
          this.setState({enabled: true, txt: 'Click'})
        }, 2400);
      }
    }
  }
  render() {
    return (
      <p className="btn" onClick={this.btnClick}>{this.state.txt}</p>
    )
  }
}