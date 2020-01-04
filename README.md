<p align="center">
  <img src="https://raw.githubusercontent.com/bberak/react-game-engine/master/logo.png" alt="React Game Engine" height="120" />
</p>

# React Game Engine &middot; [![npm version](https://badge.fury.io/js/react-game-engine.svg)](https://badge.fury.io/js/react-game-engine) [![mit license](https://img.shields.io/badge/license-MIT-50CB22.svg)](https://opensource.org/licenses/MIT)

Some components that make it easier to construct dynamic and interactive scenes on the **web** using React. 

If you are looking for the **React Native** version of this library, go to [react-native-game-engine](https://github.com/bberak/react-native-game-engine).

## Differences between React Native Game Engine

The core APIs are exactly the same. I've made some simplifications and improvements where it made sense. Please note that this library is still a bit more **experimental** than RNGE, but definitely in a usable state.

The main changes are:

### Rx Dependency Removed

I've removed the Rx dependency, and therefore the ability to pass in your own touch processor. For most developers, they won't even notice this change. The number and variety of events that you can receive from a DOM element is vastly bigger than on mobile. The burden of normalizing these events into streams that are consumable by the game developer in every possible way is quite daunting and would undoubtedly lead to developers pulling out their hair.

### Touches Replaced By Input

Taking the above into account - the `touches` array has been replaced by a generic `input`. Every system will receive an `input` array that contain the name and payload of the following events: `onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp`

Here's a system that would handle these events:

```javascript
const sys1 = (entities, { input }) => {
  const { payload } = input.find(x => x.name === "onMouseDown") || {};

  if (payload) {
    //-- Do something here
  }

  return entities;
};
```

## Table of Contents

- [Quick Start](#quick-start)
- [GameEngine Properties](#gameengine-properties)
- [GameEngine Methods](#gameengine-methods)
- [FAQ](#faq)
- [Introduction](#introduction)
- [Managing Complexity with Component Entity Systems](#managing-complexity-with-component-entity-systems)
  - [Additional CES Reading Material](#additional-ces-reading-material)
- [Get in Touch](#get-in-touch)
- [License](#license)


## Quick Start

If you've used **react-game-engine** before and understand the core concepts, take a look at [react-game-engine-template](https://github.com/bberak/react-game-engine-template). It's a sort of game kickstarter project that allows you to prototype ideas quickly and comes preloaded with a bunch of stuff like:

- A 3D renderer
- Physics
- Particle system
- Crude sound API
- Sprite support with animations
- Etc

Otherwise, continue reading the quick start guide below.

<hr />

Firstly, install the package to your project:

```npm install --save react-game-engine```

Then import the GameEngine component:

```javascript
import { GameEngine } from "react-game-engine";
```

To start with, let's create some components that can be rendered by React. Create a file called ```renderers.js```:

```javascript
import React, { PureComponent } from "react";

class Box extends PureComponent {
  render() {
    const size = 100;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "red", left: x, top: y }} />
    );
  }
}

export { Box };
```

Next, let's code our logic in a file called ```systems.js```:

```javascript
const MoveBox = (entities, { input }) => {
  //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
  //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
  //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
  //-- That said, it's probably worth considering performance implications in either case.

  const { payload } = input.find(x => x.name === "onMouseDown") || {};

  if (payload) {
    const box1 = entities["box1"];

    box1.x = payload.pageX;
    box1.y = payload.pageY;
  }

  return entities;
};

export { MoveBox };
```

Finally let's bring it all together in our `index.js`:

```javascript
import React, { PureComponent } from "react";
import { GameEngine } from "react-game-engine";
import { Box } from "./renderers";
import { MoveBox } from "./systems"

export default class SimpleGame extends PureComponent {
  render() {
    return (
      <GameEngine
        style={{ width: 800, height: 600, backgroundColor: "blue" }}
        systems={[MoveBox]}
        entities={{
          //-- Notice that each entity has a unique id (required)
          //-- and a renderer property (optional). If no renderer
          //-- is supplied with the entity - it won't get displayed.
          box1: { x: 200,  y: 200, renderer: <Box />}
        }}>

      </GameEngine>
    );
  }
}
```

Build and run. Each entity is a **"box"**. Every time you click on the screen, the first entity will move to the clicked coordinate.

If you're curious, our ```GameEngine``` component is a loose implementation of the [Compenent-Entity-System](#managing-complexity-with-component-entity-systems) pattern - we've written up a quick intro [here](#managing-complexity-with-component-entity-systems).

## GameEngine Properties

| Prop | Description | Default |
|---|---|---|
|**`systems`**|An array of functions to be called on every tick. |`[]`|
|**`entities`**|An object containing your game's initial entities. This can also be a Promise that resolves to an object containing your entities. This is useful when you need to asynchronously load a texture or other assets during the creation of your entities or level. |`{} or Promise`|
|**`renderer`**|A function that receives the entities and needs to render them on every tick. ```(entities,screen) => { /* DRAW ENTITIES */ }``` |`DefaultRenderer`|
|**`timer`**|An object that can be used to override the default timer behavior |`new DefaultTimer()`|
|**`running`**|A boolean that can be used to control whether the game loop is running or not |`true`|
|**`onEvent`**|A callback for being notified when events are dispatched |`undefined`|
|**`style`**|An object containing styles for the root container |`undefined`|
|**`className`**|A className for applying styles for the root container |`undefined`|
|**`children`**|React components that will be rendered after the entities |`undefined`|

## GameEngine Methods

| Method | Description | Arg1, Arg2, ArgN |
|---|---|---|
|**`stop`**|Stop the game loop |`NA`|
|**`start`**|Start the game loop. |`NA`|
|**`swap`**|A method that can be called to update your game with new entities. Can be useful for level switching etc. You can also pass a Promise that resolves to an entities object into this method. |`{} or Promise`|
|**`dispatch`**|A method that can be called to fire events after the currenty frame completed. The event will be received by **ALL** the systems and any `onEvent` callbacks |`event`|

## FAQ

### Is React Game Engine suitable for production quality games?

> This depends on your definition of production quality. You're not going to make a AAA title with RGE. You could however create some more basic games (doesn't mean they can't be fun games), or even jazz up your existing business applications with some interactive eye candy.

### How do I manage physics?

> RGE does not come with an out-of-the-box physics engine. We felt that this would be an area where the game designers should be given greater liberty. There are lots of JS-based physics engines out there, each with their pros and cons. Check out [Matter JS](https://github.com/liabru/matter-js) if you're stuck.

### Do I have a choice of renderers?

> How you render your entities is up to you. You can use the stand web components (div, img, canvas) or using [ThreeJS](https://threejs.org) for 3D games.

## Introduction

This package contains only two components:

- ```GameLoop```
- ```GameEngine```

Both are standalone components. The ```GameLoop``` is a subset of the ```GameEngine``` and gives you access to an ```onUpdate``` callback that fires every **16ms** (or roughly 60 fps). On top of this, the ```GameLoop``` will supply a reference to the screen (via ```Dimensions.get("window"))```, touch events for multiple fingers (start, end, press, long-press, move) and time + deltas. The ```GameLoop``` is useful for simple interactive scenes, and pretty much stays out of your way.

The ```GameEngine``` is more opinionated and is a react-friendly implementation of the [Component-Entity-Systems pattern](#managing-complexity-with-component-entity-systems). It provides the same features out of the box as the ```GameEngine``` but also includes a crude event/signaling pipeline for communication between your game and your other React components. You probably want to use the ```GameEngine``` to implement slightly more complex games and interactive scenes.

## Managing Complexity with Component Entity Systems

Typically, game developers have used OOP to implement complex game objects and scenes. Each game object is instantiated from a class, and polymorphism allows code re-use and behaviors to be extended through inheritance. As class hierarchies grow, it becomes increasingly difficult to create new types of game entities without duplicating code or seriously re-thinking the entire class hierarchy.

```
               [GameEntity]
                    |
                    |
                [Vehicle]
               /    |    \
              /     |     \
             /      |      \
            /       |       \
   [Terrestrial] [Marine] [Airborne]
           |        |        |
           |        |        |
         [Tank]   [Boat]   [Jet]
```
> How do we insert a new terrestrial and marine-based vehicle - say a Hovercraft - into the class hierarchy?

One way to address these problems is to favor composition over inheritance. With this approach, we break out the attributes and behaviours of our various game entities into decoupled, encapsulated and atomic components. This allows us to be really imaginative with the sorts of game entities we create because we can easily compose them with components from disparate domains and concerns.

Component entity systems are one way to organize your game entities in a composable manner. To start with, we take the common attributes (data) of our game entities and move them into siloed components. These don't have to be concrete classes, simple hash maps (or equivalent) and scalars will do - but this depends on the data you're storing.

- ***Position:**     { x: 0, y: 0 }*
- ***Velocity:**     { x: 0, y: 0 }*
- ***Acceleration:** { x: 0, y: 0 }*
- ***Mass:**         1.0*
- ***Health:**       100*
- ***Physics:**      Body b*
- ***Controls:**     { jump: 'w', left: 'a', crouch: 's', right: 'd' }*

> Examples of different types of components in a hypothetical programming language.

Your game entities will be reduced to lists/arrays of components and labeled with a unique identifier. An entity's components are by no means static - you're free to update components and even add or remove them on the fly. If our favourite Italian plumber ingests a mushroom, we simple double his velocity. If our character turns into a ghost - we remove his physics component and let him walk through walls.

- ***Player#1:**   [Position, Velocity, Health, Sprite, Physics, Controls]*
- ***Enemy#1:**    [Position, Velocity, Health, Sprite, Physics, AI]*
- ***Platform#1:** [Position, Sprite, Physics]*
- ***Platform#2:** [Position, Sprite, Physics, Velocity] // <-- Moving platform!*

> All entities are assigned a unique id.

Since our entities are simple data holders now, we must move all our game logic into our systems. At its core, a system is a function that processes related groups of components and is called on each iteration of the game loop. The system will extract entities that contain the necessary components it requires to run, update those entities as necessary, and wait for the next cycle. For example, we could code a "Gravity" component that calculates the force of gravity and applies it to all entities that have an acceleration AND velocity AND mass component. Entities that do not contain these components will not be affected by gravity.

- ***Gravity:**  (Acceleration, Velocity, Mass) => { // Update all matching entities // }*
- ***Render:**   (Sprite, Position) => { }*
- ***Movement:** (Position, Velocity, Controls) => { }*
- ***Damage:**   (Health) => { }*
- ***Bot:**      (Position, Velocity, AI) => { }*

> The logic in a system is inherently reusable because it can be applied to all entities that meet the system's criteria.

How exactly you choose to define your components, entities and systems is up to you. You'll probably find that coming up with well-defined components and systems will take some practice - but the general pattern is conducive to refactoring and the long term benefits will outweigh the learning curve.

### Additional CES Reading Material

- [Gamedev.net article](https://www.gamedev.net/articles/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
- [Intro to Entity Systems](https://github.com/junkdog/artemis-odb/wiki/Introduction-to-Entity-Systems)
- [Intro to CES from A-Frame](https://aframe.io/docs/0.7.0/introduction/entity-component-system.html)

## Get in Touch

We are Neap - a development and design team in Sydney. We love building stuff and meeting new people, so get in touch with us at [https://neap.co](https://neap.co).

Some of our projects:

#### React & React Native
* [__*react-native-game-engine*__](https://github.com/bberak/react-native-game-engine): A lightweight game engine for react native.
* [__*react-native-game-engine-handbook*__](https://github.com/bberak/react-native-game-engine-handbook): A React Native app showcasing some examples using react-native-game-engine.
* [__*react-game-engine*__](https://github.com/bberak/react-game-engine): A lightweight game engine for the web.

#### Web Framework & Deployment Tools
* [__*webfunc*__](https://github.com/nicolasdao/webfunc): Write code for serverless similar to Express once, deploy everywhere.
* [__*now-flow*__](https://github.com/nicolasdao/now-flow): Automate your Zeit Now Deployments.

#### GraphQL
* [__*graphql-serverless*__](https://github.com/nicolasdao/graphql-serverless): GraphQL (incl. a GraphiQL interface) middleware for [webfunc](https://github.com/nicolasdao/webfunc).
* [__*schemaglue*__](https://github.com/nicolasdao/schemaglue): Naturally breaks down your monolithic graphql schema into bits and pieces and then glue them back together.
* [__*graphql-s2s*__](https://github.com/nicolasdao/graphql-s2s): Add GraphQL Schema support for type inheritance, generic typing, metadata decoration. Transpile the enriched GraphQL string schema into the standard string schema understood by graphql.js and the Apollo server client.

#### Tools
* [__*aws-cloudwatch-logger*__](https://github.com/nicolasdao/aws-cloudwatch-logger): Promise based logger for AWS CloudWatch LogStream.

## License

MIT License

Copyright (c) 2018 Boris Berak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<p align="center">
  <a href="https://neap.co/">
    <img src="https://neap.co/img/neap_black_small_logo.png" alt="Neap Pty Ltd" title="Neap" height="50"/>
  </a>
</p>

