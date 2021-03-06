/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getBikeListResponse(values: number[]) {
    const bikeList = [
        {
            bike_id: 10,
            year: '1996',
            make: 'Honda',
            model: 'WR450F',
            membership_admin: 'membership42Admin',
        }, {
            bike_id: 11,
            year: '1997',
            make: 'Hondoyota',
            model: 'WR451G',
            membership_admin: 'someOtherAdmin',
        }, {
            bike_id: 12,
            year: '1997',
            make: 'Yamahonda',
            model: 'WR452H',
            membership_admin: 'membership42Admin',
        },
    ];

    const filterList =
        (membershipAdmin: string) => bikeList.filter((bike) => bike.membership_admin === membershipAdmin);

    if (values.length === 0) {
        return Promise.resolve([bikeList]);
    }

    switch (values[0]) {
        case 42:
            return Promise.resolve([filterList('membership42Admin')]);
        case 1000:
            return Promise.resolve([filterList('adminWithNoBikes')]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function getBikeResponse(id: number) {
    switch (id) {
        case 18:
            return Promise.resolve([[{
                bike_id: 18,
                year: '1996',
                make: 'Honda',
                model: 'WR450F',
                membership_admin: 'Addia Shipway',
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertBikeResponse(year: string) {
    switch (year) {
        case '-100':
            throw { errno: 0 };
        case '-200':
            throw new Error('this error should not happen');
        case '1452':
            throw { errno: 1452 };
        case '2010':
            return Promise.resolve([{ insertId: 321 }]);
        default:
            return Promise.resolve();
    }
}

export function patchBikeResponse(id: number) {
    switch (id) {
        case 42:
            return Promise.resolve([{ affectedRows: 1 }]);
        case 3000:
            return Promise.resolve([{ affectedRows: 0 }]);
        case 1452:
            throw { errno: 1452 };
        case -100:
            throw { errno: 0 };
        case -200:
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}

export function deleteBikeResponse(id: number) {
    switch (id) {
        case 50:
            return Promise.resolve([{ affectedRows: 1 }]);
        case 5000:
            return Promise.resolve([{ affectedRows: 0 }]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}
