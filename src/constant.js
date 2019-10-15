const fenceType = [
  "geofence",
  "force parking area",
  "recommend parking",
  "lucky zone",
  "restricted parking",
  "sub-geofence",
  "no-ride-zone",
  "Low Speed Zone",
  "Ghost(Buffer) Zone"
];

const fenceTypeColor = [
  "#b72126",
  "#1300ff",
  "#65b30a",
  "#00b8aa",
  "#ff0000",
  "#b72126",
  "#7f7f7f",
  "#eff53d",
  "#336600"
];

const transactionType = [
  "Admin",
  "Membership Refund",
  "Admin Refund",
  "Buy Membership",
  "Pickup Fee",
  "Promo",
  "Migration",
  "Ride",
  "Deposit"
];

const parkingViolationType = [
  "Normal",
  "Inside restricted area",
  "out side geo fence",
  "outside force parking area",
  "park no ride zone"
];

export { fenceType, fenceTypeColor, transactionType, parkingViolationType };
