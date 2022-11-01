import React from 'react';
import clsx from 'clsx';
import shallowEqual from 'shallowequal';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { HandlesRef } from './Handles';
import Handles from './Handles';
import { HandlesProps } from './Handles';
import useDrag from './hooks/useDrag';
import SliderContext from './context';
import Tracks from './Tracks';
import { AriaValueFormat, OnStartMove } from './interface';
import Marks from './Marks';
import { InternalMarkObj } from './Marks';
import Steps from './Steps';
import useOffset from './hooks/useOffset';

export interface RangeProps {
  /** Whether it behaves as a Range or a Slider
   * @ignore You should use the Slider element instead of setting this manually
   */
  range?: boolean;

  // Status
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;

  // Value
  /** The number of ranges */
  count?: number;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /**
   * Constrain values to multiples of `steps`.
   * If set to `null`, constrains to values in `marks`.
   * @see {@link RangeProps.marks}
   */
  step?: number | null;

  /** Selected values of handles, when using it as a controlled component */
  value?: number[] | null;

  /** Selected initial value, when using it as an uncontrolled component */
  defaultValue?: number[];

  /** Called whenever a handle is moved */
  onChange?: (value: number[]) => void;

  // Cross
  /** Allow handles to pass over each other */
  allowCross?: boolean;

  /** Moving a handle over another causes both to move [number?] */
  pushable?: boolean | number;

  /** Allow the track to be clickable and draggable */
  draggableTrack?: boolean;

  /** Invert the direction of the tracks, putting higher values on the left/bottom */
  reverse?: boolean;

  /** Alter the behavior of the Slider to allow vertical movement */
  vertical?: boolean;

  /** Whether to draw the tracks */
  included?: boolean;

  /** Starting point from where the track is drawn */
  startPoint?: number;

  /** Class for the slider's container */
  className?: string;

  /** Extra classes applued when the Slider is disabled */
  disabledClassName?: string;

  /** Extra classes applied when the Slider is in horizontal mode */
  verticalClassName?: string;

  /** Extra classes applied when the Slider is in vertical mode */
  horizontalClassName?: string;

  /** Extra classes applied when the Slider has Marks */
  withMarksClassName?: string;

  /** Class for the slider's rail - the bottom layer */
  railClassName?: string;

  /**
   * Class for the slider's tracks - the progress indicator, or distance between extreme handles.
   * If passed an array, each value is applied to a different track.
   *
   * @todo Dynamic styles - take a function (index) => string
   */
  trackClassName?: string | string[];

  /** Class for the slider's handles.
   * If passed an array, each value is applied to a different handle.
   *
   * @todo Dynamic styles - take a function (value, index) => string
   */
  handleClassName?: string | string[];

  /** Class for the slider's handles while being dragged */
  handleDraggingClassName?: string;

  /** Class for the slider's ??? */
  stepsClassName?: string;

  /** Class for the ?? */
  dotClassName?: string;

  /** Class for the slider's */
  activeDotClassName?: string;

  /** Class for the slider's marks container */
  marksClassName?: string;

  /** Class for the slider's marks
   * @deprecatad
   */
  markTextClassName?: string;

  /** Class for the slider's currently active mark */
  activeMarkTextClassName?: string;

  // Decorations
  marks?: Record<number, React.ReactNode>;

  /** Whether to display dots when `step` is set */
  dots?: boolean;

  // Components
  handleRender?: HandlesProps['handleRender'];

  // Accessibility
  tabIndex?: null | number | number[];

  /** ARIA Label for the handle */
  ariaLabelForHandle?: string | string[];

  /** ID to the Label element associated to this handle */
  ariaLabelledByForHandle?: string | string[];

  /** Function to format the ARIA tags containing the current value of each handle */
  ariaValueTextFormatterForHandle?: AriaValueFormat | AriaValueFormat[];
}

export interface RangeRef {
  focus: () => void;
  blur: () => void;
}

const Slider = React.forwardRef<RangeRef, RangeProps>(
  (
    {
      // Status
      disabled = false,
      autoFocus = false,
      onFocus,
      onBlur,

      // Value
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      range = true,
      count,
      onChange,

      // Cross
      allowCross = true,
      pushable = false,
      draggableTrack,

      // Direction
      reverse,
      vertical,

      // Style
      included = true,
      startPoint = min,

      className = 'rc-slider',
      disabledClassName = 'rc-slider-disabled',
      railClassName = 'rc-slider-rail',
      trackClassName = 'rc-slider-track',
      handleClassName = 'rc-slider-handle',
      handleDraggingClassName = 'rc-slider-handle-dragging',
      stepsClassName = 'rc-slider-step',
      dotClassName = 'rc-slider-dot',
      activeDotClassName = 'rc-slider-dot-active',
      verticalClassName = 'rc-slider-vertical',
      horizontalClassName = 'rc-slider-horizontal',
      withMarksClassName = 'rc-slider-with-marks',
      marksClassName = 'rc-slider-mark',
      markTextClassName = 'rc-slider-mark-text',
      activeMarkTextClassName = 'rc-slider-mark-text-active',

      // Decorations
      marks,
      dots,

      // Components
      handleRender,

      // Accessibility
      tabIndex = 0,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaValueTextFormatterForHandle,
    },
    ref
  ) => {
    const handlesRef = React.useRef<HandlesRef>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const direction = vertical
      ? reverse
        ? 'ttb'
        : 'btt'
      : reverse
      ? 'rtl'
      : 'ltr';

    const boundedMin = isFinite(min) ? min : 0;
    React.useEffect(() => {
      if (!isFinite(min)) {
        console.warn(
          `Invalid \`min\` value: ${min}. It must be a finite number.`
        );
      }
    }, [min]);

    const boundedMax = isFinite(max) ? max : 100;
    React.useEffect(() => {
      if (!isFinite(max)) {
        console.warn(
          `Invalid \`max\` value: ${max}. It must be a finite number.`
        );
      }
    }, [max]);

    // ============================= Step =============================
    const normalizedStep = step === null || step > 0 ? step : 1;
    React.useEffect(() => {
      if (step && step < 0) {
        console.warn(
          `Invalid \`step\` value: ${step}. \`step\` cannot be negative.`
        );
      }
    }, [step]);

    // ============================= Push =============================
    const mergedPush = React.useMemo(() => {
      if (pushable === true) {
        return normalizedStep;
      }

      return pushable >= 0 ? pushable : false;
    }, [pushable, normalizedStep]);

    // ============================ Marks =============================
    const markList = React.useMemo<InternalMarkObj[]>(() => {
      return Object.entries(marks ?? {})
        .map(([key, mark]) => ({
          value: Number(key),
          label: mark,
        }))
        .filter(({ label }) => label || typeof label === 'number')
        .sort((a, b) => a.value - b.value);
    }, [marks]);

    // ============================ Format ============================
    const { constrainValue, offsetValues: calculateOffsetValues } = useOffset(
      boundedMin,
      boundedMax,
      normalizedStep,
      markList,
      allowCross,
      mergedPush
    );

    // ============================ Values ============================
    // TODO: Use a correctly typed version of this
    const [mergedValue, setValue] = useMergedState<number[] | null, number[]>(
      defaultValue as number[],
      {
        value,
      }
    );

    const rawValues = React.useMemo(() => {
      const valueList =
        mergedValue === null || mergedValue === undefined ? [] : mergedValue;

      const [val0 = boundedMin] = valueList;
      let returnValues = mergedValue === null ? [] : [val0];

      // Format as range
      if (range) {
        returnValues = [...valueList];

        // When count provided or value is `undefined`, we fill values
        if (count || mergedValue === undefined) {
          const pointCount = count && count >= 0 ? count + 1 : 2;
          returnValues = returnValues.slice(0, pointCount);

          // Fill with count
          while (returnValues.length < pointCount) {
            returnValues.push(
              returnValues[returnValues.length - 1] ?? boundedMin
            );
          }
        }
        returnValues.sort((a, b) => a - b);
      }

      // Align in range
      returnValues.forEach((val, index) => {
        returnValues[index] = constrainValue(val);
      });

      return returnValues;
    }, [mergedValue, range, boundedMin, count, constrainValue]);

    // =========================== onChange ===========================

    const triggerChange = (nextValues: number[]) => {
      // Order first
      const cloneNextValues = [...nextValues].sort((a, b) => a - b);

      // Trigger event if needed
      if (onChange && !shallowEqual(cloneNextValues, rawValues)) {
        onChange(cloneNextValues);
      }

      // We set this later since it will re-render component immediately
      setValue(cloneNextValues);
    };

    const setClosestHandle = (newValue: number) => {
      if (disabled) {
        return;
      }
      let valueIndex = 0;
      let valueDist = boundedMax - boundedMin;

      rawValues.forEach((val, index) => {
        const dist = Math.abs(newValue - val);
        if (dist <= valueDist) {
          valueDist = dist;
          valueIndex = index;
        }
      });

      // Create new values
      const cloneNextValues = [...rawValues];

      cloneNextValues[valueIndex] = newValue;

      // Fill value to match default 2
      if (range && !rawValues.length && count === undefined) {
        cloneNextValues.push(newValue);
      }

      triggerChange(cloneNextValues);
    };

    // ============================ Click =============================
    const onSliderMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();

      if (!containerRef.current) return;

      const {
        width,
        height,
        left,
        top,
        bottom,
        right,
      } = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;

      let percent: number;
      switch (direction) {
        case 'btt':
          percent = (bottom - clientY) / height;
          break;

        case 'ttb':
          percent = (clientY - top) / height;
          break;

        case 'rtl':
          percent = (right - clientX) / width;
          break;

        case 'ltr':
          percent = (clientX - left) / width;
      }

      const nextValue = boundedMin + percent * (boundedMax - boundedMin);
      setClosestHandle(constrainValue(nextValue));
    };

    // =========================== Keyboard ===========================

    const onHandleOffsetChange = (
      offset: number | 'min' | 'max',
      valueIndex: number
    ) => {
      if (disabled) {
        return;
      }
      const next = calculateOffsetValues(rawValues, offset, valueIndex, 'unit');

      triggerChange(next.values);

      requestAnimationFrame(() => handlesRef.current?.focus(valueIndex));
    };

    // ============================= Drag =============================
    const mergedDraggableTrack = draggableTrack && normalizedStep !== null;
    React.useEffect(() => {
      if (draggableTrack && normalizedStep === null) {
        console.warn(
          '`draggableTrack` is not supported when `step` is `null`.'
        );
      }
    }, [draggableTrack, normalizedStep]);

    const { draggingIndex, draggingValue, cacheValues, onStartDrag } = useDrag(
      containerRef,
      direction,
      rawValues,
      boundedMin,
      boundedMax,
      constrainValue,
      triggerChange,
      calculateOffsetValues
    );

    const onStartMove: OnStartMove = (e, valueIndex) => {
      onStartDrag(e, valueIndex);
    };

    // Auto focus for updated handle
    const dragging = draggingIndex !== -1;
    React.useEffect(() => {
      if (!dragging) {
        const valueIndex = rawValues.lastIndexOf(draggingValue);
        handlesRef.current?.focus(valueIndex);
      }
    }, [dragging]);

    // =========================== Included ===========================
    const sortedCacheValues = React.useMemo(
      () => [...cacheValues].sort((a, b) => a - b),
      [cacheValues]
    );

    // Provide a range values with included [min, max]
    // Used for Track, Mark & Dot
    const [includedStart, includedEnd] = React.useMemo(() => {
      if (!range) {
        return [boundedMin, sortedCacheValues[0]];
      }

      return [
        sortedCacheValues[0],
        sortedCacheValues[sortedCacheValues.length - 1],
      ];
    }, [sortedCacheValues, range, boundedMin]);

    // ============================= Refs =============================
    React.useImperativeHandle(ref, () => ({
      focus: () => {
        handlesRef.current?.focus(0);
      },
      blur: () => {
        const { activeElement } = document;
        if (containerRef.current?.contains(activeElement)) {
          (activeElement as HTMLElement)?.blur();
        }
      },
    }));

    // ========================== Auto Focus ==========================
    React.useEffect(() => {
      if (autoFocus) {
        handlesRef.current?.focus(0);
      }
    }, [autoFocus]);

    // ============================ Render ============================
    return (
      <SliderContext.Provider
        value={{
          min: boundedMin,
          max: boundedMax,
          direction,
          disabled,
          step: normalizedStep,
          included,
          includedStart,
          includedEnd,
          range,
          tabIndex,
          ariaLabelForHandle,
          ariaLabelledByForHandle,
          ariaValueTextFormatterForHandle,
        }}
      >
        <div
          ref={containerRef}
          className={clsx(className, {
            [disabledClassName]: disabled,
            [verticalClassName]: vertical,
            [horizontalClassName]: !vertical,
            [withMarksClassName]: markList.length,
          })}
          onMouseDown={onSliderMouseDown}
        >
          <div className={railClassName} />

          {included && (
            <Tracks
              trackClassName={trackClassName}
              values={sortedCacheValues}
              startPoint={startPoint}
              onStartMove={mergedDraggableTrack ? onStartMove : undefined}
            />
          )}

          <Steps
            marks={markList}
            dots={dots}
            className={stepsClassName}
            dotClassName={dotClassName}
            activeClassName={activeDotClassName}
          />

          <Handles
            ref={handlesRef}
            handleClassName={handleClassName}
            draggingClassName={handleDraggingClassName}
            values={cacheValues}
            draggingIndex={draggingIndex}
            onStartMove={onStartMove}
            onOffsetChange={onHandleOffsetChange}
            onFocus={onFocus}
            onBlur={onBlur}
            handleRender={handleRender}
          />

          <Marks
            className={marksClassName}
            markClassName={markTextClassName}
            activeMarkClassName={activeMarkTextClassName}
            marks={markList}
            onClick={setClosestHandle}
          />
        </div>
      </SliderContext.Provider>
    );
  }
);

export default Slider;