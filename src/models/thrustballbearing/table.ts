export interface ThrustBallBearingSeriesSpec {
  code: string
  innerDiameter: number
  outerDiameter: number
  height: number
}

export const THRUST_BALL_BEARING_511_TABLE: Record<
  string,
  ThrustBallBearingSeriesSpec
> = {
  "51100": { code: "51100", innerDiameter: 10, outerDiameter: 24, height: 9 },
  "51101": { code: "51101", innerDiameter: 12, outerDiameter: 26, height: 9 },
  "51102": { code: "51102", innerDiameter: 15, outerDiameter: 28, height: 9 },
  "51103": { code: "51103", innerDiameter: 17, outerDiameter: 30, height: 9 },
  "51104": { code: "51104", innerDiameter: 20, outerDiameter: 35, height: 10 },
  "51105": { code: "51105", innerDiameter: 25, outerDiameter: 42, height: 11 },
  "51106": { code: "51106", innerDiameter: 30, outerDiameter: 47, height: 11 },
  "51107": { code: "51107", innerDiameter: 35, outerDiameter: 52, height: 12 },
  "51108": { code: "51108", innerDiameter: 40, outerDiameter: 60, height: 13 },
}
