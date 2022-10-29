import * as React from 'react';
import clsx from 'clsx';
import { getDirectionStyle } from '../util';
import SliderContext from '../context';

export interface MarkProps {
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  value: number;
  onClick: (value: number) => void;
}

export default function Mark(props: MarkProps) {
  const { style, children, value, onClick, className, activeClassName } = props;
  const { min, max, direction, includedStart, includedEnd, included } =
    React.useContext(SliderContext);

  // ============================ Offset ============================
  const positionStyle = getDirectionStyle(direction, value, min, max);

  return (
    <span
      className={clsx(
        className,
        included && includedStart <= value && value <= includedEnd && activeClassName,
      )}
      style={{
        ...positionStyle,
        ...style,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={() => {
        onClick(value);
      }}
    >
      {children}
    </span>
  );
}
