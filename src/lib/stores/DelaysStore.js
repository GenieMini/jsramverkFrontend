import { writable } from 'svelte/store';
import { getData, ROUTES } from '../../routes/utils';

export const user = writable({
    username: 'jdoe',
    name: 'John Doe',
    email: 'jdoe@email.com'
  });

export const delayz2 = writable(await getData(ROUTES.DELAYS));

export const delayz = writable([
    {
        "ActivityId": "1500adde-095d-334b-08db-bca2b5cb5910",
        "ActivityType": "Avgang",
        "AdvertisedTimeAtLocation": "2023-10-09T10:58:00.000+02:00",
        "AdvertisedTrainIdent": "1763",
        "Canceled": false,
        "EstimatedTimeAtLocation": "2023-10-09T11:15:00.000+02:00",
        "FromLocation": [
            {
                "LocationName": "Hb",
                "Priority": 1,
                "Order": 0
            }
        ],
        "LocationSignature": "Gnb",
        "OperationalTrainNumber": "1763",
        "ToLocation": [
            {
                "LocationName": "Trg",
                "Priority": 1,
                "Order": 0
            }
        ],
        "TrainOwner": "SKANE"
    },
    {
        "ActivityId": "1500adde-f75d-c409-08db-c3463dc63be6",
        "ActivityType": "Avgang",
        "AdvertisedTimeAtLocation": "2023-10-09T10:59:00.000+02:00",
        "AdvertisedTrainIdent": "356",
        "Canceled": false,
        "EstimatedTimeAtLocation": "2023-10-09T11:57:00.000+02:00",
        "FromLocation": [
            {
                "LocationName": "G",
                "Priority": 1,
                "Order": 0
            }
        ],
        "LocationSignature": "Sfl",
        "OperationalTrainNumber": "20356",
        "ToLocation": [
            {
                "LocationName": "Kil",
                "Priority": 1,
                "Order": 0
            }
        ],
        "TrainOwner": "SJ"
    }
]);