export default {
  // user

  "Customer Management": {
    "GET /api/admins/customers": "get.customers",
    "GET /api/admins/customers/{customerId}": "get.customer.detail",
    "PUT /api/admins/customers/{customerId}": "update.customer.detail",
    "POST /api/admins/customers": "create.customer",
    "GET /api/admins/coupons": "get.customer.coupons",
    "POST /api/admins/coupons/{couponId}/customers/{customerId}":
      "add.coupon.to.customer",
    "PUT /api/admins/rides/{rideId}/end": "end.customer.ride",
    "DELETE /api/admins/coupons/customers/{customerCouponId}":
      "delete.customer.coupon"
  },
  "Vehicle List": {
    "GET /api/admins/vehicles": "get.vehicles",
    "GET /api/admins/vehicles/total": "get.vehicles.total",
    "GET /api/admins/vehicles/{id}": "get.vehicles.detail",
    "PUT /api/admins/vehicles/{id}": "update.vehicle.detail",
    "POST /api/admins/vehicles": "create.vehicle",
    "PUT /api/admins/vehicles/{id}/unlock": "unlock.vehicle"
  },
  "Riding History": {
    "GET /api/admins/rides": "get.rides",
    "GET /api/admins/rides/count": "get.rides.total",
    "PUT /api/admins/rides/{rideId}/end": "end.ride",
    "GET /api/admins/rides/{rideId}/route": "get.ride.route"
  },
  "Geo Management": {
    "GET /api/admins/geo/fences": "get.fences",
    "GET /api/admins/geo/area_center": "get.area.center",
    "DELETE /api/admins/geo/fences/{fenceId}": "delete.fence",
    "POST /api/admins/geo/fences": "create.fence",
    "PUT /api/admins/geo/fences/{fenceId}": "update.fence",
    "POST /api/admins/geo/area_center": "create.center",
    "PUT /api/admins/geo/area_center/{centerId}": "update.center",
    "DELETE /api/admins/geo/area_center/{centerId}": "delete.center"
  },
  "Area Management": {
    "GET /api/admins/areas/{area_id}": "get.area.detail",
    "DELETE /api/admins/areas/{area_id}": "delete.area",
    "PUT /api/admins/areas/{area_id}": "update.area.detail",
    "GET /api/admins/areas": "get.areas",
    "POST /api/admins/areas": "create.area"
  },
  "Coupon Management": {
    "DELETE /api/admins/coupons/{couponId}": "delete.coupon",
    "PUT /api/admins/coupons/{couponId}": "update.coupon.detail",
    "GET /api/admins/coupons": "get.coupons",
    "GET /api/admins/coupons/customers/{customerId}": "get.customer.coupons",
    "DELETE /api/admins/coupons/customers/{customerCouponId}":
      "delete.customer.coupons",
    "POST /api/admins/coupons": "create.coupon",
    "POST /api/admins/coupons/{couponId}/customers/{customerId}":
      "assign.coupon.to.customer"
  },
  "Membership Management": {
    "DELETE /api/admins/memberships/{membershipId}": "delete.membership",
    "PUT /api/admins/memberships/{membershipId}": "update.membership.detail",
    "GET /api/admins/memberships": "get.memberships",
    "POST /api/admins/memberships": "create.membership"
  }
};
