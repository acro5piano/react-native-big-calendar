import React, { Component } from 'react'
import { StyleSheet, PanResponder, Animated } from 'react-native'

export class Draggable extends Component {
  pan = new Animated.ValueXY()
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: this.pan.x, dy: this.pan.y }]),
    onPanResponderRelease: (evt, gestureState) => {
      console.log(evt)
      console.log(gestureState)
    },
  })

  state = {
    initialized: false,
    position: {
      x: 0,
      y: 0,
    },
  }

  componentDidMount() {
    // Add a listener for the delta value change
    this.pan.addListener(position => this.setState({ position }))

    this.setState({ initialized: true })
  }

  render() {
    const { initialized } = this.state
    if (!initialized) {
      return null
    }

    const panStyle = {
      transform: this.pan.getTranslateTransform(),
    }
    return <Animated.View {...this.panResponder.panHandlers} style={[panStyle, styles.circle]} />
  }
}

const CIRCLE_RADIUS = 30
const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'skyblue',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
})
