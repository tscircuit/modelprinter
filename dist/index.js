// src/flex-screen-schema.ts
import { z as z3 } from "zod";

// src/hex-socket-bolt-schema.ts
import { z as z2 } from "zod";

// src/model-length-schema.ts
import { mm } from "@tscircuit/mm";
import { z } from "zod";
var modelLengthSchema = z.union([z.number(), z.string()]).transform((value, context) => {
  try {
    const parsed = mm(value);
    if (!Number.isFinite(parsed)) throw new Error("Length is not finite");
    return parsed;
  } catch {
    context.addIssue({
      code: "custom",
      message: `Invalid model length: ${String(value)}`
    });
    return z.NEVER;
  }
});
var positiveModelLengthSchema = modelLengthSchema.refine(
  (value) => value > 0,
  "Length must be greater than zero"
);
var nonnegativeModelLengthSchema = modelLengthSchema.refine(
  (value) => value >= 0,
  "Length cannot be negative"
);

// src/hex-socket-bolt-schema.ts
var hexSocketBoltDimensions = {
  M2: {
    diameter: 2,
    threadPitch: 0.4,
    headDiameter: 3.8,
    headHeight: 2,
    socketWidth: 1.5,
    socketDepth: 1
  },
  "M2.5": {
    diameter: 2.5,
    threadPitch: 0.45,
    headDiameter: 4.5,
    headHeight: 2.5,
    socketWidth: 2,
    socketDepth: 1.1
  },
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.5,
    headHeight: 3,
    socketWidth: 2.5,
    socketDepth: 1.3
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    headDiameter: 7,
    headHeight: 4,
    socketWidth: 3,
    socketDepth: 2
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headDiameter: 8.5,
    headHeight: 5,
    socketWidth: 4,
    socketDepth: 2.5
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headDiameter: 10,
    headHeight: 6,
    socketWidth: 5,
    socketDepth: 3
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    headDiameter: 13,
    headHeight: 8,
    socketWidth: 6,
    socketDepth: 4
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    headDiameter: 16,
    headHeight: 10,
    socketWidth: 8,
    socketDepth: 5
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    headDiameter: 18,
    headHeight: 12,
    socketWidth: 10,
    socketDepth: 6
  }
};
var metricBoltSizeSchema = z2.enum([
  "M2",
  "M2.5",
  "M3",
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12"
]);
var hexSocketBoltModelPropsShape = {
  metricSize: metricBoltSizeSchema,
  /** Length under the head, excluding the head itself. */
  length: positiveModelLengthSchema,
  showThreads: z2.boolean().default(true)
};
var hexSocketBoltModelPropsSchema = z2.object(hexSocketBoltModelPropsShape).strict();
var hexSocketBoltModelDefinitionSchema = z2.object({
  fn: z2.literal("hexsocketbolt"),
  ...hexSocketBoltModelPropsShape
}).strict();

// src/flex-screen-schema.ts
var flexScreenOrientationSchema = z3.enum([
  "sitsFlat",
  "sitsFlatBelowBoard",
  "foldedToFaceAboveBoard",
  "foldedToFaceBelowBoard",
  "foldedToRightAngleAboveBoard",
  "foldedToRightAngleBelowBoard"
]);
var positiveFiniteNumberSchema = z3.number().finite().positive();
var aspectRatioStringSchema = z3.string().refine((value) => {
  const parts = value.split(":");
  if (parts.length !== 2) return false;
  const width = Number(parts[0]);
  const height = Number(parts[1]);
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
}, 'Aspect ratio must look like "16:9"').transform((value) => value);
var flexScreenAspectRatioSchema = z3.union([
  positiveFiniteNumberSchema,
  aspectRatioStringSchema,
  z3.tuple([positiveFiniteNumberSchema, positiveFiniteNumberSchema])
]);
var modelPointSchema = z3.object({
  x: modelLengthSchema.optional(),
  y: modelLengthSchema.optional(),
  z: modelLengthSchema.optional()
}).strict();
var rotationValueSchema = z3.union([z3.number().finite(), z3.string().min(1)]);
var modelRotationSchema = z3.tuple([
  rotationValueSchema,
  rotationValueSchema,
  rotationValueSchema
]);
var orientationShortcutKeys = [
  "sitsFlat",
  "sitsFlatBelowBoard",
  "foldedToFaceAboveBoard",
  "foldedToFaceBelowBoard",
  "foldsAboveBoard",
  "foldsBelowBoard",
  "foldedToRightAngleAboveBoard",
  "foldedToRightAngleBelowBoard"
];
var flexScreenModelPropsShape = {
  width: positiveModelLengthSchema.optional(),
  height: positiveModelLengthSchema.optional(),
  diagonal: positiveModelLengthSchema.optional(),
  aspectRatio: flexScreenAspectRatioSchema.optional(),
  ratio: flexScreenAspectRatioSchema.optional(),
  defaultDiagonal: positiveModelLengthSchema.optional(),
  orientation: flexScreenOrientationSchema.optional(),
  sitsFlat: z3.boolean().optional(),
  sitsFlatBelowBoard: z3.boolean().optional(),
  foldedToFaceAboveBoard: z3.boolean().optional(),
  foldedToFaceBelowBoard: z3.boolean().optional(),
  foldsAboveBoard: z3.boolean().optional(),
  foldsBelowBoard: z3.boolean().optional(),
  foldedToRightAngleAboveBoard: z3.boolean().optional(),
  foldedToRightAngleBelowBoard: z3.boolean().optional(),
  screenThickness: positiveModelLengthSchema.optional(),
  bezelInset: nonnegativeModelLengthSchema.optional(),
  bezelDepth: positiveModelLengthSchema.optional(),
  activeAreaWidth: positiveModelLengthSchema.optional(),
  activeAreaHeight: positiveModelLengthSchema.optional(),
  screenColor: z3.string().min(1).optional(),
  bezelColor: z3.string().min(1).optional(),
  showScreen: z3.boolean().optional(),
  flexCableLength: positiveModelLengthSchema.optional(),
  flexCableWidth: positiveModelLengthSchema.optional(),
  flexCableThickness: positiveModelLengthSchema.optional(),
  flexCableColor: z3.string().min(1).optional(),
  conductorCount: z3.number().int().positive().optional(),
  conductorPitch: positiveModelLengthSchema.optional(),
  conductorWidth: positiveModelLengthSchema.optional(),
  conductorThickness: positiveModelLengthSchema.optional(),
  conductorColor: z3.string().min(1).optional(),
  cableEdgeMargin: nonnegativeModelLengthSchema.optional(),
  exposedContactLength: nonnegativeModelLengthSchema.optional(),
  showConductors: z3.boolean().optional(),
  showFlexCable: z3.boolean().optional(),
  showStiffeners: z3.boolean().optional(),
  stiffenerLength: nonnegativeModelLengthSchema.optional(),
  stiffenerThickness: positiveModelLengthSchema.optional(),
  stiffenerColor: z3.string().min(1).optional(),
  bendRadius: positiveModelLengthSchema.optional(),
  bendSegments: z3.number().int().min(2).optional(),
  rightAngleVerticalLead: nonnegativeModelLengthSchema.optional(),
  distanceAboveBoard: nonnegativeModelLengthSchema.optional(),
  distanceBelowBoard: nonnegativeModelLengthSchema.optional(),
  foldDistanceFromConnector: nonnegativeModelLengthSchema.optional(),
  foldOutset: positiveModelLengthSchema.optional(),
  foldSegments: z3.number().int().min(4).optional(),
  screenGap: nonnegativeModelLengthSchema.optional(),
  boardTopZ: modelLengthSchema.optional(),
  boardThickness: positiveModelLengthSchema.optional(),
  boardClearance: nonnegativeModelLengthSchema.optional(),
  cableStartX: modelLengthSchema.optional(),
  cableStartY: modelLengthSchema.optional(),
  cableStartZ: modelLengthSchema.optional(),
  cableLateralOffset: modelLengthSchema.optional(),
  screenOffset: modelPointSchema.optional(),
  screenRotation: modelRotationSchema.optional(),
  rotation: modelRotationSchema.optional(),
  offset: modelPointSchema.optional()
};
var addOrientationShortcutIssue = (props, addIssue) => {
  const selectedShortcuts = orientationShortcutKeys.filter(
    (key) => props[key] === true
  );
  if (selectedShortcuts.length > 1) addIssue(selectedShortcuts[1]);
};
var flexScreenModelPropsSchema = z3.object(flexScreenModelPropsShape).strict().superRefine((props, context) => {
  addOrientationShortcutIssue(props, (path) => {
    context.addIssue({
      code: "custom",
      message: "Only one FlexScreen orientation shortcut can be true",
      path: [path]
    });
  });
});
var flexScreenModelDefinitionSchema = z3.object({
  fn: z3.literal("flexscreen"),
  ...flexScreenModelPropsShape
}).strict().superRefine((model, context) => {
  addOrientationShortcutIssue(model, (path) => {
    context.addIssue({
      code: "custom",
      message: "Only one FlexScreen orientation shortcut can be true",
      path: [path]
    });
  });
});
var modelDefinitionSchema = z3.discriminatedUnion("fn", [
  flexScreenModelDefinitionSchema,
  hexSocketBoltModelDefinitionSchema
]);

// src/parse-model-string.ts
var parsePart = (part) => {
  const match = part.match(/^([a-zA-Z]+)([\(\d\.\+\-].*)?$/);
  if (!match?.[1]) return void 0;
  return {
    fn: match[1].toLowerCase(),
    value: match[2]
  };
};
var parseModelStringParams = (definition) => {
  const normalizedDefinition = definition.trim();
  if (!normalizedDefinition) throw new Error("Model string cannot be empty");
  const parts = normalizedDefinition.split("_");
  const firstPart = parts[0];
  const first = parsePart(firstPart);
  const params = {};
  const fn = first?.fn ?? firstPart.toLowerCase();
  params[fn] = true;
  params.fn = fn;
  if (first?.value) {
    const numericValue = Number.parseFloat(first.value);
    if (Number.isFinite(numericValue)) params.num_pins = numericValue;
  }
  for (const part of parts.slice(1)) {
    if (!part) throw new Error("Model strings cannot contain empty tokens");
    const parsed = parsePart(part);
    if (!parsed) throw new Error(`Invalid model string token "${part}"`);
    params[parsed.fn] = parsed.value ?? true;
  }
  params.string = normalizedDefinition;
  return params;
};

// src/parse-hex-socket-bolt-model-string.ts
var parseHexSocketBoltModelParams = (raw) => {
  if (raw.fn !== "hexsocketbolt") {
    throw new Error(`Expected hexsocketbolt params, got "${raw.fn}"`);
  }
  const tokens = raw.string.split("_");
  if (tokens[0]?.toLowerCase() !== "hexsocketbolt") {
    throw new Error(
      "The hexsocketbolt function does not accept an inline value"
    );
  }
  const seen = /* @__PURE__ */ new Set();
  for (const token of tokens.slice(1)) {
    const name = token.match(/^[a-z]+/i)?.[0]?.toLowerCase();
    if (name && seen.has(name))
      throw new Error(`Duplicate bolt token "${name}"`);
    if (name) seen.add(name);
  }
  const props = {};
  for (const [token, value] of Object.entries(raw)) {
    if (["fn", "string", "hexsocketbolt"].includes(token)) continue;
    let property;
    let parsed = value;
    if (token === "m") {
      property = "metricSize";
      parsed = `M${String(value)}`;
    } else if (token === "l" || token === "length") {
      property = "length";
    } else if (token === "threads" || token === "nothreads") {
      if (value !== true)
        throw new Error(`Bolt token "${token}" does not accept a value`);
      property = "showThreads";
      parsed = token === "threads";
    } else {
      throw new Error(
        `Unknown hex socket bolt model token "${token}${String(value)}"`
      );
    }
    if (property in props)
      throw new Error(`Bolt property "${property}" is set more than once`);
    props[property] = parsed;
  }
  return hexSocketBoltModelDefinitionSchema.parse({
    fn: "hexsocketbolt",
    ...props
  });
};

// src/parse-flex-screen-model-string.ts
var orientationTokens = {
  sitsflat: "sitsFlat",
  sitsflatbelow: "sitsFlatBelowBoard",
  sitsflatbelowboard: "sitsFlatBelowBoard",
  foldsabove: "foldedToFaceAboveBoard",
  foldsaboveboard: "foldedToFaceAboveBoard",
  foldedtofaceaboveboard: "foldedToFaceAboveBoard",
  foldsbelow: "foldedToFaceBelowBoard",
  foldsbelowboard: "foldedToFaceBelowBoard",
  foldedtofacebelowboard: "foldedToFaceBelowBoard",
  rightangleabove: "foldedToRightAngleAboveBoard",
  rightangleaboveboard: "foldedToRightAngleAboveBoard",
  foldedtorightangleaboveboard: "foldedToRightAngleAboveBoard",
  rightanglebelow: "foldedToRightAngleBelowBoard",
  rightanglebelowboard: "foldedToRightAngleBelowBoard",
  foldedtorightanglebelowboard: "foldedToRightAngleBelowBoard"
};
var lengthProperties = {
  width: ["width", "w"],
  height: ["height", "h"],
  diagonal: ["diagonal", "diag", "d"],
  defaultDiagonal: ["defaultdiagonal", "defaultdiag"],
  screenThickness: ["screenthickness"],
  bezelInset: ["bezelinset"],
  bezelDepth: ["bezeldepth"],
  activeAreaWidth: ["activeareawidth", "activew"],
  activeAreaHeight: ["activeareaheight", "activeh"],
  flexCableLength: ["flexcablelength", "flexlength", "flex"],
  flexCableWidth: ["flexcablewidth", "flexwidth"],
  flexCableThickness: ["flexcablethickness", "flexthickness"],
  conductorPitch: ["conductorpitch"],
  conductorWidth: ["conductorwidth"],
  conductorThickness: ["conductorthickness"],
  cableEdgeMargin: ["cableedgemargin", "edgemargin"],
  exposedContactLength: ["exposedcontactlength", "contactlength"],
  stiffenerLength: ["stiffenerlength"],
  stiffenerThickness: ["stiffenerthickness"],
  bendRadius: ["bendradius"],
  rightAngleVerticalLead: ["rightangleverticallead", "verticallead"],
  distanceAboveBoard: ["distanceaboveboard", "distanceabove"],
  distanceBelowBoard: ["distancebelowboard", "distancebelow"],
  foldDistanceFromConnector: [
    "folddistancefromconnector",
    "folddistance",
    "foldstart"
  ],
  foldOutset: ["foldoutset", "outset"],
  screenGap: ["screengap"],
  boardTopZ: ["boardtopz"],
  boardThickness: ["boardthickness"],
  boardClearance: ["boardclearance"],
  cableStartX: ["cablestartx"],
  cableStartY: ["cablestarty"],
  cableStartZ: ["cablestartz"],
  cableLateralOffset: ["cablelateraloffset", "lateraloffset"]
};
var lengthTokenToProperty = Object.fromEntries(
  Object.entries(lengthProperties).flatMap(
    ([property, tokens]) => tokens.map((token) => [token, property])
  )
);
var integerTokenToProperty = {
  conductorcount: "conductorCount",
  conductors: "conductorCount",
  bendsegments: "bendSegments",
  foldsegments: "foldSegments"
};
var booleanTokens = {
  showscreen: ["showScreen", true],
  hidescreen: ["showScreen", false],
  showflex: ["showFlexCable", true],
  hideflex: ["showFlexCable", false],
  showconductors: ["showConductors", true],
  hideconductors: ["showConductors", false],
  showstiffeners: ["showStiffeners", true],
  hidestiffeners: ["showStiffeners", false]
};
var colorProperties = {
  screencolor: "screenColor",
  bezelcolor: "bezelColor",
  flexcolor: "flexCableColor",
  conductorcolor: "conductorColor",
  stiffenercolor: "stiffenerColor"
};
var parseAspectRatio = (value) => {
  const normalized = String(value).toLowerCase().replace("x", ":");
  if (normalized.includes(":")) {
    const [width, height, extra] = normalized.split(":");
    const numericWidth = Number(width);
    const numericHeight = Number(height);
    if (extra !== void 0 || !Number.isFinite(numericWidth) || !Number.isFinite(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
      throw new Error(`Invalid FlexScreen aspect ratio "${String(value)}"`);
    }
    return `${numericWidth}:${numericHeight}`;
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error(`Invalid FlexScreen aspect ratio "${String(value)}"`);
  }
  return numeric;
};
var unwrapFunctionValue = (value, token) => {
  if (typeof value !== "string" || !/^\(.+\)$/.test(value)) {
    throw new Error(`FlexScreen token "${token}" requires a value in (...)`);
  }
  return value.slice(1, -1);
};
var assertBareToken = (value, token) => {
  if (value !== true) {
    throw new Error(`FlexScreen token "${token}" does not accept a value`);
  }
};
var parseFlexScreenModelParams = (rawParams) => {
  if (rawParams.fn !== "flexscreen") {
    throw new Error(`Expected FlexScreen params, got "${rawParams.fn}"`);
  }
  const props = {};
  let orientation;
  let relativeDistance;
  for (const [token, value] of Object.entries(rawParams)) {
    if (token === "fn" || token === "string" || token === "flexscreen") {
      continue;
    }
    const tokenOrientation = orientationTokens[token];
    if (tokenOrientation) {
      assertBareToken(value, token);
      if (orientation && orientation !== tokenOrientation) {
        throw new Error(
          "A FlexScreen model string can only set one orientation"
        );
      }
      orientation = tokenOrientation;
      props.orientation = tokenOrientation;
      continue;
    }
    if (token in booleanTokens) {
      assertBareToken(value, token);
      const [property, enabled] = booleanTokens[token];
      props[property] = enabled;
      continue;
    }
    const colorProperty = colorProperties[token];
    if (colorProperty) {
      props[colorProperty] = unwrapFunctionValue(value, token);
      continue;
    }
    if (token === "ratio") {
      props.aspectRatio = parseAspectRatio(value);
      continue;
    }
    const lengthProperty = lengthTokenToProperty[token];
    if (lengthProperty) {
      props[lengthProperty] = value;
      continue;
    }
    if (token === "distance") {
      relativeDistance = value;
      continue;
    }
    const integerProperty = integerTokenToProperty[token];
    if (integerProperty) {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 1) {
        throw new Error(
          `Invalid positive integer in FlexScreen token "${token}${String(value)}"`
        );
      }
      props[integerProperty] = parsed;
      continue;
    }
    throw new Error(`Unknown FlexScreen model token "${token}${String(value)}"`);
  }
  if (relativeDistance !== void 0) {
    if (orientation === "foldedToFaceAboveBoard") {
      props.distanceAboveBoard = relativeDistance;
    } else if (orientation === "foldedToFaceBelowBoard") {
      props.distanceBelowBoard = relativeDistance;
    } else {
      throw new Error(
        'The "distance" token requires foldsabove or foldsbelow; use distanceabove or distancebelow for an explicit side'
      );
    }
  }
  return flexScreenModelDefinitionSchema.parse({ fn: "flexscreen", ...props });
};

// src/modelprinter.ts
var modelFunctions = {
  flexscreen: parseFlexScreenModelParams,
  hexsocketbolt: parseHexSocketBoltModelParams
};
var modelParamsToJson = (params) => {
  const modelFunction = modelFunctions[params.fn];
  if (modelFunction) {
    return modelFunction(params);
  }
  throw new Error(`Unsupported modelprinter function "${params.fn}"`);
};
var string = (value) => {
  const params = parseModelStringParams(value);
  return {
    params: () => params,
    json: () => modelParamsToJson(params)
  };
};
var parseModelString = (value) => string(value).json();
var modelprinter = {
  string,
  getModelNames: () => Object.keys(modelFunctions)
};
var mp = modelprinter;

// src/hex-socket-bolt-mesh.ts
var createHexSocketBoltMesh = (input) => {
  const props = hexSocketBoltModelPropsSchema.parse(input);
  const {
    diameter,
    threadPitch: pitch,
    headDiameter,
    headHeight,
    socketWidth,
    socketDepth
  } = hexSocketBoltDimensions[props.metricSize];
  const { length, showThreads } = props;
  const segments = 96;
  const steps = Math.max(2, Math.ceil(length / pitch * 24));
  if (steps > 24e3)
    throw new Error(
      "Bolt length exceeds mesh resolution limit (1000 thread turns)"
    );
  const positions = [];
  const indices = [];
  const radius = diameter / 2;
  const depth = pitch * 0.61343;
  const bevel = Math.min(0.2, headHeight * 0.08);
  const tipBevel = Math.min(pitch * 0.6, length / 3);
  const ring = (z4, radiusAt) => {
    const start = positions.length / 3;
    for (let i = 0; i < segments; i++) {
      const angle = i * Math.PI * 2 / segments;
      const r = radiusAt(angle);
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z4);
    }
    return start;
  };
  const connect = (a, b) => {
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      indices.push(a + i, a + next, b + next, a + i, b + next, b + i);
    }
  };
  const cap = (start, z4, upward) => {
    const center = positions.length / 3;
    positions.push(0, 0, z4);
    for (let i = 0; i < segments; i++) {
      const a = start + i;
      const b = start + (i + 1) % segments;
      indices.push(center, upward ? a : b, upward ? b : a);
    }
  };
  let previous = -1;
  for (let step = 0; step <= steps; step++) {
    const z4 = -length + length * step / steps;
    const current = ring(z4, (angle) => {
      const phase = ((z4 / pitch - angle / (2 * Math.PI)) % 1 + 1) % 1;
      const distance = Math.min(phase, 1 - phase);
      const groove = Math.min(
        depth,
        Math.max(0, (distance - 1 / 16) * pitch * Math.sqrt(3))
      );
      const endRamp = Math.min(
        1,
        (z4 + length) / tipBevel,
        -z4 / Math.min(pitch / 2, length / 3)
      );
      const tipCut = tipBevel * Math.max(0, 1 - (z4 + length) / tipBevel);
      return radius - (showThreads ? groove * endRamp : 0) - tipCut;
    });
    if (previous < 0) cap(current, z4, false);
    else connect(previous, current);
    previous = current;
  }
  const addRing = (z4, radiusAt) => {
    const current = ring(z4, radiusAt);
    connect(previous, current);
    previous = current;
  };
  addRing(0, () => headDiameter / 2 - bevel);
  addRing(bevel, () => headDiameter / 2);
  addRing(headHeight - bevel, () => headDiameter / 2);
  addRing(headHeight, () => headDiameter / 2 - bevel);
  const hexRadius = (angle, acrossFlats) => acrossFlats / 2 / Math.cos((angle + Math.PI / 6) % (Math.PI / 3) - Math.PI / 6);
  addRing(headHeight, (angle) => hexRadius(angle, socketWidth + bevel));
  addRing(headHeight - bevel / 2, (angle) => hexRadius(angle, socketWidth));
  addRing(headHeight - socketDepth, (angle) => hexRadius(angle, socketWidth));
  cap(previous, headHeight - socketDepth, true);
  return { positions, indices };
};
export {
  createHexSocketBoltMesh,
  flexScreenAspectRatioSchema,
  flexScreenModelDefinitionSchema,
  flexScreenModelPropsSchema,
  flexScreenOrientationSchema,
  hexSocketBoltDimensions,
  hexSocketBoltModelDefinitionSchema,
  hexSocketBoltModelPropsSchema,
  metricBoltSizeSchema,
  modelDefinitionSchema,
  modelLengthSchema,
  modelprinter,
  mp,
  nonnegativeModelLengthSchema,
  parseModelString,
  parseModelStringParams,
  positiveModelLengthSchema,
  string
};
//# sourceMappingURL=index.js.map