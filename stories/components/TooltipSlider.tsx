import React from 'react';
import 'rc-tooltip/assets/bootstrap.css';
import type { RangeProps } from '../../src';
import { Range } from '../../src';
import raf from 'rc-util/lib/raf';
import Tooltip from 'rc-tooltip';

export type TooltipSliderProps = {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  tipFormatter?: (value: number) => React.ReactNode;
};

const HandleTooltip = ({
  value,
  children,
  visible,
  tipFormatter = (val) => `${val} %`,
  ...restProps
}: TooltipSliderProps) => {
  const tooltipRef = React.useRef<any>();
  const rafRef = React.useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current!);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forcePopupAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: 'auto' }}
      ref={tooltipRef}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

export const handleRender: RangeProps['handleRender'] = (node, props) => {
  return (
    <HandleTooltip value={props.value} visible={props.dragging}>
      {node}
    </HandleTooltip>
  );
};

const TooltipSlider = ({
  tipFormatter,
  tipProps,
  ...props
}: RangeProps & {
  tipFormatter?: (value: number) => React.ReactNode;
  tipProps: any;
}) => {
  const tipHandleRender: RangeProps['handleRender'] = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={handleProps.dragging}
        tipFormatter={tipFormatter}
        {...tipProps}
      >
        {node}
      </HandleTooltip>
    );
  };

  return <Range {...props} handleRender={tipHandleRender} />;
};

export default TooltipSlider;
