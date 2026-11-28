export interface Din471ExternalCirclipSpec {
  shaftDiameter: number
  grooveDiameter: number
  thickness: number
  freeInnerDiameter: number
  lugWidth: number
  lugHoleDiameter: number
  outerEnvelopeDiameter: number
}

/**
 * Nominal DIN 471 normal-series external retaining rings (dimensions in mm).
 */
export const DIN471_EXTERNAL_CIRCLIP_TABLE: readonly Din471ExternalCirclipSpec[] =
  [
    {
      shaftDiameter: 4,
      grooveDiameter: 3.8,
      thickness: 0.4,
      freeInnerDiameter: 3.7,
      lugWidth: 2.2,
      lugHoleDiameter: 1.0,
      outerEnvelopeDiameter: 8.6,
    },
    {
      shaftDiameter: 5,
      grooveDiameter: 4.8,
      thickness: 0.6,
      freeInnerDiameter: 4.7,
      lugWidth: 2.5,
      lugHoleDiameter: 1.0,
      outerEnvelopeDiameter: 10.3,
    },
    {
      shaftDiameter: 6,
      grooveDiameter: 5.7,
      thickness: 0.7,
      freeInnerDiameter: 5.6,
      lugWidth: 2.7,
      lugHoleDiameter: 1.2,
      outerEnvelopeDiameter: 11.7,
    },
    {
      shaftDiameter: 8,
      grooveDiameter: 7.6,
      thickness: 0.8,
      freeInnerDiameter: 7.4,
      lugWidth: 3.2,
      lugHoleDiameter: 1.2,
      outerEnvelopeDiameter: 14.7,
    },
    {
      shaftDiameter: 10,
      grooveDiameter: 9.6,
      thickness: 1.0,
      freeInnerDiameter: 9.3,
      lugWidth: 3.3,
      lugHoleDiameter: 1.5,
      outerEnvelopeDiameter: 17.0,
    },
    {
      shaftDiameter: 12,
      grooveDiameter: 11.5,
      thickness: 1.0,
      freeInnerDiameter: 11.0,
      lugWidth: 3.3,
      lugHoleDiameter: 1.7,
      outerEnvelopeDiameter: 19.0,
    },
    {
      shaftDiameter: 15,
      grooveDiameter: 14.3,
      thickness: 1.0,
      freeInnerDiameter: 13.8,
      lugWidth: 3.6,
      lugHoleDiameter: 1.7,
      outerEnvelopeDiameter: 22.6,
    },
    {
      shaftDiameter: 16,
      grooveDiameter: 15.2,
      thickness: 1.0,
      freeInnerDiameter: 14.7,
      lugWidth: 3.7,
      lugHoleDiameter: 1.7,
      outerEnvelopeDiameter: 23.8,
    },
    {
      shaftDiameter: 20,
      grooveDiameter: 19.0,
      thickness: 1.2,
      freeInnerDiameter: 18.5,
      lugWidth: 4.0,
      lugHoleDiameter: 2.0,
      outerEnvelopeDiameter: 28.4,
    },
    {
      shaftDiameter: 25,
      grooveDiameter: 23.9,
      thickness: 1.2,
      freeInnerDiameter: 23.2,
      lugWidth: 4.4,
      lugHoleDiameter: 2.0,
      outerEnvelopeDiameter: 34.2,
    },
    {
      shaftDiameter: 30,
      grooveDiameter: 28.6,
      thickness: 1.5,
      freeInnerDiameter: 27.9,
      lugWidth: 4.8,
      lugHoleDiameter: 2.0,
      outerEnvelopeDiameter: 40.2,
    },
  ]

export function findDin471ExternalCirclipSpec(
  shaftDiameter: number,
): Din471ExternalCirclipSpec | null {
  return (
    DIN471_EXTERNAL_CIRCLIP_TABLE.find(
      (entry) => Math.abs(entry.shaftDiameter - shaftDiameter) <= 1e-6,
    ) ?? null
  )
}
