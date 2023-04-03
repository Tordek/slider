import React, { useContext } from 'react';
import clsx from 'clsx';
import SliderContext from '../context';
import { getPositionStyle, getIndex, getOffset } from '../util';
import { OnStartMove } from '../interface';

interface RenderProps {
  index: number;
  value: number;
  dragging: boolean;
}

export interface HandleProps {
  className?: string;
  draggingClassName?: string;
  value: number;
  valueIndex: number;
  dragging: boolean;
  onStartMove: OnStartMove;
  onOffsetChange: (offset: number | 'min' | 'max', valueIndex: number) => void;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  handleRenderer?: (
    origin: React.ReactElement<HandleProps>,
    props: RenderProps
  ) => React.ReactElement;
}

const Handle = React.forwardRef<HTMLDivElement, HandleProps>(
  (
    {
      className,
      draggingClassName,
      value,
      valueIndex,
      onStartMove,
      handleRenderer,
      dragging,
      onOffsetChange,
      ...restProps
    },
    ref
  ) => {
    const {
      min,
      max,
      direction,
      disabled,
      tabIndex,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaValueTextFormatterForHandle,
    } = useContext(SliderContext);

    // ============================ Events ============================
    const onInternalStartMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) {
        return;
      }
      onStartMove(e, valueIndex);
    };

    // =========================== Keyboard ===========================
    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      let offset: number | 'min' | 'max' | null = null;

      // Change the value
      switch (e.key) {
        case 'ArrowLeft':
          offset = direction === 'ltr' || direction === 'btt' ? -1 : 1;
          break;

        case 'ArrowRight':
          offset = direction === 'ltr' || direction === 'btt' ? 1 : -1;
          break;

        case 'ArrowUp':
          offset = direction === 'ttb' ? -1 : 1;
          break;

        case 'ArrowDown':
          offset = direction === 'ttb' ? 1 : -1;
          break;

        case 'Home':
          offset = 'min';
          break;

        case 'End':
          offset = 'max';
          break;

        case 'PageUp':
          offset = 2;
          break;

        case 'PageDown':
          offset = -2;
          break;
      }

      if (offset === null) {
        return;
      }

      e.preventDefault();
      onOffsetChange(offset, valueIndex);
    };

    // ============================ Offset ============================
    const positionStyle = getPositionStyle(
      direction,
      getOffset(value, min, max)
    );

    // ============================ Render ============================
    const handleNode = (
      <div
        ref={ref}
        className={clsx(className, dragging && draggingClassName)}
        style={positionStyle}
        onMouseDown={onInternalStartMove}
        onTouchStart={onInternalStartMove}
        onKeyDown={onKeyDown}
        tabIndex={
          disabled ? undefined : getIndex(tabIndex, valueIndex) ?? undefined
        }
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        aria-label={getIndex(ariaLabelForHandle, valueIndex)}
        aria-labelledby={getIndex(ariaLabelledByForHandle, valueIndex)}
        aria-valuetext={getIndex(
          ariaValueTextFormatterForHandle,
          valueIndex
        )?.(value)}
        {...restProps}
      />
    );

    // Customize
    if (handleRenderer) {
      return handleRenderer(handleNode, {
        index: valueIndex,
        value,
        dragging,
      });
    }

    return handleNode;
  }
);

if (process.env.NODE_ENV !== 'production') {
  Handle.displayName = 'Handle';
}

export default Handle;
