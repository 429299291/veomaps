import {
    getViolations,
    updateViolationReject,
    updateViolationRevert,
    updateViolationApprove,
    countViolations,
    getViolationDatail
} from '@/services/vehicle-violation';
import {getTechniciansAll} from '@/services/technician';
import {getRideBillingInfo} from '@/services/ride'
import {getCustomerDetail} from '@/services/customer'
import {getTechnicians} from '@/services/technician'
import { message } from 'antd'; 

export default {
    namespace: "vehicleViolations",

    state: {
        data: [],
        total: 0
    },

    effects: {
        *get({ payload }, { call, put }) {
            const response = yield call(getViolations, payload);
            if (response) {
                yield put({
                    type: "save",
                    data: response.content,
                    total:response.totalSize
                });
            }
        },
        *getDetail ({ id, onSuccess }, { call, put }) {
            const response = yield call(getViolationDatail, id);
            const technicianResponseAll = yield call(getTechniciansAll, response.violationTechnicianInfo.technicianId,);
            const technicianResponse = yield call(getTechnicians, response.violationTechnicianInfo.technicianId,);
            const rideResponse = yield call(getRideBillingInfo, response.violationRideInfo.rideId,);
              const customerResponse = yield call(getCustomerDetail, response.violationCustomerInfo.customerId,);
              const allResponse = Object.assign(response,rideResponse.ride,technicianResponse,
                // technicianResponseAll.content.filter(data=>{return data.id == response.violationTechnicianInfo.technicianId})[0]
                )
            //   console.log(customerResponse);
            //   console.log(allResponse);
              onSuccess(allResponse);
        },
        /////
        // *update({ payload, id, onSuccess }, {call, put }) {
        //     const response = yield call(updateViolation, id, payload);
        //     if (response) {
        //         message.success("Successfully Update the Status of Violation: " + id);
        //         onSuccess && onSuccess();
        //     } 
        // }
        *updateReject({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateViolationReject, id, payload);
            if (response) {
                message.success("Successfully Update the Status of Violation: " + id);
                onSuccess && onSuccess();
            } 
        },
        *updateRevert({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateViolationRevert, id, payload);
            if (response) {
                message.success("Successfully Update the Status of Violation: " + id);
                onSuccess && onSuccess();
            } 
        },
        *updateApprove({ payload, id, onSuccess }, {call, put }) {
            const response = yield call(updateViolationApprove, id, payload);
            if (response) {
                message.success("Successfully Update the Status of Violation: " + id);
                onSuccess && onSuccess();
            } 
        }

    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.data,
                total: action.total
            };
          }
    }
}