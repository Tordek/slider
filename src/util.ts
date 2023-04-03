import type { Direction } from './interface';

export function getOffset(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

export function getPositionStyle(direction: Direction, offset: number) {
  switch (direction) {
    case 'rtl':
      return {
        right: `${offset * 100}%`,
        transform: 'translateX(50%)',
      };

    case 'btt':
      return {
        bottom: `${offset * 100}%`,
        transform: 'translateY(50%)',
      };

    case 'ttb':
      return {
        top: `${offset * 100}%`,
        transform: 'translateY(-50%)',
      };

    default:
      return {
        left: `${offset * 100}%`,
        transform: 'translateX(-50%)',
      };
  }
}

/** Return index value if is list or return value directly */
export function getIndex<T>(value: T | T[], index: number) {
  return Array.isArray(value) ? value[index] : value;
}
