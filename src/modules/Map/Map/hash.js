/* eslint-disable no-underscore-dangle */
import debounce from 'lodash.debounce';

/*
 * Adds the map's position to its page's location hash.
 * Passed as an option to the map object.
 *
 * @returns {Hash} `this`
 */
class Hash {
  constructor (hashName) {
    this._hashName = hashName;

    // Mobile Safari doesn't allow updating the hash more than 100 times per 30 seconds.
    this._updateHash = debounce(this._updateHashUnthrottled.bind(this), 30 * 1000 / 100);
  }

  /*
   * Map element to listen for coordinate changes
   *
   * @param {Object} map
   * @returns {Hash} `this`
   */
  addTo (map) {
    this._map = map;
    window.addEventListener('hashchange', this._onHashChange, false);
    this._map.on('moveend', this._updateHash);
    return this;
  }

  /*
   * Removes hash
   *
   * @returns {Popup} `this`
   */
  remove () {
    window.removeEventListener('hashchange', this._onHashChange, false);
    this._map.off('moveend', this._updateHash);
    clearTimeout(this._updateHash());

    delete this._map;
    return this;
  }

  getHashString (mapFeedback) {
    const center = this._map.getCenter();
    const zoom = Math.round(this._map.getZoom() * 100) / 100;
    // derived from equation: 512px * 2^z / 360 / 10^d < 0.5px
    const precision = Math.ceil((zoom * Math.LN2 + Math.log(512 / 360 / 0.5)) / Math.LN10);
    const m = 10 ** precision;
    const lng = Math.round(center.lng * m) / m;
    const lat = Math.round(center.lat * m) / m;
    const bearing = this._map.getBearing();
    const pitch = this._map.getPitch();

    let hash = '';
    if (mapFeedback) {
      // new map feedback site has some constraints that don't allow
      // us to use the same hash format as we do for the Map hash option.
      hash += `#/${lng}/${lat}/${zoom}`;
    } else {
      hash += `#${zoom}/${lat}/${lng}`;
    }

    if (bearing || pitch) hash += (`/${Math.round(bearing * 10) / 10}`);
    if (pitch) hash += (`/${Math.round(pitch)}`);
    return hash;
  }

  _onHashChange = () => {
    let loc = '';
    if (this._hashName) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      loc = params.get(this._hashName).split('/');
    } else {
      loc = window.location.hash.replace('#', '').split('/');
    }
    if (loc.length >= 3) {
      this._map.jumpTo({
        center: [+loc[2], +loc[1]],
        zoom: +loc[0],
        bearing: +(loc[3] || 0),
        pitch: +(loc[4] || 0),
      });
      return true;
    }
    return false;
  }

  _updateHashUnthrottled () {
    let hash = this.getHashString();
    if (this._hashName) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      params.set(this._hashName, hash.slice(1));
      hash = '#';
      const components = [];
      params.forEach((value, key) => {
        components.push(`${key}=${value}`);
      });
      hash += components.join('&');
    }
    try {
      window.history.replaceState(window.history.state, '', hash);
    } catch (SecurityError) {
      // IE11 does not allow this if the page is within an iframe created
      // with iframe.contentWindow.document.write(...).
      // https://github.com/mapbox/mapbox-gl-js/issues/7410
    }
  }
}

export default Hash;
