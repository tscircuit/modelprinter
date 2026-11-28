/** ISO 2341:2020 Form B headed clevis pins with split-pin hole, nominal mm.
 * Reference dimensions: https://www.fasteners.eu/standards/ISO/2341/
 */
export const clevisPinSpecs = {
  "3": {
    diameter: 3,
    headDiameter: 5,
    headHeight: 1,
    splitPinHoleDiameter: 0.8,
    holeEndOffset: 1.6,
    endChamfer: 0.5,
  },
  "4": {
    diameter: 4,
    headDiameter: 6,
    headHeight: 1,
    splitPinHoleDiameter: 1,
    holeEndOffset: 2.2,
    endChamfer: 0.6,
  },
  "5": {
    diameter: 5,
    headDiameter: 8,
    headHeight: 1.6,
    splitPinHoleDiameter: 1.2,
    holeEndOffset: 2.9,
    endChamfer: 0.8,
  },
  "6": {
    diameter: 6,
    headDiameter: 10,
    headHeight: 2,
    splitPinHoleDiameter: 1.6,
    holeEndOffset: 3.2,
    endChamfer: 1,
  },
  "8": {
    diameter: 8,
    headDiameter: 14,
    headHeight: 3,
    splitPinHoleDiameter: 2,
    holeEndOffset: 3.5,
    endChamfer: 1.2,
  },
  "10": {
    diameter: 10,
    headDiameter: 18,
    headHeight: 4,
    splitPinHoleDiameter: 3.2,
    holeEndOffset: 4.5,
    endChamfer: 1.5,
  },
  "12": {
    diameter: 12,
    headDiameter: 20,
    headHeight: 4,
    splitPinHoleDiameter: 3.2,
    holeEndOffset: 5.5,
    endChamfer: 1.8,
  },
  "16": {
    diameter: 16,
    headDiameter: 25,
    headHeight: 4.5,
    splitPinHoleDiameter: 4,
    holeEndOffset: 6,
    endChamfer: 2,
  },
} as const

export const clevisPinNominalLengths = [
  8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65,
  70, 75, 80, 90, 100,
] as const

export type ClevisPinSizeKey = keyof typeof clevisPinSpecs
