/* eslint react/no-multi-comp: 0, max-len: 0 */
import React from 'react';
import Slider from '@tordek/rc-slider';
import '../../assets/index.less';
import '../docs.less';
import TooltipSlider from './components/TooltipSlider';

const style = { width: 600, margin: 50 };

function log(value) {
  console.log(value); //eslint-disable-line
}

function percentFormatter(v) {
  return `${v} %`;
}

// const SliderWithTooltip = createSliderWithTooltip(Slider);

class NullableSlider extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  onSliderChange = (value) => {
    log(value);
    this.setState({
      value,
    });
  };
  

  reset = () => {
    console.log('reset value'); // eslint-disable-line
    this.setState({ value: null });
  };

  render() {
    return (
      <div>
        <Slider
          value={this.state.value}
          onChange={this.onSliderChange}
        />
        <button type="button" onClick={this.reset}>
          Reset
        </button>
      </div>
    );
  }
}

const NullableRangeSlider = () => {
  const [value, setValue] = React.useState(null);

  return (
    <div>
      <Slider range value={value} onChange={setValue} />
      <button type="button" onClick={() => setValue(null)}>
        Reset
      </button>
    </div>
  );
};

class CustomizedSlider extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: 50,
    };
  }

  onSliderChange = (value) => {
    log(value);
    this.setState({
      value,
    });
  };

  render() {
    return (
      <Slider
        value={this.state.value}
        onChange={this.onSliderChange}
      />
    );
  }
}

class DynamicBounds extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      min: 1,
      max: 100,
      step: 10,
      value: 1,
    };
  }

  onSliderChange = (value) => {
    log(value);
    this.setState({ value });
  };

  onMinChange = (e) => {
    this.setState({
      min: +e.target.value || 0,
    });
  };

  onMaxChange = (e) => {
    this.setState({
      max: +e.target.value || 100,
    });
  };

  onStepChange = (e) => {
    this.setState({
      step: +e.target.value || 1,
    });
  };

  render() {
    const labelStyle = { minWidth: '60px', display: 'inline-block' };
    const inputStyle = { marginBottom: '10px' };
    return (
      <div>
        <label style={labelStyle}>Min: </label>
        <input
          type="number"
          value={this.state.min}
          onChange={this.onMinChange}
          style={inputStyle}
        />
        <br />
        <label style={labelStyle}>Max: </label>
        <input
          type="number"
          value={this.state.max}
          onChange={this.onMaxChange}
          style={inputStyle}
        />
        <br />
        <label style={labelStyle}>Step: </label>
        <input
          type="number"
          value={this.state.step}
          onChange={this.onStepChange}
          style={inputStyle}
        />
        <br />
        <br />
        <label style={labelStyle}>Value: </label>
        <span>{this.state.value}</span>
        <br />
        <br />
        <Slider
          value={this.state.value}
          min={this.state.min}
          max={this.state.max}
          step={this.state.step}
          onChange={this.onSliderChange}
        />
      </div>
    );
  }
}

export default () => (
  <div>
    <div style={style}>
      <p>Basic Slider</p>
      <Slider onChange={log} />
    </div>
    <div style={style}>
      <p>Basic Slider, `startPoint=50`</p>
      <Slider onChange={log} startPoint={50} />
    </div>
    <div style={style}>
      <p>Slider reverse</p>
      <Slider onChange={log} reverse min={20} max={60} />
    </div>
    <div style={style}>
      <p>Basic Slider, `step=20`</p>
      <Slider step={20} defaultValue={50} />
    </div>
    <div style={style}>
      <p>Basic Slider, `step=20, dots`</p>
      <Slider dots step={20} defaultValue={100} />
    </div>
    <div style={style}>
      <p>
        Basic Slider, `step=20, dots, dotStyle={"{borderColor: 'orange'}"}, activeDotStyle=
        {"{borderColor: 'yellow'}"}`
      </p>
      <Slider
        dots
        step={20}
        defaultValue={100}
        dotClassName="rc-slider-dot docs-slider-dot"
        activeDotClassName="rc-slider-dot-active docs-slider-dot-active"
      />
    </div>
    <div style={style}>
      <p>Slider with tooltip, with custom `tipFormatter`</p>
      <TooltipSlider
        tipFormatter={percentFormatter}
        tipProps={{ overlayClassName: 'foo' }}
        onChange={log}
      />
    </div>
    <div style={style}>
      <p>
        Slider with custom handle and track style.<strong>(old api, will be deprecated)</strong>
      </p>
      <Slider
        defaultValue={30}
        railClassName="rc-slider-rail docs-slider-rail"
        trackClassName="rc-slider-track docs-slider-track"
        handleClassName="rc-slider-handle docs-handle-handle"
      />
    </div>
    <div style={style}>
      <p>
        Slider with custom handle and track style.<strong>(The recommended new api)</strong>
      </p>
      <Slider
        defaultValue={30}
        railClassName="rc-slider-rail docs-slider-rail"
        trackClassName="rc-slider-track docs-slider-track"
        handleClassName="rc-slider-handle docs-handle-handle"
      />
    </div>
    <div style={style}>
      <p>
        Reversed Slider with custom handle and track style.
        <strong>(The recommended new api)</strong>
      </p>
      <Slider
        defaultValue={30}
        railClassName="rc-slider-rail docs-slider-rail"
        trackClassName="rc-slider-track docs-slider-track"
        handleClassName="rc-slider-handle docs-handle-handle"
      />
    </div>
    <div style={style}>
      <p>Basic Slider, disabled</p>
      <Slider onChange={log} disabled />
    </div>
    <div style={style}>
      <p>Controlled Slider</p>
      <Slider value={50} />
    </div>
    <div style={style}>
      <p>Customized Slider</p>
      <CustomizedSlider />
    </div>
    <div style={style}>
      <p>Slider with null value and reset button</p>
      <NullableSlider />
    </div>
    <div style={style}>
      <p>Range Slider with null value and reset button</p>
      <NullableRangeSlider />
    </div>
    <div style={style}>
      <p>Slider with dynamic `min` `max` `step`</p>
      <DynamicBounds />
    </div>
  </div>
);
