export default {
  // user

  "Customer Management": {
    "GET /api/admins/customers": "get.customers",
    "GET /api/admins/customers/{customerId}": "get.customer.detail",
    "GET /api/admins/notifications": "get.customers.notifications",
    "POST /api/admins/notifications/areas/{area_id}/type/{message_type}": "send.customer.notification",
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
    "POST /api/admins/customers/{customerId}/refund": "refund.customer.charge",
    "GET /api/admins/customers/{customerId}/transactions": "get.customer.transactions",
    "GET /api/admins/customers/{phone_number}/temp_code": "get.customer.verification.code"
  },
  "Vehicle List": {
    "GET /api/admins/vehicles": "get.vehicles",
    "GET /api/admins/vehicles/{id}": "get.vehicle",
    "GET /api/admins/vehicles/total": "get.vehicles.total",
    "GET /api/admins/vehicles/{id}/detail": "get.vehicles.detail",
    "PUT /api/admins/vehicles/{id}": "update.vehicle.detail",
    "POST /api/admins/vehicles": "create.vehicle",
    "PUT /api/admins/vehicles/{id}/unlock": "unlock.vehicle",
    "PUT /api/admins/vehicles/{id}/lock": "lock.vehicle",
    "PUT /api/admins/vehicles/{id}/location": "update.vehicle.location",
    "PUT /api/admins/vehicles/locations/{areaId}":
      "update.all.vehicle.location",
    "GET /api/admins/vehicles/{id}/orders": "get.vehicle.orders",
    "POST /api/admins/vehicles/{id}/find": "alert.vehicle",
    "POST /api/admins/vehicles/{id}/restart": "restart.vehicle",
    "POST /api/admins/vehicles/{id}/get_status": "get.status",
    "GET /api/admins/vehicles/{id}/location/reference": "get.ref",
    "POST /api/admins/vehicles/{vehicleNumber}/action": "apply.action",
    "PUT /api/admins/vehicles/{id}/control": "vehicle.control",
    "PUT /api/admins/vehicles/{id}/control_extension": "vehicle.control.extension" 
  },
  "Riding History": {
    "GET /api/admins/rides": "get.rides",
    "GET /api/admins/rides/count": "get.rides.total",
    "PUT /api/admins/rides/{rideId}/end": "end.ride",
    "GET /api/admins/rides/{rideId}/route": "get.ride.route",
    "GET /api/admins/rides/{areaId}/start_points": "get.area.start.points",
    "GET /api/admins/rides/{ride_id}/image": "get.ride.image"
  },
  "Geo Management": {
    "GET /api/admins/geo/fences": "get.fences",
    "GET /api/admins/geo/area_center": "get.area.center",
    "DELETE /api/admins/geo/fences/{fenceId}": "delete.fence",
    "POST /api/admins/geo/fences": "create.fence",
    "PUT /api/admins/geo/fences/{fenceId}": "update.fence",
    "POST /api/admins/geo/area_center": "create.center",
    "PUT /api/admins/geo/area_center/{centerId}": "update.center",
    "DELETE /api/admins/geo/area_center/{centerId}": "delete.center",
    "GET /api/admins/geo/examine_parking_test": "examine.parking",
    "POST /api/admins/prime-locations": "create.primeLocation",
    "DELETE /api/admins/prime-locations/{id}": "delete.primeLocation",
    "GET /api/admins/prime-locations/area/{areaId}": "get.primeLocation.by.areaId",
  },
  "Area Management": {
    "GET /api/admins/areas/{area_id}": "get.area.detail",
    "DELETE /api/admins/areas/{area_id}": "delete.area",
    "PUT /api/admins/areas/{area_id}": "update.area.detail",
    "GET /api/admins/areas": "get.areas",
    "GET /api/admins/areas/all": "get.all.areas",
    "POST /api/admins/areas": "create.area",
    "GET /api/admins/areas/features": "get.area.features",
    "PUT /api/admins/areas/features/{id}": "update.area.feature",
    "POST /api/admins/areas/features": "create.area.feature",
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
    "POST /api/admins/coupons/{couponId}": "generate.code.coupon"
  },
  "Promo Management": {
    "PUT /api/admins/promos/{promoId}": "update.promo.detail",
    "GET /api/admins/promos": "get.promos",
    "POST /api/admins/promos": "create.promo",
    "POST /api/admins/promos/{promoId}/code": "generate.code.promo"
  },
  "Deposit Management": {
    "PUT /api/admins/deposits/{deposit_id}": "update.deposit.detail",
    "GET /api/admins/deposits": "get.deposits",
    "POST /api/admins/deposits": "create.deposit",
    "DELETE /api/admins/deposits/{deposit_id}": "delete.deposit"
  },
  "Membership Management": {
    "DELETE /api/admins/memberships/{membershipId}": "delete.membership",
    "PUT /api/admins/memberships/{membershipId}": "update.membership.detail",
    "GET /api/admins/memberships": "get.memberships",
    "GET /api/admins/memberships/{membershipId}/detail":
      "get.membership.detail",
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
    "GET /api/admins/errors/{errorId}/image_paths": "get.image.paths"
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
    "POST /api/admins/technicians/register_by_email": "register.techncian.email", 
    "PUT /api/admins/technicians/{technicianId}": "update.technician"
  },
  "Dashboard": {
    "GET /api/admins/dashboard/ride_count": "get.ride.count",
    "GET /api/admins/dashboard/customer_count": "get.customer.count",
    "GET /api/admins/dashboard/ride_per_vehicle_rank": "get.ride.vehicle.rank",
    "GET /api/admins/dashboard/daily_ride_count": "get.daily.ride.count",
    "GET /api/admins/dashboard/weekly_battery_state": "get.weekly.battery.state",
    "GET /api/admins/dashboard/stripe_revenue": "get.stripe.revenue",
    "GET /api/admins/dashboard/stripe_revenue_by_period":"get.stripe.revenue.by.period",
    "GET /api/admins/dashboard/ride_revenue": "get.ride.revenue",
    "GET /api/admins/dashboard/daily_ride_revenue": "get.daily.ride.revenue",
    "GET /api/admins/dashboard/connectivity": "get.connectivity.by.period"
  },

  "Performance": {
    "GET /api/admins/analytics/analytic-report": "get.area.performance.history",
    "GET /api/admins/analytics/areas": "get.area.performance.rank",
  },

};
