import React, { Component } from "react";

export default (entities, window) => {
	if (!entities || !window) return null;

	return Object.keys(entities)
		.filter(key => entities[key].renderer)
		.map(key => {
			let entity = entities[key];
			if (typeof entity.renderer === "object")
				return (
					<entity.renderer.type
						key={key}
						window={window}
						{...entity}
					/>
				);
			else if (typeof entity.renderer === "function")
				return (
					<entity.renderer key={key} window={window} {...entity} />
				);
		});
};
