import { useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import Masonry from 'masonry-layout';
import { useThrottledCallback } from 'use-debounce';
import './App.scss';

const imageCategories = ['animals', 'arch', 'nature', 'people', 'tech'];

function App() {
  const [categoriesState, setCategoriesState] = useState(
    imageCategories.map((_) => true),
  );

  const elementRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<Masonry>();

  const images = useMemo(() => {
    const trueCount = categoriesState.filter(Boolean).length;
    const availableCategories = imageCategories.filter(
      (_, idx) => categoriesState[idx],
    );
    return Array.from(
      { length: 20 },
      (_v, _k) =>
        `https://placeimg.com/400/${getRandomInt(200, 500)}/${
          availableCategories[getRandomInt(0, trueCount)]
        }`,
    );
  }, [categoriesState]);

  const handleLayout = useThrottledCallback(() => {
    masonryRef.current?.layout?.();
  }, 500);

  const handleCategoryClick = (category: string) => {
    const idx = imageCategories.indexOf(category);
    categoriesState[idx] = !categoriesState[idx];
    setCategoriesState([...categoriesState]);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      masonryRef.current = new Masonry(element, {
        columnWidth: '.grid-sizer',
        itemSelector: '.grid-item',
        percentPosition: true,
      });
      return () => masonryRef.current?.destroy?.();
    }
  }, [images]);

  return (
    <div>
      <div className="button-group">
        {imageCategories.map((category, idx) => (
          <button
            key={category}
            className={cx({
              selected: categoriesState[idx],
            })}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid" ref={elementRef}>
        <div className="grid-sizer" />
        {images.map((image, idx) => (
          <div key={`${image}_${idx}`} className="grid-item">
            <img src={image} onLoad={handleLayout} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

/**
 * 두 값 사이의 정수 난수 반환 (min ~ max)
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
