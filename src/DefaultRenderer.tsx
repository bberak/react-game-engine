import React from "react";

export interface DefaultEntity<T = {}, > {
	renderer?: React.ComponentType<T & { window: Window }> | {
		type: React.ComponentType<T & { window: Window }>;
	};
}

const DefaultRenderer = <EntityType extends DefaultEntity, >(
	entities: Record<string, EntityType>,
	window: Window,
) => {
	if (!entities || !window) {
		return null;
	}

	return Object.keys(entities)
		.filter((key) => entities[key].renderer)
		.map(key => {
			const entity = entities[key];

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

export default DefaultRenderer;
