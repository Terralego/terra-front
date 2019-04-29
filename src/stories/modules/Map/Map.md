### Customize Map controls

By default, Map will be displayed with navigation controls in top right, attribution in bottom right and scale in bottom left. You can customize these controls with the `controls` prop.

`controls` is an array of controls definition. Each one takes a `control` and a `position` attribute. `position` will tells in which place the control should be add. `control` is the control to add. It may be a string representing a bundled control or a [custom class which implements IControl](https://docs.mapbox.com/mapbox-gl-js/api/#icontrol).

You can import the default set if you want just to add some more controls :

`import { DEFAULT_CONTROLS } from '@terralego/core/modules/Map/Map';`
