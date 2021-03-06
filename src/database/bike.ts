import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { Bike, PatchBikeRequest, PostNewBikeRequest } from '../typedefs/bike';

export const GET_BIKE_LIST_SQL = 'SELECT bike_id, year, make, model, membership_admin FROM v_bike';
export const GET_BIKE_LIST_BY_MEMBERSHIP_SQL = `${GET_BIKE_LIST_SQL} WHERE membership_id = ?`;
export const GET_BIKE_SQL = 'SELECT bike_id, year, make, model, membership_admin FROM v_bike WHERE bike_id = ?';
export const INSERT_BIKE_SQL = 'INSERT INTO member_bikes (year, make, model, membership_id) VALUES (?, ?, ?, ?)';
export const PATCH_BIKE_SQL = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
export const DELETE_BIKE_SQL = 'DELETE FROM member_bikes WHERE bike_id = ?';

export async function insertBike(req: PostNewBikeRequest): Promise<number> {
    const values = [req.year, req.make, req.model, req.membershipId];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_BIKE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1048: // non-null violation, missing a non-nullable column
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting bike in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting bike: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getBikeList(membershipId?: number): Promise<Bike[]> {
    let sql;
    let values: number[];
    if (typeof membershipId !== 'undefined') {
        sql = GET_BIKE_LIST_BY_MEMBERSHIP_SQL;
        values = [membershipId];
    } else {
        sql = GET_BIKE_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting bike list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        bikeId: result.bike_id,
        year: result.year,
        make: result.make,
        model: result.model,
        membershipAdmin: result.membership_admin,
    }));
}

export async function getBike(id: number): Promise<Bike> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_BIKE_SQL, values);
    } catch (e) {
        logger.error(`DB error getting bike: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        bikeId: results[0].bike_id,
        year: results[0].year,
        make: results[0].make,
        model: results[0].model,
        membershipAdmin: results[0].membership_admin,
    };
}

export async function patchBike(id: number, req: PatchBikeRequest): Promise<void> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }

    const values = [id, req.year, req.make, req.model, req.membershipId];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_BIKE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1048: // non-null violation, missing a non-nullable column
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching bike in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching bike: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function deleteBike(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(DELETE_BIKE_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting bike: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
