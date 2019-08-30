import React, { Component } from "react";

export default (state, window) => {
  return Object.keys(state)
    .filter(key => state[key].renderer)
    .map(key => {
      let entity = state[key];
      if (typeof entity.renderer === "object")
        return <entity.renderer.type key={key} {...entity} window={window} />;
      else if (typeof entity.renderer === "function")
        return <entity.renderer key={key} {...entity} window={window} />;
    });
};