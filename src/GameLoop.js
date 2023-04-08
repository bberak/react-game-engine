import React, { Component } from "react";
import DefaultTimer from "./DefaultTimer";

const events = `onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp`;

export default class GameLoop extends Component {
  constructor(props) {
    super(props);
    this.timer = props.timer || new DefaultTimer();
    this.input = [];
    this.previousTime = null;
    this.previousDelta = null;
    this.container = React.createRef();
  }

  componentDidMount() {
    this.timer.subscribe(this.updateHandler);
    
    if (this.props.running) this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.running !== this.props.running) {
      if (this.props.running) this.start();
      else this.stop();
    }
  }

  start = () => {
    this.input.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
    this.container.current.focus();
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
      handler: payload => {
        payload.persist();
        this.input.push({ name, payload });
      }
    }))
    .reduce((acc, val) => {
      acc[val.name] = val.handler;
      return acc;
    }, {});

  render() {
    return (
      <div
        ref={this.container}
        style={{ ...css.container, ...this.props.style }}
        className={this.props.className}
        tabIndex={0}
        {...this.inputHandlers}
      >
        {this.props.children}
      </div>
    );
  }
}

GameLoop.defaultProps = {
  running: true
};

const css = {
  container: {
    flex: 1,
    outline: "none"
  }
};
