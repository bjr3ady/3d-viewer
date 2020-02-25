import * as React from 'react'
import './btn.css'

export default class Btn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: true,
      txt: 'Click'
    }
    this.btnClick = this.btnClick.bind(this)
    this.props.rollers.callback = this.props.callback
  }
  btnClick(e) {
    if (this.state.enabled) {
      console.log('click')
      e.preventDefault()
      this.setState({enabled: false, txt: 'Waiting...'})
      if (this.props.rollers && this.props.callback) {
        if (!this.props.rollers.isRolling) {
          for (var i = 0; i < 3; i++) {
            this.props.rollers.goal.push(Math.round(Math.random() * 5))
          }
        }
        this.props.rollers.isRolling = !this.props.rollers.isRolling
        setTimeout(() => {
          this.setState({enabled: true, txt: 'Click'})
        }, 300);
      }
    }
  }
  render() {
    return (
      <p className="btn" onClick={this.btnClick}>{this.state.txt}</p>
    )
  }
}