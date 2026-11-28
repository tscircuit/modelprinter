/** ISO 1234:1997 split cotter pins, nominal straight-state dimensions in mm.
 * Reference dimensions: https://www.fasteners.eu/standards/ISO/1234/
 */
export const cotterPinSpecs = {
  "1.6": {
    nominalSize: 1.6,
    shankDiameter: 1.4,
    eyeOuterDiameter: 2.8,
    eyeHeight: 3.2,
    legDiff: 1.6,
  },
  "2": {
    nominalSize: 2,
    shankDiameter: 1.8,
    eyeOuterDiameter: 3.6,
    eyeHeight: 4,
    legDiff: 2,
  },
  "2.5": {
    nominalSize: 2.5,
    shankDiameter: 2.3,
    eyeOuterDiameter: 4.6,
    eyeHeight: 5,
    legDiff: 2.5,
  },
  "3.2": {
    nominalSize: 3.2,
    shankDiameter: 2.9,
    eyeOuterDiameter: 5.8,
    eyeHeight: 6.4,
    legDiff: 3.2,
  },
  "4": {
    nominalSize: 4,
    shankDiameter: 3.7,
    eyeOuterDiameter: 7.4,
    eyeHeight: 8,
    legDiff: 4,
  },
  "5": {
    nominalSize: 5,
    shankDiameter: 4.6,
    eyeOuterDiameter: 9.2,
    eyeHeight: 10,
    legDiff: 4,
  },
  "6.3": {
    nominalSize: 6.3,
    shankDiameter: 5.9,
    eyeOuterDiameter: 11.8,
    eyeHeight: 12.6,
    legDiff: 4,
  },
  "8": {
    nominalSize: 8,
    shankDiameter: 7.5,
    eyeOuterDiameter: 15,
    eyeHeight: 16,
    legDiff: 4,
  },
} as const

export const cotterPinNominalLengths = [
  6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 71, 80,
  90, 100,
] as const

export type CotterPinSizeKey = keyof typeof cotterPinSpecs
