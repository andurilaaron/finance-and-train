// TfNSW Transport API Client for Sydney Trains
import protobuf from 'protobufjs';

const TFNSW_API_BASE = 'https://api.transport.nsw.gov.au/v2/gtfs/realtime';

// GTFS Realtime Protocol Buffer Schema (simplified)
const gtfsRealtimeProto = `
syntax = "proto2";

message FeedMessage {
  required FeedHeader header = 1;
  repeated FeedEntity entity = 2;
}

message FeedHeader {
  required string gtfs_realtime_version = 1;
  optional uint64 timestamp = 2;
}

message FeedEntity {
  required string id = 1;
  optional TripUpdate trip_update = 2;
}

message TripUpdate {
  required TripDescriptor trip = 1;
  repeated StopTimeUpdate stop_time_update = 2;
}

message TripDescriptor {
  optional string trip_id = 1;
  optional string route_id = 2;
  optional string start_time = 3;
  optional string start_date = 4;
}

message StopTimeUpdate {
  optional uint32 stop_sequence = 1;
  optional string stop_id = 2;
  optional StopTimeEvent arrival = 3;
  optional StopTimeEvent departure = 4;
}

message StopTimeEvent {
  optional int64 time = 1;
  optional int32 delay = 2;
}
`;

let root;

async function initProtobuf() {
    if (!root) {
        root = protobuf.parse(gtfsRealtimeProto).root;
    }
    return root;
}

export async function fetchRealtimeTrips(mode = 'sydneytrains') {
    try {
        const response = await fetch(`${TFNSW_API_BASE}/${mode}`, {
            headers: {
                'Authorization': `Bearer ${process.env.TFNSW_API_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`TfNSW API error: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const root = await initProtobuf();
        const FeedMessage = root.lookupType('FeedMessage');
        const message = FeedMessage.decode(buffer);

        return FeedMessage.toObject(message, {
            longs: String,
            enums: String,
            bytes: String,
        });
    } catch (error) {
        console.error('Error fetching realtime trips:', error);
        throw error;
    }
}

export async function getNextDepartures(stopId, limit = 5) {
    try {
        const data = await fetchRealtimeTrips();

        const departures = [];

        for (const entity of data.entity || []) {
            if (entity.tripUpdate) {
                const trip = entity.tripUpdate;

                for (const stopTime of trip.stopTimeUpdate || []) {
                    if (stopTime.stopId === stopId && stopTime.departure) {
                        departures.push({
                            tripId: trip.trip.tripId,
                            routeId: trip.trip.routeId,
                            stopId: stopTime.stopId,
                            departureTime: stopTime.departure.time,
                            delay: stopTime.departure.delay || 0,
                            scheduledTime: new Date(parseInt(stopTime.departure.time) * 1000),
                        });
                    }
                }
            }
        }

        // Sort by departure time
        departures.sort((a, b) => a.departureTime - b.departureTime);

        return departures.slice(0, limit);
    } catch (error) {
        console.error('Error getting next departures:', error);
        return [];
    }
}

// Popular Sydney train stations
export const SYDNEY_STATIONS = [
    { id: '10101100', name: 'Central', lines: ['T1', 'T2', 'T3', 'T4', 'T8'] },
    { id: '10101120', name: 'Town Hall', lines: ['T2', 'T3', 'T8'] },
    { id: '10101121', name: 'Wynyard', lines: ['T1', 'T2', 'T3', 'T4'] },
    { id: '10101122', name: 'Circular Quay', lines: ['T1', 'T2', 'T3', 'T4'] },
    { id: '10101340', name: 'Redfern', lines: ['T2', 'T3', 'T8'] },
    { id: '10101123', name: 'St James', lines: ['T2', 'T3', 'T8'] },
    { id: '10101124', name: 'Museum', lines: ['T2', 'T3', 'T8'] },
    { id: '10101330', name: 'Strathfield', lines: ['T1', 'T2', 'T3'] },
    { id: '10101125', name: 'Martin Place', lines: ['T2', 'T3', 'T8'] },
    { id: '10101320', name: 'Parramatta', lines: ['T1', 'T2', 'T5'] },
];

export function getNearbyStations(lat, lon, maxDistance = 5000) {
    // In a real implementation, this would use geolocation
    // For now, return popular stations
    return SYDNEY_STATIONS;
}

export function getOpalFareInfo() {
    return {
        dailyCap: {
            adult: 17.80,
            child: 8.90,
            concession: 8.90,
        },
        weeklyCap: {
            adult: 50.00,
            child: 25.00,
            concession: 25.00,
        },
        peakFare: {
            min: 4.71,
            max: 9.26,
        },
        offPeakFare: {
            min: 3.30,
            max: 6.48,
        },
    };
}

export async function getServiceAlerts() {
    // This would fetch from TfNSW alerts API
    // For now, return mock data
    return [
        {
            id: '1',
            severity: 'warning',
            title: 'Minor delays on T1 North Shore Line',
            description: 'Trains running approximately 5 minutes late due to earlier signal fault.',
            affectedLines: ['T1'],
        },
    ];
}
