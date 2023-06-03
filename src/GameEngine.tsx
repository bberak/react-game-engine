import React, { Component } from 'react';

import DefaultTimer from './DefaultTimer';
import DefaultRenderer from './DefaultRenderer';

import type { EventName } from './events';
import EVENTS from './events';

interface InitialStateProps<T> {
  initState?: T;
  initialState?: T;
  state?: T;
  initEntities?: T;
  initialEntities?: T;
  entities?: T;
}

const getEntitiesFromProps = <T, >(props: InitialStateProps<T>) =>
  props.initState ??
  props.initialState ??
  props.state ??
  props.initEntities ??
  props.initialEntities ??
  props.entities ?? {} as T;

interface InternalEvent {
  type: string;
}

type Input = React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>;

export interface SystemArgs<U> {
  input: { name: EventName, payload: Input }[];
  window: Window;
  events: (U | InternalEvent)[];
  dispatch: (e: U | InternalEvent) => void;
  defer: (e: U) => void;
  time: {
    current: number;
    previous: number | null;
    delta: number;
    previousDelta: number | null;
  };
}

interface GameEngineProps<T, U> extends InitialStateProps<T> {
  running?: boolean;
  onEvent: (e: U | InternalEvent) => void;
  systems?: ((state: T, context: SystemArgs<U>) => T)[];
  style?: React.CSSProperties;
  className?: string;
  renderer: (entities: T, window: Window) => JSX.Element;
  children: JSX.Element;
  timer: DefaultTimer;
}

export default class GameEngine<T, U> extends Component<GameEngineProps<T, U>, { entities: T }> {
  static defaultProps = {
    systems: [],
    entities: {},
    renderer: DefaultRenderer,
    running: true,
  };

  timer: DefaultTimer;
  input: { name: EventName, payload: Input }[];
  previousTime: number | null;
  previousDelta: number | null;
  events: (U | InternalEvent)[];
  container: React.RefObject<HTMLDivElement>;
  state: { entities: T };

  constructor(props: GameEngineProps<T, U>) {
    super(props);
    this.state = {
      entities: null!,
    };
    this.timer = props.timer || new DefaultTimer();
    this.input = [];
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
    this.container = React.createRef();
  }

  async componentDidMount() {
    this.timer.subscribe(this.updateHandler);

    this.setState(
      {
        entities: await Promise.resolve(getEntitiesFromProps(this.props)),
      },
      () => {
        if (this.props.running) {
          this.start();
        }
      }
    );
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
  }

  componentDidUpdate(prevProps: GameEngineProps<T, U>) {
    if (prevProps.running !== this.props.running) {
      this.props.running ? this.start() : this.stop();
    }
  }

  clear = () => {
    this.input.length = 0;
    this.events.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
  };

  start = () => {
    this.clear();
    this.timer.start();
    this.dispatch({ type: 'started' });
    this.container.current?.focus();
  };

  stop = () => {
    this.timer.stop();
    this.dispatch({ type: 'stopped' });
  };

  swap = async (newEntities: T) => {
    this.setState(
      {
        entities: await Promise.resolve(newEntities ?? {} as T)
      },
      () => {
        this.clear();
        this.dispatch({ type: 'swapped' });
      },
    );
  };

  defer = (e: U) => {
    this.dispatch(e);
  };

  dispatch = (e: U | InternalEvent) => {
    setTimeout(() => {
      this.events.push(e);
      if (this.props.onEvent) {
        this.props.onEvent(e);
      }
    }, 0);
  };

  updateHandler = (currentTime: number) => {
    let args = {
      input: this.input,
      window: window,
      events: this.events,
      dispatch: this.dispatch,
      defer: this.defer,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta
      }
    };

    this.setState((prevState) => {
      let newEntities = (this.props.systems ?? []).reduce(
        (state, sys) => sys(state, args),
        prevState.entities
      );

      this.input.length = 0;
      this.events.length = 0;
      this.previousTime = currentTime;
      this.previousDelta = args.time.delta;

      return { entities: newEntities};
    });
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
        {this.props.renderer(this.state.entities, window)}
        {this.props.children}
      </div>
    );
  }
}

const css = {
  container: {
    flex: 1,
    outline: 'none'
  }
};
