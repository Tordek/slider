import React, { useContext, useMemo } from 'react';
import { InternalMarkObj } from '../Marks';
import SliderContext from '../context';
import Dot from './Dot';

export interface StepsProps {
  marks: InternalMarkObj[];
  className?: string;
  dotClassName?: string;
  activeClassName?: string;
}

export default function Steps({
  marks,
  className,
  dotClassName,
  activeClassName,
}: StepsProps) {
  const { min, max, step } = useContext(SliderContext);

  const stepDots = useMemo(() => {
    const dotSet = new Set<number>();

    // Add marks
    marks.forEach((mark) => {
      dotSet.add(mark.value);
    });

    // Fill dots
    if (step !== null) {
      for (let current = min; current <= max; current += step) {
        dotSet.add(current);
      }
    }

    return Array.from(dotSet);
  }, [min, max, step, marks]);

  return (
    <div className={className}>
      {stepDots.map((dotValue) => (
        <Dot
          key={dotValue}
          value={dotValue}
          className={dotClassName}
          activeClassName={activeClassName}
        />
      ))}
    </div>
  );
}
