export function parseEdgeClampMetricSize(arg: string): string {
  if (!/^(?:\d+(?:\.\d+)?)(?:mm)?$/i.test(arg)) {
    throw new Error(`Invalid metric thread size "${arg}"`)
  }
  return arg.toLowerCase().endsWith("mm") ? arg : `${arg}mm`
}
