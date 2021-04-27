import React from 'react';

export const ImageItem = ({
  picture,
  index,
  pictureHovered,
  mousePosition: { x, y },
  showReticule,
  scale,
  transformOrigin,
  transform,
  t, // language translation function
  ...props
}) => {
  if (!picture?.file) {
    return (
      <div className="image_placeholder">
        <em>{t('pictures.compare.placeholder')}</em>
      </div>
    );
  }
  return (
    <div className="image_container">
      <div
        className="image_item"
        role="presentation"
        style={{
          backgroundImage: `url(${picture.file.full})`,
          transform: scale > 1 ? transform : '',
          transformOrigin: scale > 1 ? transformOrigin : '',

        }}
        onMouseEnter={() => pictureHovered(index)}
        onMouseLeave={() => pictureHovered(null)}
        {...props} // spreading event props with onMouseUp, OnMouseDown, onWheel, onMouseMove
      >
        <span
          className="image_reticule"
          style={{
            top: y,
            left: x,
            transform: `scale(${1 / scale})`,
            display: showReticule ? 'block' : 'none',
          }}
        />
      </div>
    </div>
  );
};


export default ImageItem;
