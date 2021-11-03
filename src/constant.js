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
  "#333333",
  "#eff53d",
  "#336600"
];

const violationStatus = [
  {name: "waiting for Review", color: "#fcba03"}, 
  {name: "Rejected", color: "red"},
  {name: "Approved", color: "green"},
  {name: "Reverted", color: "blue"},
  {name: "Void", color: "grey"},
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
  "Deposit",
  "Dispute Freeze",
  "Violation Fine",
  "Violation Revert",
  "Shop Order",
  "Auto Reload",
  "Hold Captured",
  "Deposit Refund",
  "Hold Captured Refund",
  "Shop Order Refund"
];

const parkingViolationType = [
  "Normal",
  "Inside restricted area",
  "out side geo fence",
  "outside force parking area",
  "park no ride zone"
];

const technicianActionTypes = [
  "Service Start",
  "User Drop Off",
  "Rebalance Drop Off",
  "Maintenance Drop Off",
  "Agency Dropoff",
  "User Pick Up",
  "Maintenance",
  "Low Battery",
  "Service End",
  "Rebalance Pick Up",
  "Maintenance Pick Up",
  "Agency Pick Up",
  "Start Swap Battery",
  "End Swap Battery",
]
const lockOperationWay = [
  "GPRS",
  "BLUETOOTH",
  "ADMIN",
  "UNKNOWN",
  "TIMEOUT",
  "OUT-OF-BALANCE",
  "REACH_MAXIMUM",
  "SERVICE_OFF"
];

const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];

const statusMap = ["default", "processing", "success", "error"];
const operationStatus = ["NORMAL", "MANTAINANCE"];
const connectStatus = ["Offline", "Online"];
const lockStatus = ["Unlock", "lock"];
const rideType = ["USING", "FINISHED"];
const rideState = ["unconfirmed","success","error"];
const rideStateColor = ["#e5bb02","#0be024","#ff0000"];
const violateType = ["Normal", "In restricted fence", "out of geo fence", "out of force parking zone", "unknown"];
const limitType = ["Normal", "No Ride Zone", "limit speed zone", "unknown"];
const violateTypeColor = ["black", "#ff0000", "#b72126", "#1300ff", "#f1fc64"];

export { 
  fenceType, 
  fenceTypeColor, 
  transactionType, 
  parkingViolationType, 
  technicianActionTypes, 
  violationStatus, 
  vehicleType, 
  statusMap, 
  operationStatus, 
  connectStatus, 
  lockStatus, 
  rideType, 
  lockOperationWay, 
  rideState,
  violateType,
  limitType,
  violateTypeColor
};
