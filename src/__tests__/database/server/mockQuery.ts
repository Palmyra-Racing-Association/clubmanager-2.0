import { Pool, PoolConnection, QueryOptions } from 'mysql2/promise';
import { mock } from 'jest-mock-extended';

import {
    GET_BIKE_LIST_BY_MEMBERSHIP_SQL,
    GET_BIKE_LIST_SQL,
    GET_BIKE_SQL,
    INSERT_BIKE_SQL,
    PATCH_BIKE_SQL,
    DELETE_BIKE_SQL,
} from '../../../database/bike';
import {
    GET_MEMBER_LIST_SQL,
    GET_MEMBER_SQL,
    INSERT_MEMBER_SQL,
    PATCH_MEMBER_SQL,
    GET_MEMBER_UUID_SQL,
    GET_VALID_ACTORS_SQL,
} from '../../../database/member';
import {
    GET_EVENT_SQL,
    GET_EVENT_LIST_SQL,
    GET_EVENT_LIST_DATERANGE_SQL,
    INSERT_EVENT_SQL,
    PATCH_EVENT_SQL,
    DELETE_EVENT_SQL,
    GET_INSERTED_EVENT_ID_SQL,
} from '../../../database/event';
import {
    GET_BASE_DUES_SQL,
    GET_MEMBERSHIP_LIST_BY_STATUS_SQL,
    GET_MEMBERSHIP_LIST_SQL,
    GET_MEMBERSHIP_SQL,
    GET_REGISTERED_MEMBER_ID_SQL,
    GET_REGISTRATION_SQL,
    INSERT_MEMBERSHIP_SQL,
    PATCH_MEMBERSHIP_SQL,
    REGISTER_MEMBERSHIP_SQL,
} from '../../../database/membership';
import { GET_WORK_POINTS_BY_MEMBERSHIP_SQL, GET_WORK_POINTS_BY_MEMBER_SQL } from '../../../database/workPoints';
import {
    GET_EVENT_TYPE_LIST_SQL,
    GET_EVENT_TYPE_SQL,
    INSERT_EVENT_TYPE_SQL,
    PATCH_EVENT_TYPE_SQL,
} from '../../../database/eventType';
import {
    GET_JOB_LIST_SQL,
    GET_JOB_SQL,
    INSERT_JOB_SQL,
    PATCH_JOB_SQL,
    DELETE_JOB_SQL,
} from '../../../database/job';
import {
    GET_JOB_TYPE_LIST_SQL,
    GET_JOB_TYPE_SQL,
    INSERT_JOB_TYPE_SQL,
    PATCH_JOB_TYPE_SQL,
} from '../../../database/jobType';
import {
    GET_MEMBER_TYPE_LIST_SQL,
    GET_MEMBER_TYPE_SQL,
    PATCH_MEMBER_TYPE_SQL,
} from '../../../database/memberType';
import {
    GET_EVENT_JOB_SQL,
    DELETE_EVENT_JOB_SQL,
    INSERT_EVENT_JOB_SQL,
    PATCH_EVENT_JOB_SQL,
} from '../../../database/eventJob';
import {
    DELETE_BOARD_MEMBER_SQL,
    GET_BOARD_MEMBER_LIST_SQL,
    GET_BOARD_MEMBER_SQL,
    GET_BOARD_MEMBER_YEAR_SQL,
    INSERT_BOARD_MEMBER_SQL,
    PATCH_BOARD_MEMBER_SQL,
} from '../../../database/boardMember';
import {
    DELETE_BOARD_MEMBER_TYPE_SQL,
    GET_BOARD_MEMBER_TYPE_LIST_SQL,
    GET_BOARD_MEMBER_TYPE_SQL,
    INSERT_BOARD_MEMBER_TYPE_SQL,
    PATCH_BOARD_MEMBER_TYPE_SQL,
} from '../../../database/boardMemberType';
import {
    GENERATE_BILL_SQL,
    GET_BILL_LIST_SQL,
    GET_THRESHOLD_SQL,
    PATCH_BILL_SQL,
} from '../../../database/billing';

import * as pool from '../../../database/pool';
import * as bikeHelpers from './mockHelpers/bike';
import * as memberHelpers from './mockHelpers/member';
import * as eventHelpers from './mockHelpers/event';
import * as membershipHelpers from './mockHelpers/membership';
import { getWorkPointsByMemberResponse, getWorkPointsByMembershipResponse } from './mockHelpers/workPoints';
import * as eventTypeHelpers from './mockHelpers/eventType';
import * as jobHelpers from './mockHelpers/job';
import * as jobTypeHelpers from './mockHelpers/jobType';
import { getMemberTypeListResponse, getMemberTypeResponse, patchMemberTypeResponse } from './mockHelpers/memberType';
import * as eventJobHelpers from './mockHelpers/eventJob';
import * as boardMemberHelpers from './mockHelpers/boardMember';
import * as boardMemberTypeHelpers from './mockHelpers/boardMemberType';
import * as billingHelpers from './mockHelpers/billing';

const mockQueryImplementation = async (sql: QueryOptions, values: any): Promise<any> => {
    const sqlString = String(sql);
    switch (sqlString) {
        case INSERT_BIKE_SQL:
            return bikeHelpers.insertBikeResponse(values[0]);
        case GET_BIKE_LIST_BY_MEMBERSHIP_SQL:
        case GET_BIKE_LIST_SQL:
            return bikeHelpers.getBikeListResponse(values);
        case GET_BIKE_SQL:
            return bikeHelpers.getBikeResponse(values[0]);
        case PATCH_BIKE_SQL:
            return bikeHelpers.patchBikeResponse(values[0]);
        case DELETE_BIKE_SQL:
            return bikeHelpers.deleteBikeResponse(values[0]);
        case INSERT_MEMBER_SQL:
            return memberHelpers.insertMemberResponse(values[0]);
        case GET_MEMBER_LIST_SQL:
            return memberHelpers.getMemberListResponse(values);
        case GET_MEMBER_UUID_SQL:
        case GET_MEMBER_SQL:
            return memberHelpers.getMemberResponse(values[0]);
        case PATCH_MEMBER_SQL:
            return memberHelpers.patchMemberResponse(values[0]);
        case GET_VALID_ACTORS_SQL:
            return memberHelpers.getValidActorsResponse(values[0]);
        case INSERT_MEMBERSHIP_SQL:
            return membershipHelpers.insertMembershipResponse(values[0]);
        case GET_MEMBERSHIP_LIST_BY_STATUS_SQL:
        case GET_MEMBERSHIP_LIST_SQL:
            return membershipHelpers.getMembershipListResponse(values);
        case GET_MEMBERSHIP_SQL:
            return membershipHelpers.getMembershipResponse(values[0]);
        case PATCH_MEMBERSHIP_SQL:
            return membershipHelpers.patchMembershipResponse(values[0]);
        case REGISTER_MEMBERSHIP_SQL:
            return membershipHelpers.registerMembershipResponse(values[0]);
        case GET_REGISTERED_MEMBER_ID_SQL:
            return membershipHelpers.getRegisteredMemberIdResponse();
        case GET_REGISTRATION_SQL:
            return membershipHelpers.getRegistrationResponse(values[0]);
        case GET_BASE_DUES_SQL:
            return membershipHelpers.getBaseDuesResponse(values[0]);
        case GET_WORK_POINTS_BY_MEMBER_SQL:
            return getWorkPointsByMemberResponse(values);
        case GET_WORK_POINTS_BY_MEMBERSHIP_SQL:
            return getWorkPointsByMembershipResponse(values);
        case GET_EVENT_SQL:
            return eventHelpers.getEventResponse(values[0]);
        case GET_EVENT_LIST_DATERANGE_SQL:
        case GET_EVENT_LIST_SQL:
            return eventHelpers.getEventListResponse(values);
        case INSERT_EVENT_SQL:
            return eventHelpers.insertEventResponse(values[3]);
        case GET_INSERTED_EVENT_ID_SQL:
            return eventHelpers.getInsertedEventIdResponse();
        case PATCH_EVENT_SQL:
            return eventHelpers.patchEventResponse(values[0]);
        case DELETE_EVENT_SQL:
            return eventHelpers.deleteEventResponse(values[0]);
        case GET_EVENT_TYPE_SQL:
            return eventTypeHelpers.getEventTypeResponse(values[0]);
        case GET_EVENT_TYPE_LIST_SQL:
            return eventTypeHelpers.getEventTypeListResponse();
        case INSERT_EVENT_TYPE_SQL:
            return eventTypeHelpers.insertEventTypeResponse(values[0]);
        case PATCH_EVENT_TYPE_SQL:
            return eventTypeHelpers.patchEventTypeResponse(values[0]);
        case GET_JOB_SQL:
            return jobHelpers.getJobResponse(values[0]);
        case GET_JOB_LIST_SQL:
            return jobHelpers.getJobListResponse(values);
        case INSERT_JOB_SQL:
            return jobHelpers.insertJobResponse(values[0]);
        case PATCH_JOB_SQL:
            return jobHelpers.patchJobResponse(values[0]);
        case DELETE_JOB_SQL:
            return jobHelpers.deleteJobResponse(values[0]);
        case GET_JOB_TYPE_SQL:
            return jobTypeHelpers.getJobTypeResponse(values[0]);
        case GET_JOB_TYPE_LIST_SQL:
            return jobTypeHelpers.getJobTypeListResponse();
        case INSERT_JOB_TYPE_SQL:
            return jobTypeHelpers.insertJobTypeResponse(values[0]);
        case PATCH_JOB_TYPE_SQL:
            return jobTypeHelpers.patchJobTypeResponse(values[0]);
        case GET_MEMBER_TYPE_SQL:
            return getMemberTypeResponse(values[0]);
        case GET_MEMBER_TYPE_LIST_SQL:
            return getMemberTypeListResponse();
        case PATCH_MEMBER_TYPE_SQL:
            return patchMemberTypeResponse(values[0]);
        case GET_EVENT_JOB_SQL:
            return eventJobHelpers.getEventJobResponse(values[0]);
        case INSERT_EVENT_JOB_SQL:
            return eventJobHelpers.insertEventJobResponse(values[0]);
        case PATCH_EVENT_JOB_SQL:
            return eventJobHelpers.patchEventJobResponse(values[0]);
        case DELETE_EVENT_JOB_SQL:
            return eventJobHelpers.deleteEventJobResponse(values[0]);
        case GET_BOARD_MEMBER_SQL:
            return boardMemberHelpers.getBoardMemberResponse(values[0]);
        case GET_BOARD_MEMBER_LIST_SQL:
            return boardMemberHelpers.getBoardMemberListResponse(values);
        case GET_BOARD_MEMBER_YEAR_SQL:
            return boardMemberHelpers.getBoardMemberListResponse(values);
        case INSERT_BOARD_MEMBER_SQL:
            return boardMemberHelpers.insertBoardMemberResponse(values[0]);
        case PATCH_BOARD_MEMBER_SQL:
            return boardMemberHelpers.patchBoardMemberResponse(values[0]);
        case DELETE_BOARD_MEMBER_SQL:
            return boardMemberHelpers.deleteBoardMemberResponse(values[0]);
        case GET_BOARD_MEMBER_TYPE_SQL:
            return boardMemberTypeHelpers.getBoardMemberTypeResponse(values[0]);
        case GET_BOARD_MEMBER_TYPE_LIST_SQL:
            return boardMemberTypeHelpers.getBoardMemberListTypeResponse();
        case INSERT_BOARD_MEMBER_TYPE_SQL:
            return boardMemberTypeHelpers.insertBoardMemberTypeResponse(values[0]);
        case PATCH_BOARD_MEMBER_TYPE_SQL:
            return boardMemberTypeHelpers.patchBoardMemberTypeResponse(values[1]);
        case DELETE_BOARD_MEMBER_TYPE_SQL:
            return boardMemberTypeHelpers.deleteBoardMemberTypeResponse(values[0]);
        case GET_BILL_LIST_SQL:
            return billingHelpers.getBillListResponse(values);
        case GENERATE_BILL_SQL:
            return billingHelpers.generateBillResponse(values[0]);
        case PATCH_BILL_SQL:
            return billingHelpers.patchBillResponse(values[0]);
        case GET_THRESHOLD_SQL:
            return billingHelpers.getWorkPointThresholdResponse(values[0]);
        default:
            // We need to run this check in our default as our dynamic SQL does not directly
            // Match any of our prebuilt SQL statements
            if (sqlString.includes(GET_JOB_LIST_SQL)) {
                return jobHelpers.getJobListResponse(values);
            }
            if (sqlString.includes(GET_BILL_LIST_SQL)) {
                return billingHelpers.getBillListResponse(values);
            }
            if (sqlString.includes(GET_MEMBER_LIST_SQL)) {
                return memberHelpers.getMemberListResponse(values);
            }
            return Promise.resolve();
    }
};

const mockPool = mock<Pool>();
const mockConn = mock<PoolConnection>();
jest.spyOn(pool, 'getPool').mockReturnValue(mockPool);
mockPool.getConnection.mockResolvedValue(mockConn);

export const mockQuery = mockPool.query.mockImplementation(mockQueryImplementation);

export const mockConnQuery = mockConn.query.mockImplementation(mockQueryImplementation);
