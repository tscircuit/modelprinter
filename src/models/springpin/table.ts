/** ISO 8752:2009 heavy-duty slotted spring pins, nominal free-state geometry in mm.
 * Reference dimensions: https://www.fasteners.eu/standards/ISO/8752/
 */
export const springPinSpecs = {
  "1.5": {
    holeDiameter: 1.5,
    freeOuterDiameter: 1.75,
    wallThickness: 0.3,
    slotWidth: 0.35,
    chamferLength: 0.3,
  },
  "2": {
    holeDiameter: 2,
    freeOuterDiameter: 2.35,
    wallThickness: 0.4,
    slotWidth: 0.4,
    chamferLength: 0.35,
  },
  "2.5": {
    holeDiameter: 2.5,
    freeOuterDiameter: 2.85,
    wallThickness: 0.5,
    slotWidth: 0.5,
    chamferLength: 0.4,
  },
  "3": {
    holeDiameter: 3,
    freeOuterDiameter: 3.4,
    wallThickness: 0.6,
    slotWidth: 0.6,
    chamferLength: 0.5,
  },
  "4": {
    holeDiameter: 4,
    freeOuterDiameter: 4.45,
    wallThickness: 0.8,
    slotWidth: 0.8,
    chamferLength: 0.65,
  },
  "5": {
    holeDiameter: 5,
    freeOuterDiameter: 5.45,
    wallThickness: 1,
    slotWidth: 0.9,
    chamferLength: 0.9,
  },
  "6": {
    holeDiameter: 6,
    freeOuterDiameter: 6.5,
    wallThickness: 1.2,
    slotWidth: 1.1,
    chamferLength: 1.2,
  },
  "8": {
    holeDiameter: 8,
    freeOuterDiameter: 8.65,
    wallThickness: 1.5,
    slotWidth: 1.5,
    chamferLength: 1.6,
  },
  "10": {
    holeDiameter: 10,
    freeOuterDiameter: 10.65,
    wallThickness: 2,
    slotWidth: 1.8,
    chamferLength: 2,
  },
  "12": {
    holeDiameter: 12,
    freeOuterDiameter: 12.65,
    wallThickness: 2.5,
    slotWidth: 2,
    chamferLength: 2,
  },
} as const

export const springPinNominalLengths = [
  4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
] as const

export type SpringPinSizeKey = keyof typeof springPinSpecs
