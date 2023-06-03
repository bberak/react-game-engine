import React, { Component } from 'react';

import DefaultTimer from './DefaultTimer';
import EVENTS, { EventName } from './events';

type Input = React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>;

export interface UpdateArgs {
  input: { name: EventName, payload: Input }[];
  window: Window;
  time: {
    current: number;
    previous: number | null;
    delta: number;
    previousDelta: number | null;
  };
}

interface GameLoopProps {
  running?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children: JSX.Element;
  timer: DefaultTimer;
  onUpdate: (args: UpdateArgs) => void;
}

export default class GameLoop extends Component<GameLoopProps> {
  static defaultProps = {
    running: true,
  };

  timer: DefaultTimer;
  input: { name: EventName, payload: Input }[];
  previousTime: number | null;
  previousDelta: number | null;
  container: React.RefObject<HTMLDivElement>;

  constructor(props: GameLoopProps) {
    super(props);
    this.timer = props.timer || new DefaultTimer();
    this.input = [];
    this.previousTime = null;
    this.previousDelta = null;
    this.container = React.createRef();
  }

  componentDidMount() {
    this.timer.subscribe(this.updateHandler);

    if (this.props.running) {
      this.start();
    }
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
  }

  componentDidUpdate(prevProps: GameLoopProps) {
    if (prevProps.running !== this.props.running) {
      this.props.running ? this.start() : this.stop();
    }
  }

  start = () => {
    this.input.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
    this.container.current?.focus();
  };

  stop = () => {
    this.timer.stop();
  };

  updateHandler = (currentTime: number) => {
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

  inputHandlers = EVENTS
    .reduce((acc, name) => ({
      ...acc,
      [name]: (payload: Input) => {
        payload?.persist();
        this.input.push({ name, payload });
      }
    }), {} as Record<EventName, (payload: Input) => void>);


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
    outline: 'none'
  }
};
