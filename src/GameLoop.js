import React, { Component } from "react";
import DefaultTimer from "./DefaultTimer";

const events = `onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp`;

export default class GameLoop extends Component {
  constructor(props) {
    super(props);
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.input = [];
    this.screen = Dimensions.get("window");
    this.previousTime = null;
    this.previousDelta = null;
  }

  componentDidMount() {
    if (this.props.running) this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
    if (this.touchProcessor.end) this.touchProcessor.end();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }
  }

  start = () => {
    this.input.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
  };

  stop = () => {
    this.timer.stop();
  };

  updateHandler = currentTime => {
    let args = {
      input: this.input,
      window: window,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta
      }
    };

    if (this.props.onUpdate) this.props.onUpdate(args);

    this.input.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
  };

  inputHandlers = events
    .split(" ")
    .map(name => ({
      name,
      handler: payload => this.input.push({ name, payload })
    }))
    .reduce((acc, val) => {
      acc[val.name] = val.handler;
      return acc;
    }, {});

  render() {
    return (
      <View style={[css.container, this.props.style]} {...this.inputHandlers}>
        {this.props.children}
      </View>
    );
  }
}

GameLoop.defaultProps = {
  running: true
};

const css = {
  container: {
    flex: 1
  }
};
