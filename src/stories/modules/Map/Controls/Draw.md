### Draw in Map

Map component comes with a "in map" draw control. It will helps you to create, edit, delete, (un)combine linestring, polygon and point draw. These feature needs some props to be configured and except for `map`, every props are based from [mapbox-gl-draw](https://github.com/mapbox/mapbox-gl-draw/) documentation:

| Prop | Type | Description | Default |
| - | - | - |
| `map` | Object | the instance of the map | |
| `onDrawActionable` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawactionable | Do nothing |
| `onDrawCombine` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawcombine | Do nothing |
| `onDrawCreate` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawcreate | Do nothing |
| `onDrawDelete` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawdelete | Do nothing |
| `onDrawModeChange` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawmodechange | Do nothing |
| `onDrawSelectionChange` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawselectionchange | Do nothing |
| `onDrawUncombine` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawuncombine | Do nothing |
| `onDrawUpdate` | Function | Refers to the following event https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#drawupdate | Do nothing |
| `position` | String | Position of the draw controls in the map. Could be one of the following 'top-left', 'top-right', 'bottom-left', 'bottom-right'. | top-left |
