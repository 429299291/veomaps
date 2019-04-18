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
    "DELETE /api/admins/coupons/customers/{customerCouponId}":
      "delete.customer.coupon",
    "GET /api/admins/customers/{customerId}/charge_history":
      "get.customer.payment",
    "GET /api/admins/memberships/customers/{customerId}":
      "get.customer.membership",
    "GET /api/admins/memberships/customers/{customerId}/available":
      "get.customer.available.membership",
    "POST /api/admins/memberships/customers/{customerId}/buy":
      "customer.buy.membership",
    "POST /api/admins/customers/{customerId}/refund": "refund.customer.charge"
  },
  "Vehicle List": {
    "GET /api/admins/vehicles": "get.vehicles",
    "GET /api/admins/vehicles/{id}": "get.vehicle",
    "GET /api/admins/vehicles/total": "get.vehicles.total",
    "GET /api/admins/vehicles/{id}/detail": "get.vehicles.detail",
    "PUT /api/admins/vehicles/{id}": "update.vehicle.detail",
    "POST /api/admins/vehicles": "create.vehicle",
    "PUT /api/admins/vehicles/{id}/unlock": "unlock.vehicle",
    "PUT /api/admins/vehicles/{id}/location": "update.vehicle.location",
    "PUT /api/admins/vehicles/locations/{areaId}": "update.all.vehicle.location",
    "GET /api/admins/vehicles/{id}/orders": "get.vehicle.orders",
    "POST /api/admins/vehicles/{id}/find": "alert.vehicle",
  },
  "Riding History": {
    "GET /api/admins/rides": "get.rides",
    "GET /api/admins/rides/count": "get.rides.total",
    "PUT /api/admins/rides/{rideId}/end": "end.ride",
    "GET /api/admins/rides/{rideId}/route": "get.ride.route",
    "GET /api/admins/rides/{areaId}/start_points": "get.area.start.points"
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
    "GET /api/admins/areas/all": "get.all.areas",
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
      "assign.coupon.to.customer",
    "POST /api/admins/coupons/{couponId}" : "generate.code.coupon"
  },
  "Membership Management": {
    "DELETE /api/admins/memberships/{membershipId}": "delete.membership",
    "PUT /api/admins/memberships/{membershipId}": "update.membership.detail",
    "GET /api/admins/memberships": "get.memberships",
    "GET /api/admins/memberships/{membershipId}/detail": "get.membership.detail",
    "POST /api/admins/memberships": "create.membership"
  },
  "Price Management": {
    "DELETE /api/admins/prices/{id}": "delete.price",
    "PUT /api/admins/prices/{id}": "update.price.detail",
    "GET /api/admins/prices": "get.prices",
    "POST /api/admins/prices": "create.price"
  },
  "Vehicle Error Management": {
    "DELETE /api/admins/errors/{errorId}": "delete.error",
    "PUT /api/admins/errors/{errorId}": "update.error.detail",
    "GET /api/admins/errors": "get.errors",
    "POST /api/admins/errors/batch_pass": "batch.pass.error",
    "GET /api/admins/errors/{errorId}/image_paths": "get.image.paths",
  },
  "Role Management": {
    "DELETE /api/admins/roles/{roleId}": "delete.role",
    "PUT /api/admins/roles/{roleId}": "update.role.detail",
    "GET /api/admins/roles/details": "get.roles.details",
    "POST /api/admins/roles": "add.role"
  },
  "Privilege Management": {
    "GET /api/admins/privileges": "get.privileges",
    "PUT /api/admins/roles/{roleId}/update_privileges": "update.role.privilege"
  },
  "Admin Management": {
    "DELETE /api/admins/{adminId}": "delete.admin",
    "PUT /api/admins/{adminId}": "update.admin.detail",
    "POST /api/admins/{adminId}/update_password": "update.admin.password",
    "GET /api/admins": "get.admins",
    "GET /api/admins/me": "get.me",
    "PUT /api/admins/me": "update.me",
    "POST /api/admins/register": "add.admin",
    "POST /api/admins/register_by_email": "register.admin.email",
    "PUT /api/admins/me/update_password": "update.me.password"
  },
  "Technician Management": {
    "DELETE /api/admins/technicians/{technicianId}": "delete.technician",
    "GET /api/admins/technicians": "get.technicians",
    "POST /api/admins/technicians/register_by_email": "register.techncian.email"
  },
  Dashboard: {
    "GET /api/admins/vehicles/location_details/{areaId}": "get.vehicle.location"
  }
};
