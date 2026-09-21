import { z } from 'zod';

declare const modelLengthSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>;
declare const positiveModelLengthSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>;
declare const nonnegativeModelLengthSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>;

declare const flexScreenOrientationSchema: z.ZodEnum<{
    sitsFlat: "sitsFlat";
    sitsFlatBelowBoard: "sitsFlatBelowBoard";
    foldedToFaceAboveBoard: "foldedToFaceAboveBoard";
    foldedToFaceBelowBoard: "foldedToFaceBelowBoard";
    foldedToRightAngleAboveBoard: "foldedToRightAngleAboveBoard";
    foldedToRightAngleBelowBoard: "foldedToRightAngleBelowBoard";
}>;
declare const flexScreenAspectRatioSchema: z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
/**
 * Canonical, renderer-independent properties for a parameterized FlexScreen.
 * Every length accepts either millimeters as a number or a unit-bearing string
 * and is normalized to millimeters by the schema.
 */
declare const flexScreenModelPropsSchema: z.ZodObject<{
    width: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    height: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    diagonal: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    aspectRatio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>>;
    ratio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>>;
    defaultDiagonal: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    orientation: z.ZodOptional<z.ZodEnum<{
        sitsFlat: "sitsFlat";
        sitsFlatBelowBoard: "sitsFlatBelowBoard";
        foldedToFaceAboveBoard: "foldedToFaceAboveBoard";
        foldedToFaceBelowBoard: "foldedToFaceBelowBoard";
        foldedToRightAngleAboveBoard: "foldedToRightAngleAboveBoard";
        foldedToRightAngleBelowBoard: "foldedToRightAngleBelowBoard";
    }>>;
    sitsFlat: z.ZodOptional<z.ZodBoolean>;
    sitsFlatBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToFaceAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToFaceBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldsAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldsBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToRightAngleAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToRightAngleBelowBoard: z.ZodOptional<z.ZodBoolean>;
    screenThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bezelInset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bezelDepth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    activeAreaWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    activeAreaHeight: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    screenColor: z.ZodOptional<z.ZodString>;
    bezelColor: z.ZodOptional<z.ZodString>;
    showScreen: z.ZodOptional<z.ZodBoolean>;
    flexCableLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableColor: z.ZodOptional<z.ZodString>;
    conductorCount: z.ZodOptional<z.ZodNumber>;
    conductorPitch: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorColor: z.ZodOptional<z.ZodString>;
    cableEdgeMargin: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    exposedContactLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    showConductors: z.ZodOptional<z.ZodBoolean>;
    showFlexCable: z.ZodOptional<z.ZodBoolean>;
    showStiffeners: z.ZodOptional<z.ZodBoolean>;
    stiffenerLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    stiffenerThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    stiffenerColor: z.ZodOptional<z.ZodString>;
    bendRadius: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bendSegments: z.ZodOptional<z.ZodNumber>;
    rightAngleVerticalLead: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    distanceAboveBoard: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    distanceBelowBoard: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldDistanceFromConnector: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldOutset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldSegments: z.ZodOptional<z.ZodNumber>;
    screenGap: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardTopZ: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardClearance: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartX: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartY: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartZ: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableLateralOffset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    screenOffset: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        y: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        z: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    }, z.core.$strict>>;
    screenRotation: z.ZodOptional<z.ZodTuple<[z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>], null>>;
    rotation: z.ZodOptional<z.ZodTuple<[z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>], null>>;
    offset: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        y: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        z: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
type FlexScreenOrientation = z.infer<typeof flexScreenOrientationSchema>;
type FlexScreenAspectRatio = z.infer<typeof flexScreenAspectRatioSchema>;
type FlexScreenModelPropsInput = z.input<typeof flexScreenModelPropsSchema>;
type FlexScreenModelProps = z.output<typeof flexScreenModelPropsSchema>;
declare const flexScreenModelDefinitionSchema: z.ZodObject<{
    width: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    height: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    diagonal: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    aspectRatio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>>;
    ratio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>>;
    defaultDiagonal: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    orientation: z.ZodOptional<z.ZodEnum<{
        sitsFlat: "sitsFlat";
        sitsFlatBelowBoard: "sitsFlatBelowBoard";
        foldedToFaceAboveBoard: "foldedToFaceAboveBoard";
        foldedToFaceBelowBoard: "foldedToFaceBelowBoard";
        foldedToRightAngleAboveBoard: "foldedToRightAngleAboveBoard";
        foldedToRightAngleBelowBoard: "foldedToRightAngleBelowBoard";
    }>>;
    sitsFlat: z.ZodOptional<z.ZodBoolean>;
    sitsFlatBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToFaceAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToFaceBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldsAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldsBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToRightAngleAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToRightAngleBelowBoard: z.ZodOptional<z.ZodBoolean>;
    screenThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bezelInset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bezelDepth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    activeAreaWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    activeAreaHeight: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    screenColor: z.ZodOptional<z.ZodString>;
    bezelColor: z.ZodOptional<z.ZodString>;
    showScreen: z.ZodOptional<z.ZodBoolean>;
    flexCableLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableColor: z.ZodOptional<z.ZodString>;
    conductorCount: z.ZodOptional<z.ZodNumber>;
    conductorPitch: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorColor: z.ZodOptional<z.ZodString>;
    cableEdgeMargin: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    exposedContactLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    showConductors: z.ZodOptional<z.ZodBoolean>;
    showFlexCable: z.ZodOptional<z.ZodBoolean>;
    showStiffeners: z.ZodOptional<z.ZodBoolean>;
    stiffenerLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    stiffenerThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    stiffenerColor: z.ZodOptional<z.ZodString>;
    bendRadius: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bendSegments: z.ZodOptional<z.ZodNumber>;
    rightAngleVerticalLead: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    distanceAboveBoard: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    distanceBelowBoard: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldDistanceFromConnector: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldOutset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldSegments: z.ZodOptional<z.ZodNumber>;
    screenGap: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardTopZ: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardClearance: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartX: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartY: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartZ: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableLateralOffset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    screenOffset: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        y: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        z: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    }, z.core.$strict>>;
    screenRotation: z.ZodOptional<z.ZodTuple<[z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>], null>>;
    rotation: z.ZodOptional<z.ZodTuple<[z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>], null>>;
    offset: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        y: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        z: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    }, z.core.$strict>>;
    fn: z.ZodLiteral<"flexscreen">;
}, z.core.$strict>;
type FlexScreenModelDefinition = z.infer<typeof flexScreenModelDefinitionSchema>;
declare const modelDefinitionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    width: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    height: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    diagonal: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    aspectRatio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>>;
    ratio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<`${number}:${number}`, string>>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>>;
    defaultDiagonal: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    orientation: z.ZodOptional<z.ZodEnum<{
        sitsFlat: "sitsFlat";
        sitsFlatBelowBoard: "sitsFlatBelowBoard";
        foldedToFaceAboveBoard: "foldedToFaceAboveBoard";
        foldedToFaceBelowBoard: "foldedToFaceBelowBoard";
        foldedToRightAngleAboveBoard: "foldedToRightAngleAboveBoard";
        foldedToRightAngleBelowBoard: "foldedToRightAngleBelowBoard";
    }>>;
    sitsFlat: z.ZodOptional<z.ZodBoolean>;
    sitsFlatBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToFaceAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToFaceBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldsAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldsBelowBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToRightAngleAboveBoard: z.ZodOptional<z.ZodBoolean>;
    foldedToRightAngleBelowBoard: z.ZodOptional<z.ZodBoolean>;
    screenThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bezelInset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bezelDepth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    activeAreaWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    activeAreaHeight: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    screenColor: z.ZodOptional<z.ZodString>;
    bezelColor: z.ZodOptional<z.ZodString>;
    showScreen: z.ZodOptional<z.ZodBoolean>;
    flexCableLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    flexCableColor: z.ZodOptional<z.ZodString>;
    conductorCount: z.ZodOptional<z.ZodNumber>;
    conductorPitch: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorWidth: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    conductorColor: z.ZodOptional<z.ZodString>;
    cableEdgeMargin: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    exposedContactLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    showConductors: z.ZodOptional<z.ZodBoolean>;
    showFlexCable: z.ZodOptional<z.ZodBoolean>;
    showStiffeners: z.ZodOptional<z.ZodBoolean>;
    stiffenerLength: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    stiffenerThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    stiffenerColor: z.ZodOptional<z.ZodString>;
    bendRadius: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    bendSegments: z.ZodOptional<z.ZodNumber>;
    rightAngleVerticalLead: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    distanceAboveBoard: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    distanceBelowBoard: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldDistanceFromConnector: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldOutset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    foldSegments: z.ZodOptional<z.ZodNumber>;
    screenGap: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardTopZ: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardThickness: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    boardClearance: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartX: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartY: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableStartZ: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    cableLateralOffset: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    screenOffset: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        y: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        z: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    }, z.core.$strict>>;
    screenRotation: z.ZodOptional<z.ZodTuple<[z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>], null>>;
    rotation: z.ZodOptional<z.ZodTuple<[z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>], null>>;
    offset: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        y: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        z: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    }, z.core.$strict>>;
    fn: z.ZodLiteral<"flexscreen">;
}, z.core.$strict>, z.ZodObject<{
    metricSize: z.ZodEnum<{
        M2: "M2";
        "M2.5": "M2.5";
        M3: "M3";
        M4: "M4";
        M5: "M5";
        M6: "M6";
        M8: "M8";
        M10: "M10";
        M12: "M12";
    }>;
    length: z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>;
    showThreads: z.ZodDefault<z.ZodBoolean>;
    fn: z.ZodLiteral<"hexsocketbolt">;
}, z.core.$strict>], "fn">;
type ModelDefinition = z.infer<typeof modelDefinitionSchema>;

type RawModelprinterParams = {
    fn: string;
    string: string;
    [key: string]: unknown;
};
/**
 * Parses a model string into the same sort of raw builder parameters exposed
 * by `fp.string(...).params()`. Function-specific validation happens in
 * `.json()`.
 */
declare const parseModelStringParams: (definition: string) => RawModelprinterParams;

declare const string: (value: string) => {
    params: () => RawModelprinterParams;
    json: () => {
        metricSize: "M2" | "M2.5" | "M3" | "M4" | "M5" | "M6" | "M8" | "M10" | "M12";
        length: number;
        showThreads: boolean;
        fn: "hexsocketbolt";
    } | {
        fn: "flexscreen";
        width?: number | undefined;
        height?: number | undefined;
        diagonal?: number | undefined;
        aspectRatio?: number | `${number}:${number}` | [number, number] | undefined;
        ratio?: number | `${number}:${number}` | [number, number] | undefined;
        defaultDiagonal?: number | undefined;
        orientation?: "sitsFlat" | "sitsFlatBelowBoard" | "foldedToFaceAboveBoard" | "foldedToFaceBelowBoard" | "foldedToRightAngleAboveBoard" | "foldedToRightAngleBelowBoard" | undefined;
        sitsFlat?: boolean | undefined;
        sitsFlatBelowBoard?: boolean | undefined;
        foldedToFaceAboveBoard?: boolean | undefined;
        foldedToFaceBelowBoard?: boolean | undefined;
        foldsAboveBoard?: boolean | undefined;
        foldsBelowBoard?: boolean | undefined;
        foldedToRightAngleAboveBoard?: boolean | undefined;
        foldedToRightAngleBelowBoard?: boolean | undefined;
        screenThickness?: number | undefined;
        bezelInset?: number | undefined;
        bezelDepth?: number | undefined;
        activeAreaWidth?: number | undefined;
        activeAreaHeight?: number | undefined;
        screenColor?: string | undefined;
        bezelColor?: string | undefined;
        showScreen?: boolean | undefined;
        flexCableLength?: number | undefined;
        flexCableWidth?: number | undefined;
        flexCableThickness?: number | undefined;
        flexCableColor?: string | undefined;
        conductorCount?: number | undefined;
        conductorPitch?: number | undefined;
        conductorWidth?: number | undefined;
        conductorThickness?: number | undefined;
        conductorColor?: string | undefined;
        cableEdgeMargin?: number | undefined;
        exposedContactLength?: number | undefined;
        showConductors?: boolean | undefined;
        showFlexCable?: boolean | undefined;
        showStiffeners?: boolean | undefined;
        stiffenerLength?: number | undefined;
        stiffenerThickness?: number | undefined;
        stiffenerColor?: string | undefined;
        bendRadius?: number | undefined;
        bendSegments?: number | undefined;
        rightAngleVerticalLead?: number | undefined;
        distanceAboveBoard?: number | undefined;
        distanceBelowBoard?: number | undefined;
        foldDistanceFromConnector?: number | undefined;
        foldOutset?: number | undefined;
        foldSegments?: number | undefined;
        screenGap?: number | undefined;
        boardTopZ?: number | undefined;
        boardThickness?: number | undefined;
        boardClearance?: number | undefined;
        cableStartX?: number | undefined;
        cableStartY?: number | undefined;
        cableStartZ?: number | undefined;
        cableLateralOffset?: number | undefined;
        screenOffset?: {
            x?: number | undefined;
            y?: number | undefined;
            z?: number | undefined;
        } | undefined;
        screenRotation?: [string | number, string | number, string | number] | undefined;
        rotation?: [string | number, string | number, string | number] | undefined;
        offset?: {
            x?: number | undefined;
            y?: number | undefined;
            z?: number | undefined;
        } | undefined;
    };
};
declare const parseModelString: (value: string) => ModelDefinition;
declare const modelprinter: {
    string: (value: string) => {
        params: () => RawModelprinterParams;
        json: () => {
            metricSize: "M2" | "M2.5" | "M3" | "M4" | "M5" | "M6" | "M8" | "M10" | "M12";
            length: number;
            showThreads: boolean;
            fn: "hexsocketbolt";
        } | {
            fn: "flexscreen";
            width?: number | undefined;
            height?: number | undefined;
            diagonal?: number | undefined;
            aspectRatio?: number | `${number}:${number}` | [number, number] | undefined;
            ratio?: number | `${number}:${number}` | [number, number] | undefined;
            defaultDiagonal?: number | undefined;
            orientation?: "sitsFlat" | "sitsFlatBelowBoard" | "foldedToFaceAboveBoard" | "foldedToFaceBelowBoard" | "foldedToRightAngleAboveBoard" | "foldedToRightAngleBelowBoard" | undefined;
            sitsFlat?: boolean | undefined;
            sitsFlatBelowBoard?: boolean | undefined;
            foldedToFaceAboveBoard?: boolean | undefined;
            foldedToFaceBelowBoard?: boolean | undefined;
            foldsAboveBoard?: boolean | undefined;
            foldsBelowBoard?: boolean | undefined;
            foldedToRightAngleAboveBoard?: boolean | undefined;
            foldedToRightAngleBelowBoard?: boolean | undefined;
            screenThickness?: number | undefined;
            bezelInset?: number | undefined;
            bezelDepth?: number | undefined;
            activeAreaWidth?: number | undefined;
            activeAreaHeight?: number | undefined;
            screenColor?: string | undefined;
            bezelColor?: string | undefined;
            showScreen?: boolean | undefined;
            flexCableLength?: number | undefined;
            flexCableWidth?: number | undefined;
            flexCableThickness?: number | undefined;
            flexCableColor?: string | undefined;
            conductorCount?: number | undefined;
            conductorPitch?: number | undefined;
            conductorWidth?: number | undefined;
            conductorThickness?: number | undefined;
            conductorColor?: string | undefined;
            cableEdgeMargin?: number | undefined;
            exposedContactLength?: number | undefined;
            showConductors?: boolean | undefined;
            showFlexCable?: boolean | undefined;
            showStiffeners?: boolean | undefined;
            stiffenerLength?: number | undefined;
            stiffenerThickness?: number | undefined;
            stiffenerColor?: string | undefined;
            bendRadius?: number | undefined;
            bendSegments?: number | undefined;
            rightAngleVerticalLead?: number | undefined;
            distanceAboveBoard?: number | undefined;
            distanceBelowBoard?: number | undefined;
            foldDistanceFromConnector?: number | undefined;
            foldOutset?: number | undefined;
            foldSegments?: number | undefined;
            screenGap?: number | undefined;
            boardTopZ?: number | undefined;
            boardThickness?: number | undefined;
            boardClearance?: number | undefined;
            cableStartX?: number | undefined;
            cableStartY?: number | undefined;
            cableStartZ?: number | undefined;
            cableLateralOffset?: number | undefined;
            screenOffset?: {
                x?: number | undefined;
                y?: number | undefined;
                z?: number | undefined;
            } | undefined;
            screenRotation?: [string | number, string | number, string | number] | undefined;
            rotation?: [string | number, string | number, string | number] | undefined;
            offset?: {
                x?: number | undefined;
                y?: number | undefined;
                z?: number | undefined;
            } | undefined;
        };
    };
    getModelNames: () => string[];
};
/** Compact alias matching footprinter's familiar `fp.string(...)` API. */
declare const mp: {
    string: (value: string) => {
        params: () => RawModelprinterParams;
        json: () => {
            metricSize: "M2" | "M2.5" | "M3" | "M4" | "M5" | "M6" | "M8" | "M10" | "M12";
            length: number;
            showThreads: boolean;
            fn: "hexsocketbolt";
        } | {
            fn: "flexscreen";
            width?: number | undefined;
            height?: number | undefined;
            diagonal?: number | undefined;
            aspectRatio?: number | `${number}:${number}` | [number, number] | undefined;
            ratio?: number | `${number}:${number}` | [number, number] | undefined;
            defaultDiagonal?: number | undefined;
            orientation?: "sitsFlat" | "sitsFlatBelowBoard" | "foldedToFaceAboveBoard" | "foldedToFaceBelowBoard" | "foldedToRightAngleAboveBoard" | "foldedToRightAngleBelowBoard" | undefined;
            sitsFlat?: boolean | undefined;
            sitsFlatBelowBoard?: boolean | undefined;
            foldedToFaceAboveBoard?: boolean | undefined;
            foldedToFaceBelowBoard?: boolean | undefined;
            foldsAboveBoard?: boolean | undefined;
            foldsBelowBoard?: boolean | undefined;
            foldedToRightAngleAboveBoard?: boolean | undefined;
            foldedToRightAngleBelowBoard?: boolean | undefined;
            screenThickness?: number | undefined;
            bezelInset?: number | undefined;
            bezelDepth?: number | undefined;
            activeAreaWidth?: number | undefined;
            activeAreaHeight?: number | undefined;
            screenColor?: string | undefined;
            bezelColor?: string | undefined;
            showScreen?: boolean | undefined;
            flexCableLength?: number | undefined;
            flexCableWidth?: number | undefined;
            flexCableThickness?: number | undefined;
            flexCableColor?: string | undefined;
            conductorCount?: number | undefined;
            conductorPitch?: number | undefined;
            conductorWidth?: number | undefined;
            conductorThickness?: number | undefined;
            conductorColor?: string | undefined;
            cableEdgeMargin?: number | undefined;
            exposedContactLength?: number | undefined;
            showConductors?: boolean | undefined;
            showFlexCable?: boolean | undefined;
            showStiffeners?: boolean | undefined;
            stiffenerLength?: number | undefined;
            stiffenerThickness?: number | undefined;
            stiffenerColor?: string | undefined;
            bendRadius?: number | undefined;
            bendSegments?: number | undefined;
            rightAngleVerticalLead?: number | undefined;
            distanceAboveBoard?: number | undefined;
            distanceBelowBoard?: number | undefined;
            foldDistanceFromConnector?: number | undefined;
            foldOutset?: number | undefined;
            foldSegments?: number | undefined;
            screenGap?: number | undefined;
            boardTopZ?: number | undefined;
            boardThickness?: number | undefined;
            boardClearance?: number | undefined;
            cableStartX?: number | undefined;
            cableStartY?: number | undefined;
            cableStartZ?: number | undefined;
            cableLateralOffset?: number | undefined;
            screenOffset?: {
                x?: number | undefined;
                y?: number | undefined;
                z?: number | undefined;
            } | undefined;
            screenRotation?: [string | number, string | number, string | number] | undefined;
            rotation?: [string | number, string | number, string | number] | undefined;
            offset?: {
                x?: number | undefined;
                y?: number | undefined;
                z?: number | undefined;
            } | undefined;
        };
    };
    getModelNames: () => string[];
};

/** Nominal ISO 4762 / DIN 912 dimensions in millimeters (coarse thread).
 * Head/socket dimensions: https://docs.rs-online.com/284d/A700000011319867.pdf
 * Socket depth is the listed minimum. This is a visualization model, without
 * manufacturing tolerances, root radii, or the socket's drill-point relief.
 */
declare const hexSocketBoltDimensions: {
    readonly M2: {
        readonly diameter: 2;
        readonly threadPitch: 0.4;
        readonly headDiameter: 3.8;
        readonly headHeight: 2;
        readonly socketWidth: 1.5;
        readonly socketDepth: 1;
    };
    readonly "M2.5": {
        readonly diameter: 2.5;
        readonly threadPitch: 0.45;
        readonly headDiameter: 4.5;
        readonly headHeight: 2.5;
        readonly socketWidth: 2;
        readonly socketDepth: 1.1;
    };
    readonly M3: {
        readonly diameter: 3;
        readonly threadPitch: 0.5;
        readonly headDiameter: 5.5;
        readonly headHeight: 3;
        readonly socketWidth: 2.5;
        readonly socketDepth: 1.3;
    };
    readonly M4: {
        readonly diameter: 4;
        readonly threadPitch: 0.7;
        readonly headDiameter: 7;
        readonly headHeight: 4;
        readonly socketWidth: 3;
        readonly socketDepth: 2;
    };
    readonly M5: {
        readonly diameter: 5;
        readonly threadPitch: 0.8;
        readonly headDiameter: 8.5;
        readonly headHeight: 5;
        readonly socketWidth: 4;
        readonly socketDepth: 2.5;
    };
    readonly M6: {
        readonly diameter: 6;
        readonly threadPitch: 1;
        readonly headDiameter: 10;
        readonly headHeight: 6;
        readonly socketWidth: 5;
        readonly socketDepth: 3;
    };
    readonly M8: {
        readonly diameter: 8;
        readonly threadPitch: 1.25;
        readonly headDiameter: 13;
        readonly headHeight: 8;
        readonly socketWidth: 6;
        readonly socketDepth: 4;
    };
    readonly M10: {
        readonly diameter: 10;
        readonly threadPitch: 1.5;
        readonly headDiameter: 16;
        readonly headHeight: 10;
        readonly socketWidth: 8;
        readonly socketDepth: 5;
    };
    readonly M12: {
        readonly diameter: 12;
        readonly threadPitch: 1.75;
        readonly headDiameter: 18;
        readonly headHeight: 12;
        readonly socketWidth: 10;
        readonly socketDepth: 6;
    };
};
declare const metricBoltSizeSchema: z.ZodEnum<{
    M2: "M2";
    "M2.5": "M2.5";
    M3: "M3";
    M4: "M4";
    M5: "M5";
    M6: "M6";
    M8: "M8";
    M10: "M10";
    M12: "M12";
}>;
declare const hexSocketBoltModelPropsSchema: z.ZodObject<{
    metricSize: z.ZodEnum<{
        M2: "M2";
        "M2.5": "M2.5";
        M3: "M3";
        M4: "M4";
        M5: "M5";
        M6: "M6";
        M8: "M8";
        M10: "M10";
        M12: "M12";
    }>;
    length: z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>;
    showThreads: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
declare const hexSocketBoltModelDefinitionSchema: z.ZodObject<{
    metricSize: z.ZodEnum<{
        M2: "M2";
        "M2.5": "M2.5";
        M3: "M3";
        M4: "M4";
        M5: "M5";
        M6: "M6";
        M8: "M8";
        M10: "M10";
        M12: "M12";
    }>;
    length: z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>;
    showThreads: z.ZodDefault<z.ZodBoolean>;
    fn: z.ZodLiteral<"hexsocketbolt">;
}, z.core.$strict>;
type MetricBoltSize = z.infer<typeof metricBoltSizeSchema>;
type HexSocketBoltModelPropsInput = z.input<typeof hexSocketBoltModelPropsSchema>;
type HexSocketBoltModelProps = z.output<typeof hexSocketBoltModelPropsSchema>;
type HexSocketBoltModelDefinition = z.infer<typeof hexSocketBoltModelDefinitionSchema>;

/** Indexed triangles, counterclockwise from outside; millimeters, Z up. */
interface HexSocketBoltMesh {
    positions: number[];
    indices: number[];
}
/**
 * Head bearing plane at Z=0; tip at -length; head extends along +Z.
 * Produces a closed surface with a blind hex socket and a right-hand,
 * truncated 60-degree helical thread. Threads are a visual approximation.
 * No renderer dependencies are needed to consume the indexed mesh.
 */
declare const createHexSocketBoltMesh: (input: HexSocketBoltModelPropsInput) => HexSocketBoltMesh;

export { type FlexScreenAspectRatio, type FlexScreenModelDefinition, type FlexScreenModelProps, type FlexScreenModelPropsInput, type FlexScreenOrientation, type HexSocketBoltMesh, type HexSocketBoltModelDefinition, type HexSocketBoltModelProps, type HexSocketBoltModelPropsInput, type MetricBoltSize, type ModelDefinition, type RawModelprinterParams, createHexSocketBoltMesh, flexScreenAspectRatioSchema, flexScreenModelDefinitionSchema, flexScreenModelPropsSchema, flexScreenOrientationSchema, hexSocketBoltDimensions, hexSocketBoltModelDefinitionSchema, hexSocketBoltModelPropsSchema, metricBoltSizeSchema, modelDefinitionSchema, modelLengthSchema, modelprinter, mp, nonnegativeModelLengthSchema, parseModelString, parseModelStringParams, positiveModelLengthSchema, string };
