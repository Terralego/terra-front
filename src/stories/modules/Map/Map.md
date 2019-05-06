### Customize Map controls

By default, Map will be displayed with navigation controls in top right, attribution in bottom right and scale in bottom left. You can customize these controls with the `controls` prop.

`controls` is an array of controls definition. Each one takes a `control` and a `position` attribute. `position` will tells in which place the control should be add. `control` is the control to add. It may be a string representing a bundled control or a [custom class which implements IControl](https://docs.mapbox.com/mapbox-gl-js/api/#icontrol).

You can import the default set if you want just to add some more controls :

`import { DEFAULT_CONTROLS } from '@terralego/core/modules/Map/Map';`


### Customize Map bounds box options

By default, the Map's bounding box is equal to the extent of the current viewport.
You can customize the map bounds with the `fitBounds` prop.

`fitBounds` is an object that includes `coordinates`, `padding` and `offset` attributes. 

`coordinates` attribute is an array of two points (array): 
the southwest corner and the northeast corner of the bounding box. 
([LngLatBoundsLike](https://docs.mapbox.com/mapbox-gl-js/api/#lnglatboundslike)).

`padding` attribute create a secure bleed around the bounding box. 
It is defined by an object with `top`, `bottom`, `left` and `right` keys, 
which take number of pixels as values.

`offset` attribute is an array to define the center of the given bounds relative to the map's center, 
measured in pixels.

You can change the default map bounds options at the time of first map initialisation or when the flyTo and  animations are running.  

