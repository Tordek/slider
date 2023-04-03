import React, { useImperativeHandle, useRef } from 'react';
import Handle from './Handle';
import { HandleProps } from './Handle';
import { getIndex } from '../util';
import { OnStartMove } from '../interface';

export interface HandlesProps {
  values: number[];
  handleClassName?: string | string[];
  draggingClassName?: string;
  onStartMove: OnStartMove;
  onOffsetChange: (value: number | 'min' | 'max', valueIndex: number) => void;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  handleRenderer?: HandleProps['handleRenderer'];
  draggingIndex: number | null;
}

export interface HandlesRef {
  focus: (index: number) => void;
}

const Handles = React.forwardRef<HandlesRef, HandlesProps>(
  ({ handleClassName, values, draggingIndex, ...restProps }, ref) => {
    const handlesRef = useRef<Record<number, HTMLDivElement>>({});

    useImperativeHandle(ref, () => ({
      focus: (index: number) => {
        handlesRef.current[index]?.focus();
      },
    }));

    return (
      <>
        {values.map((value, index) => (
          <Handle
            ref={(node) => {
              if (node) {
                handlesRef.current[index] = node;
              } else {
                delete handlesRef.current[index];
              }
            }}
            dragging={draggingIndex === index}
            className={getIndex(handleClassName, index)}
            key={`${index}+${value}`}
            value={value}
            valueIndex={index}
            {...restProps}
          />
        ))}
      </>
    );
  }
);

export default Handles;
