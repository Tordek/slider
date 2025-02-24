/**
 * @jest-environment jsdom
 */

import React from 'react';
import clsx from 'clsx';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import keyCode from 'rc-util/lib/KeyCode';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Slider from '../src/Slider';
import Range, { RangeRef } from '../src/Range';

describe('Slider', () => {
  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      getBoundingClientRect: () => ({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      }),
    });
  });

  it('should render Slider with correct DOM structure', () => {
    const { asFragment } = render(<Slider value={0} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should render Slider with value correctly', () => {
    const { container } = render(<Slider value={50} />);
    expect(container.getElementsByClassName('rc-slider-handle')[0]).toHaveStyle(
      { left: '50%' }
    );
    expect(container.getElementsByClassName('rc-slider-track')[0]).toHaveStyle({
      left: '0%',
      width: '50%',
    });
  });

  it('should render Slider correctly where value > startPoint', () => {
    const { container } = render(<Slider value={50} startPoint={20} />);
    expect(container.getElementsByClassName('rc-slider-handle')[0]).toHaveStyle(
      { left: '50%' }
    );
    expect(container.getElementsByClassName('rc-slider-track')[0]).toHaveStyle({
      left: '20%',
      width: '30%',
    });
  });

  it('should render Slider correctly where value < startPoint', () => {
    const { container } = render(<Slider value={40} startPoint={60} />);
    expect(container.getElementsByClassName('rc-slider-handle')[0]).toHaveStyle(
      { left: '40%' }
    );
    expect(container.getElementsByClassName('rc-slider-track')[0]).toHaveStyle({
      left: '40%',
      width: '20%',
    });
  });

  it('should render reverse Slider with value correctly', () => {
    const { container } = render(<Slider value={50} reverse />);
    expect(container.getElementsByClassName('rc-slider-handle')[0]).toHaveStyle(
      { right: '50%' }
    );
    expect(container.getElementsByClassName('rc-slider-track')[0]).toHaveStyle({
      right: '0%',
      width: '50%',
    });
  });

  it('should render reverse Slider correctly where value > startPoint', () => {
    const { container } = render(<Slider value={50} startPoint={20} reverse />);
    expect(container.getElementsByClassName('rc-slider-handle')[0]).toHaveStyle(
      { right: '50%' }
    );
    expect(container.getElementsByClassName('rc-slider-track')[0]).toHaveStyle({
      right: '20%',
      width: '30%',
    });
  });

  it('should render reverse Slider correctly where value < startPoint', () => {
    const { container } = render(<Slider value={30} startPoint={50} reverse />);
    expect(container.getElementsByClassName('rc-slider-handle')[0]).toHaveStyle(
      { right: '30%' }
    );
    expect(container.getElementsByClassName('rc-slider-track')[0]).toHaveStyle({
      right: '30%',
      width: '20%',
    });
  });

  it('should render reverse Slider with marks correctly', () => {
    const marks = { 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10' };
    const { container } = render(
      <Slider value={0} marks={marks} min={5} max={10} reverse />
    );
    expect(
      container.getElementsByClassName('rc-slider-mark-text')[0]
    ).toHaveStyle({ right: '0%' });
  });

  it('should render Slider without handle if value is null', () => {
    const { asFragment } = render(<Slider value={null} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should allow tabIndex to be set on Handle via Slider', () => {
    const { container } = render(<Slider value={0} tabIndex={1} />);
    expect(
      container.getElementsByClassName('rc-slider-handle')[0]
    ).toHaveAttribute('tabIndex', '1');
  });

  it('increases the value when key "up" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.UP,
    });

    expect(onChange).toHaveBeenCalledWith(51);
  });

  it('decreases the value for reverse-vertical when key "up" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Slider value={50} onChange={onChange} reverse vertical />
    );

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.UP,
    });

    expect(onChange).toHaveBeenCalledWith(49);
  });

  it('increases the value when key "right" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.RIGHT,
    });

    expect(onChange).toHaveBeenCalledWith(51);
  });

  it('decreases the value for reverse-horizontal when key "right" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Slider value={50} reverse onChange={onChange} />
    );

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.RIGHT,
    });

    expect(onChange).toHaveBeenCalledWith(49);
  });

  it('increases the value when key "page up" is pressed, by a factor 2', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.PAGE_UP,
    });

    expect(onChange).toHaveBeenCalledWith(52);
  });

  it('decreases the value when key "down" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.DOWN,
    });

    expect(onChange).toHaveBeenCalledWith(49);
  });

  it('decreases the value when key "left" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.LEFT,
    });

    expect(onChange).toHaveBeenCalledWith(49);
  });

  it('it should work fine when arrow key is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Range value={[20, 50]} onChange={onChange} />
    );

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[1], {
      keyCode: keyCode.LEFT,
    });
    expect(onChange).toHaveBeenCalledWith([20, 49]);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[1], {
      keyCode: keyCode.RIGHT,
    });
    expect(onChange).toHaveBeenCalledWith([20, 51]);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[1], {
      keyCode: keyCode.UP,
    });
    expect(onChange).toHaveBeenCalledWith([20, 51]);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[1], {
      keyCode: keyCode.DOWN,
    });
    expect(onChange).toHaveBeenCalledWith([20, 49]);
  });

  it('decreases the value when key "page down" is pressed, by a factor 2', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.PAGE_DOWN,
    });

    expect(onChange).toHaveBeenCalledWith(48);
  });

  it('sets the value to minimum when key "home" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.HOME,
    });

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('sets the value to maximum when the key "end" is pressed', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={50} onChange={onChange} />);

    fireEvent.keyDown(container.getElementsByClassName('rc-slider-handle')[0], {
      keyCode: keyCode.END,
    });

    expect(onChange).toHaveBeenCalledWith(100);
  });

  describe('when component has fixed values', () => {
    it('increases the value when key "up" is pressed', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider
          min={20}
          value={40}
          marks={{ 20: 20, 40: 40, 100: 100 }}
          step={null}
          onChange={onChange}
        />
      );
      fireEvent.keyDown(
        container.getElementsByClassName('rc-slider-handle')[0],
        {
          keyCode: keyCode.UP,
        }
      );
      expect(onChange).toHaveBeenCalledWith(100);
    });

    it('increases the value when key "right" is pressed', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider
          min={20}
          value={40}
          marks={{ 20: 20, 40: 40, 100: 100 }}
          step={null}
          onChange={onChange}
        />
      );
      fireEvent.keyDown(
        container.getElementsByClassName('rc-slider-handle')[0],
        {
          keyCode: keyCode.RIGHT,
        }
      );
      expect(onChange).toHaveBeenCalledWith(100);
    });

    it('decreases the value when key "down" is pressed', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider
          min={20}
          value={40}
          marks={{ 20: 20, 40: 40, 100: 100 }}
          step={null}
          onChange={onChange}
        />
      );
      fireEvent.keyDown(
        container.getElementsByClassName('rc-slider-handle')[0],
        {
          keyCode: keyCode.DOWN,
        }
      );
      expect(onChange).toHaveBeenCalledWith(20);
    });

    it('decreases the value when key "left" is pressed', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider
          min={20}
          value={40}
          marks={{ 20: 20, 40: 40, 100: 100 }}
          step={null}
          onChange={onChange}
        />
      );
      fireEvent.keyDown(
        container.getElementsByClassName('rc-slider-handle')[0],
        {
          keyCode: keyCode.LEFT,
        }
      );
      expect(onChange).toHaveBeenCalledWith(20);
    });

    it('sets the value to minimum when key "home" is pressed', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider
          min={20}
          value={100}
          marks={{ 20: 20, 40: 40, 100: 100 }}
          step={null}
          onChange={onChange}
        />
      );
      fireEvent.keyDown(
        container.getElementsByClassName('rc-slider-handle')[0],
        {
          keyCode: keyCode.HOME,
        }
      );
      expect(onChange).toHaveBeenCalledWith(20);
    });

    it('sets the value to maximum when the key "end" is pressed', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider
          min={20}
          value={20}
          marks={{ 20: 20, 40: 40, 100: 100 }}
          step={null}
          onChange={onChange}
        />
      );
      fireEvent.keyDown(
        container.getElementsByClassName('rc-slider-handle')[0],
        {
          keyCode: keyCode.END,
        }
      );
      expect(onChange).toHaveBeenCalledWith(100);
    });
  });

  it('keyboard mix with step & marks', () => {
    const onChange = jest.fn();

    // [0], 3, 7, 10
    const { container } = render(
      <Slider
        min={0}
        max={10}
        step={10}
        value={3}
        marks={{ 3: 3, 7: 7 }}
        onChange={onChange}
      />
    );
    const handler = container.getElementsByClassName('rc-slider-handle')[0];

    // 0, 3 -> [7], 10
    onChange.mockReset();
    fireEvent.keyDown(handler, { keyCode: keyCode.UP });
    expect(onChange).toHaveBeenCalledWith(7);

    // [0] <- 3, 7, 10
    onChange.mockReset();
    fireEvent.keyDown(handler, { keyCode: keyCode.DOWN });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('sets aria-label on the handle', () => {
    const { container } = render(
      <Slider value={0} ariaLabelForHandle="Some Label" />
    );
    expect(
      container.getElementsByClassName('rc-slider-handle')[0]
    ).toHaveAttribute('aria-label', 'Some Label');
  });

  it('sets aria-labelledby on the handle', () => {
    const { container } = render(
      <Slider value={0} ariaLabelledByForHandle="some_id" />
    );
    expect(
      container.getElementsByClassName('rc-slider-handle')[0]
    ).toHaveAttribute('aria-labelledby', 'some_id');
  });

  it('sets aria-valuetext on the handle', () => {
    const { container } = render(
      <Slider
        min={0}
        max={5}
        value={3}
        ariaValueTextFormatterForHandle={(value) => `${value} of something`}
      />
    );
    const handle = container.getElementsByClassName('rc-slider-handle')[0];
    expect(handle).toHaveAttribute('aria-valuetext', '3 of something');
  });

  describe('focus & blur', () => {
    it('focus', () => {
      const handleFocus = jest.fn();
      const { container, unmount } = render(
        <Slider min={0} max={10} value={0} onFocus={handleFocus} />
      );
      (
        container.getElementsByClassName('rc-slider-handle')[0] as HTMLElement
      ).focus();
      expect(handleFocus).toBeCalled();

      unmount();
    });

    it('blur', () => {
      const handleBlur = jest.fn();
      const { container, unmount } = render(
        <Slider min={0} max={10} value={0} onBlur={handleBlur} />
      );
      (
        container.getElementsByClassName('rc-slider-handle')[0] as HTMLElement
      ).focus();
      (
        container.getElementsByClassName('rc-slider-handle')[0] as HTMLElement
      ).blur();
      expect(handleBlur).toBeCalled();

      unmount();
    });

    it('ref focus & blur', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const ref = React.createRef<RangeRef>();
      render(<Slider value={0} ref={ref} onFocus={onFocus} onBlur={onBlur} />);

      ref.current?.focus();
      expect(onFocus).toBeCalled();

      ref.current?.blur();
      expect(onBlur).toBeCalled();
    });
  });

  it('should not be out of range when value is null', () => {
    const { container, rerender } = render(
      <Slider value={null} min={1} max={10} />
    );
    expect(container.getElementsByClassName('rc-slider-track')).toHaveLength(0);

    rerender(<Slider value={0} min={1} max={10} />);
    expect(container.getElementsByClassName('rc-slider-track')).toHaveLength(1);
  });

  describe('click slider to change value', () => {
    it('ltr', () => {
      const onChange = jest.fn();
      const { container } = render(<Slider value={0} onChange={onChange} />);
      fireEvent.mouseDown(container.querySelector('.rc-slider')!, {
        clientX: 20,
      });

      expect(onChange).toHaveBeenCalledWith(20);
    });

    it('rtl', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider value={0} onChange={onChange} reverse />
      );
      fireEvent.mouseDown(container.querySelector('.rc-slider')!, {
        clientX: 20,
      });

      expect(onChange).toHaveBeenCalledWith(80);
    });

    it('btt', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider value={0} onChange={onChange} vertical />
      );
      fireEvent.mouseDown(container.querySelector('.rc-slider')!, {
        clientY: 93,
      });

      expect(onChange).toHaveBeenCalledWith(7);
    });

    it('ttb', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Slider value={0} onChange={onChange} vertical reverse />
      );
      fireEvent.mouseDown(container.querySelector('.rc-slider')!, {
        clientY: 93,
      });

      expect(onChange).toHaveBeenCalledWith(93);
    });

    it('null value click to become 2 values', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Range value={null} range onChange={onChange} />
      );
      fireEvent.mouseDown(container.querySelector('.rc-slider')!, {
        clientX: 20,
      });

      expect(onChange).toHaveBeenCalledWith([20, 20]);
    });
  });

  it('autoFocus', () => {
    const onFocus = jest.fn();
    render(<Slider value={0} autoFocus onFocus={onFocus} />);

    expect(onFocus).toHaveBeenCalled();
  });

  it('custom handle', () => {
    const { container } = render(
      <Slider
        value={0}
        handleRender={(node) =>
          React.cloneElement(node, {
            className: clsx(node.props.className, 'custom-handle'),
          })
        }
      />
    );

    expect(container.querySelector('.custom-handle')).toBeTruthy();
  });

  // FIXME
  it('max value not align with step', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Slider
        min={0.5}
        max={2}
        step={1}
        defaultValue={1.5}
        onChange={onChange}
      />
    );
    fireEvent.keyDown(container.querySelector('.rc-slider-handle')!, {
      keyCode: keyCode.RIGHT,
    });

    expect(onChange).toHaveBeenCalledWith(2);
    expect(
      (container.querySelector('.rc-slider-handle') as HTMLElement).style.left
    ).toBe('100%');
  });

  it('not show decimal', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Slider
        min={0}
        max={1}
        step={0.01}
        defaultValue={0.81}
        onChange={onChange}
      />
    );
    fireEvent.keyDown(container.querySelector('.rc-slider-handle')!, {
      keyCode: keyCode.RIGHT,
    });
    expect(onChange).toHaveBeenCalledWith(0.82);
  });
});
