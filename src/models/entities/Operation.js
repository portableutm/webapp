import { getSnapshot, types } from 'mobx-state-tree';
import _ from 'lodash';
import { GeoJsonPoint } from '../types/GeoJsonPoint';
import { BaseOperationVolume, OperationVolume } from './OperationVolume';
import { User } from './User';
import { Vehicle } from './Vehicle';


export const BaseOperation = types
	.model({
		gufi: types.maybeNull(types.string),
		name: types.string,
		owner: types.maybeNull(types.string),
		contact: types.maybeNull(types.string),
		contact_phone: types.maybeNull(types.string),
		aircraft_comments: types.maybeNull(types.string),
		flight_comments: types.maybeNull(types.string),
		volumes_description: types.maybeNull(types.string),
		airspace_authorization: types.maybeNull(types.string),
		controller_location: types.maybeNull(GeoJsonPoint),
		gcs_location:  types.maybeNull(GeoJsonPoint),
		// TODO: This should be the case
		//  faa_rule: types.maybeNull(types.enumeration('FAARule', ['PART_107', 'PART_107X', 'PART_101E', 'OTHER'])),
		faa_rule: types.maybeNull(types.string),
		operation_volumes: types.array(BaseOperationVolume),
		uas_registrations: types.array(types.string),
		// 'uas_registrations': Array<UasRegistration>;
		//'contingency_plans': ContingencyPlan[];
		// 'negotiation_agreements'?: NegotiationAgreement[];
		// 'priority_elements'?: PriorityElements;
	})
	.views(self => ({
		get asBackendFormat() {
			const snapshot = _.cloneDeep(getSnapshot(self));
			snapshot.priority_elements = {
				priority_level: 1,
				priority_status: 'EMERGENCY_AIR_AND_GROUND_IMPACT'
			};
			snapshot.contingency_plans = [
				{
					contingency_cause: ['ENVIRONMENTAL', 'LOST_NAV'],
					contingency_location_description: 'OPERATOR_UPDATED',
					contingency_polygon: {
						type: 'Polygon',
						coordinates: [
							[
								[-56.15438461303711, -34.905501548851106],
								[-56.15138053894043, -34.90873940129964],
								[-56.14889144897461, -34.907437236859494],
								[-56.15112304687499, -34.9059942737644],
								[-56.15438461303711, -34.905501548851106]
							]
						]
					},
					contingency_response: 'LANDING',
					free_text: 'Texto libre DE prueba',
					loiter_altitude: 30,
					relative_preference: 30,
					relevant_operation_volumes: [1, 0],
					valid_time_begin: '2019-12-11T19:59:10Z',
					valid_time_end: '2019-12-11T20:59:10Z'
				}
			];
			snapshot.gufi = snapshot.gufi !== null ? snapshot.gufi : void 0;
			snapshot.negotiation_agreements = [];
			snapshot.submit_time = new Date().toISOString();
			snapshot.operation_volumes = self.operation_volumes.map((opVolume) => {
				const newCoordinates =
					opVolume.operation_geography.coordinates.map(lngLat => [lngLat[1], lngLat[0]]);
				return {
					...opVolume,
					effective_time_begin: opVolume.effective_time_begin.toISOString(),
					effective_time_end: opVolume.effective_time_end.toISOString(),
					operation_geography: {
						...opVolume.operation_geography,
						type: 'Polygon',
						coordinates: [[...newCoordinates, newCoordinates[0]]] // First and last point should be the same
					}
				};
			});
			console.log('POST SNAPSHOT', snapshot);
			return snapshot;
		}
	}));

export const Operation = BaseOperation
	.named('Operation')
	.props({
		gufi: types.identifier,
		owner: types.maybeNull(User),
		creator: types.maybeNull(types.string),
		uss_name: types.maybeNull(types.string),
		discovery_reference: types.maybeNull(types.string),
		submit_time: types.Date,
		update_time: types.Date,
		operation_volumes: types.array(OperationVolume),
		flight_number: types.maybeNull(types.string),
		uas_registrations: types.array(Vehicle),
		state: types.enumeration('OperationState', ['PROPOSED' , 'PENDING', 'ACCEPTED', 'NOT_ACCEPTED', 'ACTIVATED' , 'CLOSED' , 'NONCONFORMING', 'ROGUE']),
	})
	.views(self => ({
		get isOwnerSet() {
			return self.owner !== null;
		}
	}));

/* {
	_type: 'OPERATION',
	name: 'Untitled',
	owner: 'admin',
	contact: '',
	contact_phone: '',
	flight_comments: '',
	volumes_description: 'v0.1',
	flight_number: Date.now(),
	submit_time: new Date().toISOString(), // TODO: Proper format for time 2019-12-11T19:59:10Z
	update_time: new Date().toISOString(),
	operation_volumes: [
		{
			near_structure: false,
			effective_time_begin: new Date(),
			effective_time_end: new Date(),
			min_altitude: 0,
			max_altitude: 120,
			beyond_visual_line_of_sight: false,
			operation_geography: {
				type: 'Polygon',
				coordinates: [[]]
			},
		}
	],
	faa_rule: 0,
	state: 0,
	controller_location: {
		'type': 'Point',
		'coordinates': [
			-56.15970075130463,
			-34.9119507320875
		]
	},
	priority_elements: {
		priority_level: 1,
		priority_status: 'EMERGENCY_AIR_AND_GROUND_IMPACT'
	},
	uas_registrations: [],
	contingency_plans: [
		{
			contingency_cause: ['ENVIRONMENTAL', 'LOST_NAV'],
			contingency_location_description: 'OPERATOR_UPDATED',
			contingency_polygon: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.15438461303711, -34.905501548851106],
						[-56.15138053894043, -34.90873940129964],
						[-56.14889144897461, -34.907437236859494],
						[-56.15112304687499, -34.9059942737644],
						[-56.15438461303711, -34.905501548851106]
					]
				]
			},
			contingency_response: 'LANDING',
			free_text: 'Texto libre DE prueba',
			loiter_altitude: 30,
			relative_preference: 30,
			relevant_operation_volumes: [1, 0],
			valid_time_begin: '2019-12-11T19:59:10Z',
			valid_time_end: '2019-12-11T20:59:10Z'
		}
	],
	negotiation_agreements: []
} */