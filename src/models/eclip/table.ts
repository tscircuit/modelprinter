export interface Din6799EClipSpec {
  grooveDiameter: number
  minShaftDiameter: number
  maxShaftDiameter: number
  thickness: number
  freeInnerDiameter: number
  outerDiameter: number
}

export const DIN6799_ECLIP_TABLE: readonly Din6799EClipSpec[] = [
  {
    grooveDiameter: 1.2,
    minShaftDiameter: 1.4,
    maxShaftDiameter: 2.0,
    thickness: 0.3,
    freeInnerDiameter: 1.14,
    outerDiameter: 3.25,
  },
  {
    grooveDiameter: 1.5,
    minShaftDiameter: 1.7,
    maxShaftDiameter: 2.5,
    thickness: 0.4,
    freeInnerDiameter: 1.43,
    outerDiameter: 4.25,
  },
  {
    grooveDiameter: 1.9,
    minShaftDiameter: 2.2,
    maxShaftDiameter: 3.0,
    thickness: 0.5,
    freeInnerDiameter: 1.82,
    outerDiameter: 4.8,
  },
  {
    grooveDiameter: 2.3,
    minShaftDiameter: 2.7,
    maxShaftDiameter: 4.0,
    thickness: 0.6,
    freeInnerDiameter: 2.21,
    outerDiameter: 6.3,
  },
  {
    grooveDiameter: 3.2,
    minShaftDiameter: 3.7,
    maxShaftDiameter: 5.0,
    thickness: 0.6,
    freeInnerDiameter: 3.09,
    outerDiameter: 7.3,
  },
  {
    grooveDiameter: 4,
    minShaftDiameter: 4.5,
    maxShaftDiameter: 6.0,
    thickness: 0.7,
    freeInnerDiameter: 3.88,
    outerDiameter: 9.3,
  },
  {
    grooveDiameter: 5,
    minShaftDiameter: 5.5,
    maxShaftDiameter: 7.0,
    thickness: 0.7,
    freeInnerDiameter: 4.85,
    outerDiameter: 11.3,
  },
  {
    grooveDiameter: 6,
    minShaftDiameter: 6.7,
    maxShaftDiameter: 8.5,
    thickness: 0.7,
    freeInnerDiameter: 5.85,
    outerDiameter: 12.3,
  },
  {
    grooveDiameter: 7,
    minShaftDiameter: 7.8,
    maxShaftDiameter: 10.0,
    thickness: 0.9,
    freeInnerDiameter: 6.82,
    outerDiameter: 14.3,
  },
  {
    grooveDiameter: 8,
    minShaftDiameter: 8.8,
    maxShaftDiameter: 11.0,
    thickness: 1.0,
    freeInnerDiameter: 7.8,
    outerDiameter: 16.3,
  },
  {
    grooveDiameter: 9,
    minShaftDiameter: 9.8,
    maxShaftDiameter: 12.5,
    thickness: 1.1,
    freeInnerDiameter: 8.78,
    outerDiameter: 18.8,
  },
  {
    grooveDiameter: 10,
    minShaftDiameter: 11.0,
    maxShaftDiameter: 14.0,
    thickness: 1.2,
    freeInnerDiameter: 9.76,
    outerDiameter: 20.4,
  },
  {
    grooveDiameter: 12,
    minShaftDiameter: 13.0,
    maxShaftDiameter: 16.0,
    thickness: 1.3,
    freeInnerDiameter: 11.73,
    outerDiameter: 23.4,
  },
  {
    grooveDiameter: 15,
    minShaftDiameter: 16.5,
    maxShaftDiameter: 20.0,
    thickness: 1.5,
    freeInnerDiameter: 14.68,
    outerDiameter: 29.4,
  },
  {
    grooveDiameter: 19,
    minShaftDiameter: 21.0,
    maxShaftDiameter: 25.0,
    thickness: 1.75,
    freeInnerDiameter: 18.62,
    outerDiameter: 37.6,
  },
  {
    grooveDiameter: 24,
    minShaftDiameter: 26.0,
    maxShaftDiameter: 32.0,
    thickness: 2.0,
    freeInnerDiameter: 23.54,
    outerDiameter: 44.6,
  },
]

export function findDin6799EClipSpec(
  grooveDiameter: number,
): Din6799EClipSpec | null {
  return (
    DIN6799_ECLIP_TABLE.find(
      (entry) => Math.abs(entry.grooveDiameter - grooveDiameter) <= 1e-6,
    ) ?? null
  )
}
