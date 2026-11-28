# Low-Head Socket Screw (`lowheadsocket`)

DIN 7984 metric low cylindrical-head hex-socket cap screw.

## Example Model String

```text
lowheadsocket_din7984_m3_l10mm_hexsocket
```

## Parameters and Flags

| Token | Property | Normalized Unit | Notes |
| --- | --- | --- | --- |
| `din7984` | `din7984` | `true` | Value-free DIN 7984 standard flag |
| `m<size>` | `thread` | `string` | Nominal metric thread (`m3`..`m12`) |
| `l<length>` | `length` | `mm` | Under-head shank length |
| `hexsocket` | `hexSocket` | `true` | Value-free internal hex socket drive flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
