# rc-slider

Slider UI component for React

Forked off rc-slider to add support for passing classNames to parts of the slider.

[![NPM version][npm-image]][npm-url] [![build status][github-actions-image]][github-actions-url] [![Test coverage][coveralls-image]][coveralls-url] [![npm download][download-image]][download-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: http://img.shields.io/npm/v/@tordek/rc-slider.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@tordek/rc-slider
[github-actions-image]: https://github.com/tordek/slider/workflows/CI/badge.svg
[github-actions-url]: https://github.com/tordek/slider/actions
[circleci-image]: https://img.shields.io/circleci/tordek/slider/master?style=flat-square
[circleci-url]: https://circleci.com/gh/tordek/slider
[coveralls-image]: https://img.shields.io/coveralls/tordek/slider.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/tordek/slider?branch=master
[download-image]: https://img.shields.io/npm/dm/@tordek/rc-slider.svg?style=flat-square
[download-url]: https://npmjs.org/package/@tordek/rc-slider
[bundlephobia-url]: https://bundlephobia.com/result?p=@tordek/rc-slider
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@tordek/rc-slider

## Install

[![@tordek/rc-slider](https://nodei.co/npm/@tordek/rc-slider.png)](https://npmjs.org/package/@tordek/rc-slider)

## Example

`npm start` and then go to http://localhost:8000

Online examples: https://slider.react-component.now.sh/

## Usage

```js
import Slider from '@tordek/rc-slider';
import 'rc-slider/assets/index.css';

export default () => (
  <>
    <Slider />
    <Slider range />
  </>
);
```

## Compatibility

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| --- | --- | --- | --- | --- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## API

### createSliderWithTooltip(Slider | Range) => React.Component

An extension to make Slider or Range support Tooltip on handle.

```js
const Slider = require('@tordek/rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
```

[Online demo](http://react-component.github.io/slider/?path=/story/rc-slider--handle)

After Range or Slider was wrapped by createSliderWithTooltip, it will have the following props:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tipFormatter | (value: number): React.ReactNode | `value => value` | A function to format tooltip's overlay |
| tipProps | Object | `{` <br>`placement: 'top',` <br> ` prefixCls: 'rc-slider-tooltip',` <br> `overlay: tipFormatter(value)` <br> `}` | A function to format tooltip's overlay |

### Common API

The following APIs are shared by Slider and Range.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| className | string | `''` | Additional CSS class for the root DOM node |
| min | number | `0` | The minimum value of the slider |
| max | number | `100` | The maximum value of the slider |
| marks | `{number: ReactNode}` or`{number: { style, label }}` | `{}` | Marks on the slider. The key determines the position, and the value determines what will show. If you want to set the style of a specific mark point, the value should be an object which contains `style` and `label` properties. |
| step | number or `null` | `1` | Value to be added or subtracted on each step the slider makes. Must be greater than zero, and `max` - `min` should be evenly divisible by the step value. <br /> When `marks` is not an empty object, `step` can be set to `null`, to make `marks` as steps. |
| vertical | boolean | `false` | If vertical is `true`, the slider will be vertical. |
| handle | (props) => React.ReactNode |  | A handle generator which could be used to customized handle. |
| included | boolean | `true` | If the value is `true`, it means a continuous value interval, otherwise, it is a independent value. |
| reverse | boolean | `false` | If the value is `true`, it means the component is rendered reverse. |
| disabled | boolean | `false` | If `true`, handles can't be moved. |
| dots | boolean | `false` | When the `step` value is greater than 1, you can set the `dots` to `true` if you want to render the slider with dots. |
| onChange | Function | NOOP | `onChange` will be triggered while the value of Slider changing. |
| *ClassName | string \| string[] | varies | HTML `class` property for different elements in the slider

### Slider

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| defaultValue | number | `0` | Set initial value of slider. |
| value | number | - | Set current value of slider. |
| startPoint | number | `undefined` | Track starts from this value. If `undefined`, `min` is used. |
| tabIndex | number | `0` | Set the tabIndex of the slider handle. |
| ariaLabelForHandle | string | - | Set the `aria-label` attribute on the slider handle. |
| ariaLabelledByForHandle | string | - | Set the `aria-labelledby` attribute on the slider handle. |
| ariaValueTextFormatterForHandle | (value) => string | - | A function to set the `aria-valuetext` attribute on the slider handle. It receives the current value of the slider and returns a formatted string describing the value. See [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#slider) for more information. |

### Range

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| defaultValue | `number[]` | `[0, 0]` | Set initial positions of handles. |
| value | `number[]` |  | Set current positions of handles. |
| tabIndex | number[] | `[0, 0]` | Set the tabIndex of each handle. |
| ariaLabelGroupForHandles | Array[string] | - | Set the `aria-label` attribute on each handle. |
| ariaLabelledByGroupForHandles | Array[string] | - | Set the `aria-labelledby` attribute on each handle. |
| ariaValueTextFormatterGroupForHandles | Array[(value) => string] | - | A function to set the `aria-valuetext` attribute on each handle. It receives the current value of the slider and returns a formatted string describing the value. See [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#slider) for more information. |
| count | number | `1` | Determine how many ranges to render, and multiple handles will be rendered (number + 1). |
| allowCross | boolean | `true` | `allowCross` could be set as `true` to allow those handles to cross. |
| pushable | boolean or number | `false` | `pushable` could be set as `true` to allow pushing of surrounding handles when moving a handle. When set to a number, the number will be the minimum ensured distance between handles. Example: ![](http://i.giphy.com/l46Cs36c9HrHMExoc.gif) |
| draggableTrack | boolean | `false` | Open the track drag. open after click on the track will be invalid. |

### SliderTooltip

The Tooltip Component that keep following with content.

## Development

```
npm install
npm start
```

## Test Case

`npm run test`

## Coverage

`npm run coverage`

## License

`@tordek/rc-slider` is released under the MIT license.
