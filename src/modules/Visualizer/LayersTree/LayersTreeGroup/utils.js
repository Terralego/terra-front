export const isGroupHidden = (layers, getLayerState) => layers.reduce((prev, layer) =>
  (prev && (
    layer.layers
      ? (getLayerState({ layer }).hidden ||
        isGroupHidden(layer.layers, getLayerState))
      : getLayerState({ layer }).hidden
  )),
true);

export default { isGroupHidden };
