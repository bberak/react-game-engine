const EVENTS = [
  'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit',
  'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter',
  'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onWheel',
  'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onKeyDown', 'onKeyPress',
  'onKeyUp',
] as const;

export type EventName = typeof EVENTS[number];

export default EVENTS;
