import mapBoxGl from 'mapbox-gl';
import MapboxInspect from 'mapbox-gl-inspect';
import renderInspectPopup from 'mapbox-gl-inspect/lib/renderPopup';
import 'mapbox-gl-inspect/dist/mapbox-gl-inspect.css';

export const addMapDebug = map => {
  const mapDebugMode = global.localStorage.getItem('mapDebug');
  const debugToPopup = ['*', 'popup'].includes(mapDebugMode);
  const debugToConsole = ['*', 'console'].includes(mapDebugMode);

  if (!debugToPopup && !debugToConsole) {
    return map;
  }

  const popup = new mapBoxGl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  if (!debugToPopup) {
    popup.on('open', ({ target }) => target.remove());
  }

  const renderPopup = features => {
    if (debugToConsole) {
      console.log(features); // eslint-disable-line no-console
    }
    return renderInspectPopup(features);
  };

  map.addControl(new MapboxInspect({
    popup,
    renderPopup,
    showMapPopup: true,
    showMapPopupOnHover: false,

    showInspectButton: false,
    showInspectMap: false,
    showInspectMapPopupOnHover: false,
  }));

  return map;
};

export default {
  addMapDebug,
};
