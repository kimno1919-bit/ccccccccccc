import React, { useState, useEffect, useRef } from 'react';

const SlotMachine = ({ isDrawing, result, items, onComplete }) => {
  const [displayItem, setDisplayItem] = useState('?');
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isDrawing && items.length > 0) {
      setSpinning(true);
      intervalRef.current = setInterval(() => {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setDisplayItem(randomItem);
      }, 60); // fast spinning
    } else if (!isDrawing && spinning) {
      // Stopping
      clearInterval(intervalRef.current);
      if (result) {
        setDisplayItem(result);
      }
      setSpinning(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // Wait a bit before completing
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isDrawing, items, result, spinning, onComplete]);

  return (
    <div className="slot">
      <div className="slot-inner">
        <div className={`slot-item ${!isDrawing && result ? 'winner' : ''}`}>
          {displayItem || '?'}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
