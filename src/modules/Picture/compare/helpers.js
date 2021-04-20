const getBoundedScaledValue = ({ initial, upperBound, value, scale }) => {
  const scaledLowerBound = initial - initial / scale;
  const offset = upperBound - initial;
  const scaledUpperBound = offset - offset / scale;
  return Math.min(Math.max(-scaledUpperBound, value), scaledLowerBound);
};

export const getAllowedTranslation = ({ transformOrigin, container, translation, scale }) => {
  const translationX = getBoundedScaledValue({
    initial: transformOrigin.x,
    upperBound: container.width,
    value: translation.x,
    scale,
  });
  const translationY = getBoundedScaledValue({
    initial: transformOrigin.y,
    upperBound: container.height,
    value: translation.y,
    scale,
  });
  return { x: translationX, y: translationY };
};

export default { getAllowedTranslation };
