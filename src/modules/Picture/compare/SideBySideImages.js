import React, { useRef, useState, useCallback } from 'react';
import { getAllowedTranslation } from './helpers';

import ImageItem from './ImageItem';

import './SideBySide.scss';

const STEP_SCALE = 0.2;


const SideBySideImages = ({ pictures }) => {
  // might use "useReducer" instead of many "useState"
  const [scale, setScale] = useState(1);
  const [mousePosition, setMousePosition] = useState({});
  const [hoveredPictureIndex, setHoveredPictureIndex] = useState(null);
  const [transformOrigin, setTransformOrigin] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const compareDivRef = useRef(null);
  const panning = useRef(false);
  const panningInitialPosition = useRef({});

  const handlePanning = useCallback(({ x, y }) => {
    if (scale <= 1) return;

    const translationX = translate.x + (x - panningInitialPosition.current.x);
    const translationY = translate.y + (y - panningInitialPosition.current.y);
    const containerSize = compareDivRef.current.childNodes[0].getBoundingClientRect();

    // Make sure image fits in inner container
    const resTranslation = getAllowedTranslation({
      transformOrigin,
      container: containerSize,
      translation: { x: translationX, y: translationY },
      scale,
    });

    setTranslate(resTranslation);
  }, [scale, transformOrigin, translate.x, translate.y]);

  const onMouseMove = useCallback(({ nativeEvent: { offsetX: x, offsetY: y } }) => {
    panning.current && handlePanning({ x, y });
    setMousePosition({ x, y });
  }, [handlePanning, panning]);

  const onMouseUp = useCallback(() => {
    // we don't want the image to follow the cursor when key is release
    panning.current = false;
  }, []);

  const onMouseDown = useCallback(({ nativeEvent: { offsetX: x, offsetY: y } }) => {
    panning.current = true;
    panningInitialPosition.current = { x, y };
  }, []);

  const onWheel = useCallback(({ nativeEvent: { offsetX: x, offsetY: y }, deltaY }) => {
    // get new scale
    const newScale = Math.min(Math.max(scale + STEP_SCALE * (deltaY > 0 ? -1 : 1), 1), 4);
    const newTransformOrigin = newScale === 1 ? { x: 0, y: 0 } : { x, y };

    setScale(newScale);
    setTransformOrigin(newTransformOrigin);
    setTranslate({ x: 0, y: 0 });
  }, [scale]);

  return (
    <div ref={compareDivRef} className="side-by-side_compare">
      {pictures.map((picture, index) => (
        <ImageItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          picture={picture}
          index={index}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          mousePosition={mousePosition}
          showReticule={(hoveredPictureIndex !== null) && (hoveredPictureIndex !== index)}
          pictureHovered={setHoveredPictureIndex}
          transform={`scale(${scale}) translate(${translate.x}px, ${translate.y}px)`}
          transformOrigin={`${transformOrigin.x}px ${transformOrigin.y}px`}
          scale={scale}
        />
      ))}
    </div>
  );
};
export default SideBySideImages;
