export interface Din472InternalCirclipSpec {
  boreDiameter: number
  grooveDiameter: number
  thickness: number
  freeOuterDiameter: number
  lugWidth: number
  lugHoleDiameter: number
  innerClearanceDiameter: number
}

export const DIN472_INTERNAL_CIRCLIP_TABLE: readonly Din472InternalCirclipSpec[] =
  [
    {
      boreDiameter: 8,
      grooveDiameter: 8.4,
      thickness: 0.8,
      freeOuterDiameter: 8.7,
      lugWidth: 2.4,
      lugHoleDiameter: 1.0,
      innerClearanceDiameter: 3.6,
    },
    {
      boreDiameter: 10,
      grooveDiameter: 10.4,
      thickness: 1.0,
      freeOuterDiameter: 10.8,
      lugWidth: 3.2,
      lugHoleDiameter: 1.2,
      innerClearanceDiameter: 4.2,
    },
    {
      boreDiameter: 12,
      grooveDiameter: 12.5,
      thickness: 1.0,
      freeOuterDiameter: 13.0,
      lugWidth: 3.4,
      lugHoleDiameter: 1.5,
      innerClearanceDiameter: 5.9,
    },
    {
      boreDiameter: 15,
      grooveDiameter: 15.7,
      thickness: 1.0,
      freeOuterDiameter: 16.2,
      lugWidth: 3.6,
      lugHoleDiameter: 1.7,
      innerClearanceDiameter: 8.5,
    },
    {
      boreDiameter: 16,
      grooveDiameter: 16.8,
      thickness: 1.0,
      freeOuterDiameter: 17.3,
      lugWidth: 3.8,
      lugHoleDiameter: 1.7,
      innerClearanceDiameter: 9.2,
    },
    {
      boreDiameter: 20,
      grooveDiameter: 21.0,
      thickness: 1.0,
      freeOuterDiameter: 21.5,
      lugWidth: 4.0,
      lugHoleDiameter: 2.0,
      innerClearanceDiameter: 12.6,
    },
    {
      boreDiameter: 25,
      grooveDiameter: 26.2,
      thickness: 1.2,
      freeOuterDiameter: 26.9,
      lugWidth: 4.4,
      lugHoleDiameter: 2.0,
      innerClearanceDiameter: 16.9,
    },
    {
      boreDiameter: 30,
      grooveDiameter: 31.4,
      thickness: 1.2,
      freeOuterDiameter: 32.2,
      lugWidth: 4.8,
      lugHoleDiameter: 2.0,
      innerClearanceDiameter: 21.2,
    },
    {
      boreDiameter: 35,
      grooveDiameter: 37.0,
      thickness: 1.5,
      freeOuterDiameter: 37.8,
      lugWidth: 5.4,
      lugHoleDiameter: 2.5,
      innerClearanceDiameter: 25.0,
    },
    {
      boreDiameter: 40,
      grooveDiameter: 42.5,
      thickness: 1.75,
      freeOuterDiameter: 43.5,
      lugWidth: 5.8,
      lugHoleDiameter: 2.5,
      innerClearanceDiameter: 29.2,
    },
  ]

export function findDin472InternalCirclipSpec(
  boreDiameter: number,
): Din472InternalCirclipSpec | null {
  return (
    DIN472_INTERNAL_CIRCLIP_TABLE.find(
      (entry) => Math.abs(entry.boreDiameter - boreDiameter) <= 1e-6,
    ) ?? null
  )
}
