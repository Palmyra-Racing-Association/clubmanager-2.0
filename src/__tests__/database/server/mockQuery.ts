import { QueryOptions } from 'mysql2/promise';
import { GET_WORK_POINTS_BY_MEMBERSHIP_SQL, GET_WORK_POINTS_BY_MEMBER_SQL } from '../../../database/workPoints';

import {
    GET_BIKE_LIST_BY_MEMBERSHIP_SQL,
    GET_BIKE_LIST_SQL,
    GET_BIKE_SQL,
    INSERT_BIKE_SQL,
    PATCH_BIKE_SQL,
    DELETE_BIKE_SQL,
} from '../../../database/bike';
import pool from '../../../database/pool';
import {
    getBikeListResponse,
    getBikeResponse,
    insertBikeResponse,
    patchBikeResponse,
    deleteBikeResponse,
} from './mockHelpers/bike';
import { getWorkPointsByMemberResponse, getWorkPointsByMembershipResponse } from './mockHelpers/workPoints';

const mockQuery = jest.spyOn(pool, 'query').mockImplementation((sql: QueryOptions, values: any): Promise<any> => {
    switch (String(sql)) {
        case INSERT_BIKE_SQL:
            return insertBikeResponse(values[0]);
        case GET_BIKE_LIST_BY_MEMBERSHIP_SQL:
        case GET_BIKE_LIST_SQL:
            return getBikeListResponse(values);
        case GET_BIKE_SQL:
            return getBikeResponse(values[0]);
        case PATCH_BIKE_SQL:
            return patchBikeResponse(values[0]);
        case DELETE_BIKE_SQL:
            return deleteBikeResponse(values[0]);
        case GET_WORK_POINTS_BY_MEMBER_SQL:
            return getWorkPointsByMemberResponse(values);
        case GET_WORK_POINTS_BY_MEMBERSHIP_SQL:
            return getWorkPointsByMembershipResponse(values);
        default:
            return Promise.resolve();
    }
});

export default mockQuery;