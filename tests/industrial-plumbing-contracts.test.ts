import { expect, test } from "bun:test"
import { ModelRegistry } from "../src/model-registry"
import { parseModelStringParams } from "../src/parse-model-string"
import { model as rigidPipe } from "../src/models/rigidpipe/register"
import { rigidPipeModelPropsSchema as rigidPipeSchema } from "../src/models/rigidpipe"
import { model as pipeElbow } from "../src/models/pipeelbow/register"
import { pipeElbowModelPropsSchema as pipeElbowSchema } from "../src/models/pipeelbow"
import { model as pipeTee } from "../src/models/pipetee/register"
import { pipeTeeModelPropsSchema as pipeTeeSchema } from "../src/models/pipetee"
import { model as pipeCross } from "../src/models/pipecross/register"
import { pipeCrossModelPropsSchema as pipeCrossSchema } from "../src/models/pipecross"
import { model as pipeCoupling } from "../src/models/pipecoupling/register"
import { pipeCouplingModelPropsSchema as pipeCouplingSchema } from "../src/models/pipecoupling"
import { model as pipeUnion } from "../src/models/pipeunion/register"
import { pipeUnionModelPropsSchema as pipeUnionSchema } from "../src/models/pipeunion"
import { model as pipeNipple } from "../src/models/pipenipple/register"
import { pipeNippleModelPropsSchema as pipeNippleSchema } from "../src/models/pipenipple"
import { model as pipeCap } from "../src/models/pipecap/register"
import { pipeCapModelPropsSchema as pipeCapSchema } from "../src/models/pipecap"
import { model as pipePlug } from "../src/models/pipeplug/register"
import { pipePlugModelPropsSchema as pipePlugSchema } from "../src/models/pipeplug"
import { model as reducingBushing } from "../src/models/reducingbushing/register"
import { reducingBushingModelPropsSchema as reducingBushingSchema } from "../src/models/reducingbushing"
import { model as hoseBarb } from "../src/models/hosebarb/register"
import { hoseBarbModelPropsSchema as hoseBarbSchema } from "../src/models/hosebarb"
import { model as bulkheadFitting } from "../src/models/bulkheadfitting/register"
import { bulkheadFittingModelPropsSchema as bulkheadFittingSchema } from "../src/models/bulkheadfitting"
import { model as pushConnectFitting } from "../src/models/pushconnectfitting/register"
import { pushConnectFittingModelPropsSchema as pushConnectFittingSchema } from "../src/models/pushconnectfitting"
import { model as compressionFitting } from "../src/models/compressionfitting/register"
import { compressionFittingModelPropsSchema as compressionFittingSchema } from "../src/models/compressionfitting"
import { model as hoseClamp } from "../src/models/hoseclamp/register"
import { hoseClampModelPropsSchema as hoseClampSchema } from "../src/models/hoseclamp"
import { model as pipeFlange } from "../src/models/pipeflange/register"
import { pipeFlangeModelPropsSchema as pipeFlangeSchema } from "../src/models/pipeflange"
import { model as ballValve } from "../src/models/ballvalve/register"
import { ballValveModelPropsSchema as ballValveSchema } from "../src/models/ballvalve"
import { model as checkValve } from "../src/models/checkvalve/register"
import { checkValveModelPropsSchema as checkValveSchema } from "../src/models/checkvalve"
import { model as needleValve } from "../src/models/needlevalve/register"
import { needleValveModelPropsSchema as needleValveSchema } from "../src/models/needlevalve"
import { model as manifold } from "../src/models/manifold/register"
import { manifoldModelPropsSchema as manifoldSchema } from "../src/models/manifold"

test("rigidpipe: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(rigidPipe)
  const p = rigidPipeSchema.parse({})
  expect(p).toEqual({ outerDiameter: 20, boreDiameter: 16, length: 100 })
  expect(
    rigidPipeSchema.parse({
      outerDiameter: "2.0cm",
      boreDiameter: "1.6cm",
      length: "10.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(parseModelStringParams("rigidpipe_od20mm_bore16mm_l100mm")),
  ).toEqual({ fn: "rigidpipe", ...p })
  expect(registry.parse(parseModelStringParams("rigidpipe"))).toEqual({
    fn: "rigidpipe",
    ...p,
  })
  expect(rigidPipe.schema.parse({ fn: "rigidpipe", ...p })).toEqual({
    fn: "rigidpipe",
    ...p,
  })
  expect(() => rigidPipeSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => rigidPipeSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "rigidpipe_od20mm_outerdiameter20mm",
    "rigidpipe_unknown3mm",
    "rigidpipe_od2mmjunk",
    "rigidpipe_od",
    "rigidpipe2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipeelbow: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeElbow)
  const p = pipeElbowSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 24,
    boreDiameter: 16,
    legLength: 36,
    socketDiameter: 28,
    socketLength: 10,
  })
  expect(
    pipeElbowSchema.parse({
      outerDiameter: "2.4cm",
      boreDiameter: "1.6cm",
      legLength: "3.6cm",
      socketDiameter: "2.8cm",
      socketLength: "1.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipeelbow_od24mm_bore16mm_leg36mm_socket28mm_socketl10mm",
      ),
    ),
  ).toEqual({ fn: "pipeelbow", ...p })
  expect(registry.parse(parseModelStringParams("pipeelbow"))).toEqual({
    fn: "pipeelbow",
    ...p,
  })
  expect(pipeElbow.schema.parse({ fn: "pipeelbow", ...p })).toEqual({
    fn: "pipeelbow",
    ...p,
  })
  expect(() => pipeElbowSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipeElbowSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "pipeelbow_od24mm_outerdiameter24mm",
    "pipeelbow_unknown3mm",
    "pipeelbow_od2mmjunk",
    "pipeelbow_od",
    "pipeelbow2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipetee: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeTee)
  const p = pipeTeeSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 24,
    boreDiameter: 16,
    length: 70,
    branchLength: 35,
    socketDiameter: 28,
    socketLength: 10,
  })
  expect(
    pipeTeeSchema.parse({
      outerDiameter: "2.4cm",
      boreDiameter: "1.6cm",
      length: "7.0cm",
      branchLength: "3.5cm",
      socketDiameter: "2.8cm",
      socketLength: "1.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipetee_od24mm_bore16mm_l70mm_branch35mm_socket28mm_socketl10mm",
      ),
    ),
  ).toEqual({ fn: "pipetee", ...p })
  expect(registry.parse(parseModelStringParams("pipetee"))).toEqual({
    fn: "pipetee",
    ...p,
  })
  expect(pipeTee.schema.parse({ fn: "pipetee", ...p })).toEqual({
    fn: "pipetee",
    ...p,
  })
  expect(() => pipeTeeSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipeTeeSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "pipetee_od24mm_outerdiameter24mm",
    "pipetee_unknown3mm",
    "pipetee_od2mmjunk",
    "pipetee_od",
    "pipetee2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipecross: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeCross)
  const p = pipeCrossSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 24,
    boreDiameter: 16,
    span: 70,
    socketDiameter: 28,
    socketLength: 10,
  })
  expect(
    pipeCrossSchema.parse({
      outerDiameter: "2.4cm",
      boreDiameter: "1.6cm",
      span: "7.0cm",
      socketDiameter: "2.8cm",
      socketLength: "1.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipecross_od24mm_bore16mm_span70mm_socket28mm_socketl10mm",
      ),
    ),
  ).toEqual({ fn: "pipecross", ...p })
  expect(registry.parse(parseModelStringParams("pipecross"))).toEqual({
    fn: "pipecross",
    ...p,
  })
  expect(pipeCross.schema.parse({ fn: "pipecross", ...p })).toEqual({
    fn: "pipecross",
    ...p,
  })
  expect(() => pipeCrossSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipeCrossSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "pipecross_od24mm_outerdiameter24mm",
    "pipecross_unknown3mm",
    "pipecross_od2mmjunk",
    "pipecross_od",
    "pipecross2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipecoupling: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeCoupling)
  const p = pipeCouplingSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 30,
    boreDiameter: 16,
    socketDiameter: 20,
    length: 40,
    socketDepth: 14,
  })
  expect(
    pipeCouplingSchema.parse({
      outerDiameter: "3.0cm",
      boreDiameter: "1.6cm",
      socketDiameter: "2.0cm",
      length: "4.0cm",
      socketDepth: "1.4cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipecoupling_od30mm_bore16mm_socket20mm_l40mm_depth14mm",
      ),
    ),
  ).toEqual({ fn: "pipecoupling", ...p })
  expect(registry.parse(parseModelStringParams("pipecoupling"))).toEqual({
    fn: "pipecoupling",
    ...p,
  })
  expect(pipeCoupling.schema.parse({ fn: "pipecoupling", ...p })).toEqual({
    fn: "pipecoupling",
    ...p,
  })
  expect(() => pipeCouplingSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() =>
      pipeCouplingSchema.parse({ ...p, outerDiameter: bad }),
    ).toThrow()
  for (const text of [
    "pipecoupling_od30mm_outerdiameter30mm",
    "pipecoupling_unknown3mm",
    "pipecoupling_od2mmjunk",
    "pipecoupling_od",
    "pipecoupling2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipeunion: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeUnion)
  const p = pipeUnionSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 30,
    boreDiameter: 16,
    length: 55,
    nutAcrossFlats: 36,
    nutLength: 20,
    endDiameter: 24,
  })
  expect(
    pipeUnionSchema.parse({
      outerDiameter: "3.0cm",
      boreDiameter: "1.6cm",
      length: "5.5cm",
      nutAcrossFlats: "3.6cm",
      nutLength: "2.0cm",
      endDiameter: "2.4cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipeunion_od30mm_bore16mm_l55mm_af36mm_nutl20mm_endod24mm",
      ),
    ),
  ).toEqual({ fn: "pipeunion", ...p })
  expect(registry.parse(parseModelStringParams("pipeunion"))).toEqual({
    fn: "pipeunion",
    ...p,
  })
  expect(pipeUnion.schema.parse({ fn: "pipeunion", ...p })).toEqual({
    fn: "pipeunion",
    ...p,
  })
  expect(() => pipeUnionSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipeUnionSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "pipeunion_od30mm_outerdiameter30mm",
    "pipeunion_unknown3mm",
    "pipeunion_od2mmjunk",
    "pipeunion_od",
    "pipeunion2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipenipple: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeNipple)
  const p = pipeNippleSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 20,
    boreDiameter: 16,
    length: 50,
    threadLength: 12,
    shoulderDiameter: 22,
  })
  expect(
    pipeNippleSchema.parse({
      outerDiameter: "2.0cm",
      boreDiameter: "1.6cm",
      length: "5.0cm",
      threadLength: "1.2cm",
      shoulderDiameter: "2.2cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipenipple_od20mm_bore16mm_l50mm_threadl12mm_shoulder22mm",
      ),
    ),
  ).toEqual({ fn: "pipenipple", ...p })
  expect(registry.parse(parseModelStringParams("pipenipple"))).toEqual({
    fn: "pipenipple",
    ...p,
  })
  expect(pipeNipple.schema.parse({ fn: "pipenipple", ...p })).toEqual({
    fn: "pipenipple",
    ...p,
  })
  expect(() => pipeNippleSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipeNippleSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "pipenipple_od20mm_outerdiameter20mm",
    "pipenipple_unknown3mm",
    "pipenipple_od2mmjunk",
    "pipenipple_od",
    "pipenipple2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipecap: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeCap)
  const p = pipeCapSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 30,
    socketDiameter: 20,
    length: 25,
    floorThickness: 4,
    hexAcrossFlats: 32,
  })
  expect(
    pipeCapSchema.parse({
      outerDiameter: "3.0cm",
      socketDiameter: "2.0cm",
      length: "2.5cm",
      floorThickness: "0.4cm",
      hexAcrossFlats: "3.2cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams("pipecap_od30mm_socket20mm_l25mm_floor4mm_af32mm"),
    ),
  ).toEqual({ fn: "pipecap", ...p })
  expect(registry.parse(parseModelStringParams("pipecap"))).toEqual({
    fn: "pipecap",
    ...p,
  })
  expect(pipeCap.schema.parse({ fn: "pipecap", ...p })).toEqual({
    fn: "pipecap",
    ...p,
  })
  expect(() => pipeCapSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipeCapSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "pipecap_od30mm_outerdiameter30mm",
    "pipecap_unknown3mm",
    "pipecap_od2mmjunk",
    "pipecap_od",
    "pipecap2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipeplug: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipePlug)
  const p = pipePlugSchema.parse({})
  expect(p).toEqual({
    diameter: 20,
    length: 20,
    headAcrossFlats: 26,
    headHeight: 8,
  })
  expect(
    pipePlugSchema.parse({
      diameter: "2.0cm",
      length: "2.0cm",
      headAcrossFlats: "2.6cm",
      headHeight: "0.8cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams("pipeplug_d20mm_l20mm_af26mm_head8mm"),
    ),
  ).toEqual({ fn: "pipeplug", ...p })
  expect(registry.parse(parseModelStringParams("pipeplug"))).toEqual({
    fn: "pipeplug",
    ...p,
  })
  expect(pipePlug.schema.parse({ fn: "pipeplug", ...p })).toEqual({
    fn: "pipeplug",
    ...p,
  })
  expect(() => pipePlugSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => pipePlugSchema.parse({ ...p, diameter: bad })).toThrow()
  for (const text of [
    "pipeplug_d20mm_diameter20mm",
    "pipeplug_unknown3mm",
    "pipeplug_d2mmjunk",
    "pipeplug_d",
    "pipeplug2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("reducingbushing: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(reducingBushing)
  const p = reducingBushingSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 26,
    largeBoreDiameter: 18,
    smallBoreDiameter: 10,
    length: 30,
    hexAcrossFlats: 30,
    hexLength: 10,
  })
  expect(
    reducingBushingSchema.parse({
      outerDiameter: "2.6cm",
      largeBoreDiameter: "1.8cm",
      smallBoreDiameter: "1.0cm",
      length: "3.0cm",
      hexAcrossFlats: "3.0cm",
      hexLength: "1.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "reducingbushing_od26mm_largebore18mm_smallbore10mm_l30mm_af30mm_hexl10mm",
      ),
    ),
  ).toEqual({ fn: "reducingbushing", ...p })
  expect(registry.parse(parseModelStringParams("reducingbushing"))).toEqual({
    fn: "reducingbushing",
    ...p,
  })
  expect(reducingBushing.schema.parse({ fn: "reducingbushing", ...p })).toEqual(
    { fn: "reducingbushing", ...p },
  )
  expect(() => reducingBushingSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() =>
      reducingBushingSchema.parse({ ...p, outerDiameter: bad }),
    ).toThrow()
  for (const text of [
    "reducingbushing_od26mm_outerdiameter26mm",
    "reducingbushing_unknown3mm",
    "reducingbushing_od2mmjunk",
    "reducingbushing_od",
    "reducingbushing2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("hosebarb: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(hoseBarb)
  const p = hoseBarbSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 20,
    boreDiameter: 10,
    length: 45,
    barbDiameter: 16,
    barbLength: 25,
    barbPitch: 6,
    hexAcrossFlats: 24,
  })
  expect(
    hoseBarbSchema.parse({
      outerDiameter: "2.0cm",
      boreDiameter: "1.0cm",
      length: "4.5cm",
      barbDiameter: "1.6cm",
      barbLength: "2.5cm",
      barbPitch: "0.6cm",
      hexAcrossFlats: "2.4cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "hosebarb_od20mm_bore10mm_l45mm_barbod16mm_barbl25mm_pitch6mm_af24mm",
      ),
    ),
  ).toEqual({ fn: "hosebarb", ...p })
  expect(registry.parse(parseModelStringParams("hosebarb"))).toEqual({
    fn: "hosebarb",
    ...p,
  })
  expect(hoseBarb.schema.parse({ fn: "hosebarb", ...p })).toEqual({
    fn: "hosebarb",
    ...p,
  })
  expect(() => hoseBarbSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => hoseBarbSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "hosebarb_od20mm_outerdiameter20mm",
    "hosebarb_unknown3mm",
    "hosebarb_od2mmjunk",
    "hosebarb_od",
    "hosebarb2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("bulkheadfitting: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(bulkheadFitting)
  const p = bulkheadFittingSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 20,
    boreDiameter: 12,
    length: 55,
    flangeDiameter: 32,
    flangeThickness: 4,
    nutAcrossFlats: 28,
    nutThickness: 8,
    panelGap: 10,
  })
  expect(
    bulkheadFittingSchema.parse({
      outerDiameter: "2.0cm",
      boreDiameter: "1.2cm",
      length: "5.5cm",
      flangeDiameter: "3.2cm",
      flangeThickness: "0.4cm",
      nutAcrossFlats: "2.8cm",
      nutThickness: "0.8cm",
      panelGap: "1.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "bulkheadfitting_od20mm_bore12mm_l55mm_flange32mm_flanget4mm_af28mm_nutt8mm_gap10mm",
      ),
    ),
  ).toEqual({ fn: "bulkheadfitting", ...p })
  expect(registry.parse(parseModelStringParams("bulkheadfitting"))).toEqual({
    fn: "bulkheadfitting",
    ...p,
  })
  expect(bulkheadFitting.schema.parse({ fn: "bulkheadfitting", ...p })).toEqual(
    { fn: "bulkheadfitting", ...p },
  )
  expect(() => bulkheadFittingSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() =>
      bulkheadFittingSchema.parse({ ...p, outerDiameter: bad }),
    ).toThrow()
  for (const text of [
    "bulkheadfitting_od20mm_outerdiameter20mm",
    "bulkheadfitting_unknown3mm",
    "bulkheadfitting_od2mmjunk",
    "bulkheadfitting_od",
    "bulkheadfitting2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pushconnectfitting: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pushConnectFitting)
  const p = pushConnectFittingSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 26,
    boreDiameter: 8,
    length: 40,
    tubeDiameter: 12,
    colletDiameter: 20,
    colletLength: 6,
    hexAcrossFlats: 28,
  })
  expect(
    pushConnectFittingSchema.parse({
      outerDiameter: "2.6cm",
      boreDiameter: "0.8cm",
      length: "4.0cm",
      tubeDiameter: "1.2cm",
      colletDiameter: "2.0cm",
      colletLength: "0.6cm",
      hexAcrossFlats: "2.8cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pushconnectfitting_od26mm_bore8mm_l40mm_tube12mm_collet20mm_colletl6mm_af28mm",
      ),
    ),
  ).toEqual({ fn: "pushconnectfitting", ...p })
  expect(registry.parse(parseModelStringParams("pushconnectfitting"))).toEqual({
    fn: "pushconnectfitting",
    ...p,
  })
  expect(
    pushConnectFitting.schema.parse({ fn: "pushconnectfitting", ...p }),
  ).toEqual({ fn: "pushconnectfitting", ...p })
  expect(() =>
    pushConnectFittingSchema.parse({ ...p, nonexistent: 1 }),
  ).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() =>
      pushConnectFittingSchema.parse({ ...p, outerDiameter: bad }),
    ).toThrow()
  for (const text of [
    "pushconnectfitting_od26mm_outerdiameter26mm",
    "pushconnectfitting_unknown3mm",
    "pushconnectfitting_od2mmjunk",
    "pushconnectfitting_od",
    "pushconnectfitting2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("compressionfitting: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(compressionFitting)
  const p = compressionFittingSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 22,
    boreDiameter: 8,
    length: 40,
    tubeDiameter: 12,
    nutAcrossFlats: 26,
    nutLength: 10,
  })
  expect(
    compressionFittingSchema.parse({
      outerDiameter: "2.2cm",
      boreDiameter: "0.8cm",
      length: "4.0cm",
      tubeDiameter: "1.2cm",
      nutAcrossFlats: "2.6cm",
      nutLength: "1.0cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "compressionfitting_od22mm_bore8mm_l40mm_tube12mm_af26mm_nutl10mm",
      ),
    ),
  ).toEqual({ fn: "compressionfitting", ...p })
  expect(registry.parse(parseModelStringParams("compressionfitting"))).toEqual({
    fn: "compressionfitting",
    ...p,
  })
  expect(
    compressionFitting.schema.parse({ fn: "compressionfitting", ...p }),
  ).toEqual({ fn: "compressionfitting", ...p })
  expect(() =>
    compressionFittingSchema.parse({ ...p, nonexistent: 1 }),
  ).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() =>
      compressionFittingSchema.parse({ ...p, outerDiameter: bad }),
    ).toThrow()
  for (const text of [
    "compressionfitting_od22mm_outerdiameter22mm",
    "compressionfitting_unknown3mm",
    "compressionfitting_od2mmjunk",
    "compressionfitting_od",
    "compressionfitting2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("hoseclamp: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(hoseClamp)
  const p = hoseClampSchema.parse({})
  expect(p).toEqual({
    innerDiameter: 30,
    bandThickness: 1.5,
    bandWidth: 8,
    housingLength: 14,
    housingWidth: 8,
    housingHeight: 7,
  })
  expect(
    hoseClampSchema.parse({
      innerDiameter: "3.0cm",
      bandThickness: "0.15cm",
      bandWidth: "0.8cm",
      housingLength: "1.4cm",
      housingWidth: "0.8cm",
      housingHeight: "0.7cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "hoseclamp_id30mm_bandt1.5mm_bandw8mm_housingl14mm_housingw8mm_housingh7mm",
      ),
    ),
  ).toEqual({ fn: "hoseclamp", ...p })
  expect(registry.parse(parseModelStringParams("hoseclamp"))).toEqual({
    fn: "hoseclamp",
    ...p,
  })
  expect(hoseClamp.schema.parse({ fn: "hoseclamp", ...p })).toEqual({
    fn: "hoseclamp",
    ...p,
  })
  expect(() => hoseClampSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => hoseClampSchema.parse({ ...p, innerDiameter: bad })).toThrow()
  for (const text of [
    "hoseclamp_id30mm_innerdiameter30mm",
    "hoseclamp_unknown3mm",
    "hoseclamp_id2mmjunk",
    "hoseclamp_id",
    "hoseclamp2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("pipeflange: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(pipeFlange)
  const p = pipeFlangeSchema.parse({})
  expect(p).toEqual({
    flangeDiameter: 70,
    boreDiameter: 16,
    hubDiameter: 30,
    flangeThickness: 8,
    hubLength: 20,
    boltCircleDiameter: 50,
    boltHoleDiameter: 6,
    boltCount: 4,
  })
  expect(
    pipeFlangeSchema.parse({
      flangeDiameter: "7.0cm",
      boreDiameter: "1.6cm",
      hubDiameter: "3.0cm",
      flangeThickness: "0.8cm",
      hubLength: "2.0cm",
      boltCircleDiameter: "5.0cm",
      boltHoleDiameter: "0.6cm",
      boltCount: 4,
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "pipeflange_flange70mm_bore16mm_hub30mm_flanget8mm_hubl20mm_bc50mm_hole6mm_bolts4",
      ),
    ),
  ).toEqual({ fn: "pipeflange", ...p })
  expect(registry.parse(parseModelStringParams("pipeflange"))).toEqual({
    fn: "pipeflange",
    ...p,
  })
  expect(pipeFlange.schema.parse({ fn: "pipeflange", ...p })).toEqual({
    fn: "pipeflange",
    ...p,
  })
  expect(() => pipeFlangeSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() =>
      pipeFlangeSchema.parse({ ...p, flangeDiameter: bad }),
    ).toThrow()
  for (const text of [
    "pipeflange_flange70mm_flangediameter70mm",
    "pipeflange_unknown3mm",
    "pipeflange_flange2mmjunk",
    "pipeflange_flange",
    "pipeflange2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("ballvalve: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(ballValve)
  const p = ballValveSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 30,
    boreDiameter: 16,
    length: 65,
    endDiameter: 24,
    handleLength: 55,
    handleWidth: 10,
    stemHeight: 14,
    handleThickness: 4,
  })
  expect(
    ballValveSchema.parse({
      outerDiameter: "3.0cm",
      boreDiameter: "1.6cm",
      length: "6.5cm",
      endDiameter: "2.4cm",
      handleLength: "5.5cm",
      handleWidth: "1.0cm",
      stemHeight: "1.4cm",
      handleThickness: "0.4cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "ballvalve_od30mm_bore16mm_l65mm_endod24mm_handlel55mm_handlew10mm_stemh14mm_handlet4mm",
      ),
    ),
  ).toEqual({ fn: "ballvalve", ...p })
  expect(registry.parse(parseModelStringParams("ballvalve"))).toEqual({
    fn: "ballvalve",
    ...p,
  })
  expect(ballValve.schema.parse({ fn: "ballvalve", ...p })).toEqual({
    fn: "ballvalve",
    ...p,
  })
  expect(() => ballValveSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => ballValveSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "ballvalve_od30mm_outerdiameter30mm",
    "ballvalve_unknown3mm",
    "ballvalve_od2mmjunk",
    "ballvalve_od",
    "ballvalve2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("checkvalve: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(checkValve)
  const p = checkValveSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 28,
    boreDiameter: 12,
    length: 60,
    endDiameter: 20,
    hexAcrossFlats: 30,
    nutLength: 12,
  })
  expect(
    checkValveSchema.parse({
      outerDiameter: "2.8cm",
      boreDiameter: "1.2cm",
      length: "6.0cm",
      endDiameter: "2.0cm",
      hexAcrossFlats: "3.0cm",
      nutLength: "1.2cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "checkvalve_od28mm_bore12mm_l60mm_endod20mm_af30mm_nutl12mm",
      ),
    ),
  ).toEqual({ fn: "checkvalve", ...p })
  expect(registry.parse(parseModelStringParams("checkvalve"))).toEqual({
    fn: "checkvalve",
    ...p,
  })
  expect(checkValve.schema.parse({ fn: "checkvalve", ...p })).toEqual({
    fn: "checkvalve",
    ...p,
  })
  expect(() => checkValveSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => checkValveSchema.parse({ ...p, outerDiameter: bad })).toThrow()
  for (const text of [
    "checkvalve_od28mm_outerdiameter28mm",
    "checkvalve_unknown3mm",
    "checkvalve_od2mmjunk",
    "checkvalve_od",
    "checkvalve2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("needlevalve: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(needleValve)
  const p = needleValveSchema.parse({})
  expect(p).toEqual({
    bodyLength: 38,
    bodyWidth: 24,
    bodyHeight: 26,
    boreDiameter: 8,
    portDiameter: 16,
    portLength: 10,
    stemHeight: 24,
    wheelDiameter: 26,
    wheelThickness: 5,
  })
  expect(
    needleValveSchema.parse({
      bodyLength: "3.8cm",
      bodyWidth: "2.4cm",
      bodyHeight: "2.6cm",
      boreDiameter: "0.8cm",
      portDiameter: "1.6cm",
      portLength: "1.0cm",
      stemHeight: "2.4cm",
      wheelDiameter: "2.6cm",
      wheelThickness: "0.5cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "needlevalve_bodyl38mm_bodyw24mm_bodyh26mm_bore8mm_port16mm_portl10mm_stemh24mm_wheel26mm_wheelt5mm",
      ),
    ),
  ).toEqual({ fn: "needlevalve", ...p })
  expect(registry.parse(parseModelStringParams("needlevalve"))).toEqual({
    fn: "needlevalve",
    ...p,
  })
  expect(needleValve.schema.parse({ fn: "needlevalve", ...p })).toEqual({
    fn: "needlevalve",
    ...p,
  })
  expect(() => needleValveSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => needleValveSchema.parse({ ...p, bodyLength: bad })).toThrow()
  for (const text of [
    "needlevalve_bodyl38mm_bodylength38mm",
    "needlevalve_unknown3mm",
    "needlevalve_bodyl2mmjunk",
    "needlevalve_bodyl",
    "needlevalve2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("manifold: complete unit contract, registry routing and strict validation", () => {
  const registry = new ModelRegistry()
  registry.register(manifold)
  const p = manifoldSchema.parse({})
  expect(p).toEqual({
    length: 100,
    width: 30,
    height: 26,
    boreDiameter: 12,
    portDiameter: 8,
    portPitch: 25,
    portCount: 3,
    mountingHoleDiameter: 5,
  })
  expect(
    manifoldSchema.parse({
      length: "10.0cm",
      width: "3.0cm",
      height: "2.6cm",
      boreDiameter: "1.2cm",
      portDiameter: "0.8cm",
      portPitch: "2.5cm",
      portCount: 3,
      mountingHoleDiameter: "0.5cm",
    }),
  ).toEqual(p)
  expect(
    registry.parse(
      parseModelStringParams(
        "manifold_l100mm_w30mm_h26mm_bore12mm_port8mm_pitch25mm_ports3_hole5mm",
      ),
    ),
  ).toEqual({ fn: "manifold", ...p })
  expect(registry.parse(parseModelStringParams("manifold"))).toEqual({
    fn: "manifold",
    ...p,
  })
  expect(manifold.schema.parse({ fn: "manifold", ...p })).toEqual({
    fn: "manifold",
    ...p,
  })
  expect(() => manifoldSchema.parse({ ...p, nonexistent: 1 })).toThrow()
  for (const bad of [0, -1, NaN, Infinity, "2mmjunk", "1e2mm"])
    expect(() => manifoldSchema.parse({ ...p, length: bad })).toThrow()
  for (const text of [
    "manifold_l100mm_length100mm",
    "manifold_unknown3mm",
    "manifold_l2mmjunk",
    "manifold_l",
    "manifold2",
  ])
    expect(() => registry.parse(parseModelStringParams(text))).toThrow()
})

test("rigidpipe: impossible mating dimensions fail", () => {
  expect(() => rigidPipeSchema.parse({ boreDiameter: 20 })).toThrow()
})

test("pipeelbow: impossible mating dimensions fail", () => {
  expect(() => pipeElbowSchema.parse({ socketLength: 40 })).toThrow()
})

test("pipetee: impossible mating dimensions fail", () => {
  expect(() => pipeTeeSchema.parse({ branchLength: 20 })).toThrow()
})

test("pipecross: impossible mating dimensions fail", () => {
  expect(() => pipeCrossSchema.parse({ span: 40 })).toThrow()
})

test("pipecoupling: impossible mating dimensions fail", () => {
  expect(() => pipeCouplingSchema.parse({ socketDepth: 21 })).toThrow()
})

test("pipeunion: impossible mating dimensions fail", () => {
  expect(() => pipeUnionSchema.parse({ nutAcrossFlats: 29 })).toThrow()
})

test("pipenipple: impossible mating dimensions fail", () => {
  expect(() => pipeNippleSchema.parse({ threadLength: 25 })).toThrow()
})

test("pipecap: impossible mating dimensions fail", () => {
  expect(() => pipeCapSchema.parse({ floorThickness: 25 })).toThrow()
})

test("pipeplug: impossible mating dimensions fail", () => {
  expect(() => pipePlugSchema.parse({ headAcrossFlats: 19 })).toThrow()
})

test("reducingbushing: impossible mating dimensions fail", () => {
  expect(() => reducingBushingSchema.parse({ smallBoreDiameter: 19 })).toThrow()
})

test("hosebarb: impossible mating dimensions fail", () => {
  expect(() => hoseBarbSchema.parse({ barbPitch: 0.5 })).toThrow()
})

test("bulkheadfitting: impossible mating dimensions fail", () => {
  expect(() => bulkheadFittingSchema.parse({ panelGap: 50 })).toThrow()
})

test("pushconnectfitting: impossible mating dimensions fail", () => {
  expect(() => pushConnectFittingSchema.parse({ tubeDiameter: 22 })).toThrow()
})

test("compressionfitting: impossible mating dimensions fail", () => {
  expect(() => compressionFittingSchema.parse({ nutLength: 25 })).toThrow()
})

test("hoseclamp: impossible mating dimensions fail", () => {
  expect(() => hoseClampSchema.parse({ bandThickness: 8 })).toThrow()
})

test("pipeflange: impossible mating dimensions fail", () => {
  expect(() => pipeFlangeSchema.parse({ boltCircleDiameter: 69 })).toThrow()
})

test("ballvalve: impossible mating dimensions fail", () => {
  expect(() => ballValveSchema.parse({ endDiameter: 15 })).toThrow()
})

test("checkvalve: impossible mating dimensions fail", () => {
  expect(() => checkValveSchema.parse({ nutLength: 31 })).toThrow()
})

test("needlevalve: impossible mating dimensions fail", () => {
  expect(() => needleValveSchema.parse({ portDiameter: 30 })).toThrow()
})

test("manifold: impossible mating dimensions fail", () => {
  expect(() => manifoldSchema.parse({ portCount: 8 })).toThrow()
})

test("pipeflange: counts require bounded integers without length units", () => {
  for (const value of [1, 2.5, 13, "4mm"])
    expect(() => pipeFlangeSchema.parse({ boltCount: value })).toThrow()
  expect(() =>
    pipeFlange.parse(parseModelStringParams("pipeflange_bolts4mm")),
  ).toThrow()
})

test("manifold: counts require bounded integers without length units", () => {
  for (const value of [1, 2.5, 13, "4mm"])
    expect(() => manifoldSchema.parse({ portCount: value })).toThrow()
  expect(() =>
    manifold.parse(parseModelStringParams("manifold_ports4mm")),
  ).toThrow()
})

test("rigidpipe: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() => rigidPipeSchema.parse({ boreDiameter: 19.99999 })).toThrow(
    "resolution",
  )
})

test("pipeelbow: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() => pipeElbowSchema.parse({ boreDiameter: 23.99999 })).toThrow(
    "resolution",
  )
})

test("pipecoupling: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() => pipeCouplingSchema.parse({ socketDiameter: 29.99999 })).toThrow(
    "resolution",
  )
})

test("reducingbushing: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() =>
    reducingBushingSchema.parse({ smallBoreDiameter: 17.99999 }),
  ).toThrow("resolution")
})

test("hosebarb: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() => hoseBarbSchema.parse({ boreDiameter: 12.79999 })).toThrow(
    "resolution",
  )
})

test("pipeflange: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() =>
    pipeFlangeSchema.parse({ boltCircleDiameter: 63.99999 }),
  ).toThrow("resolution")
})

test("manifold: subresolution walls or mating gaps fail before mesh generation", () => {
  expect(() => manifoldSchema.parse({ width: 27.00001 })).toThrow("resolution")
})
