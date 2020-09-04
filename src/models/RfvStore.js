import { flow, getRoot, types } from 'mobx-state-tree';
import Rfv from './entities/Rfv';
import _ from 'lodash';
import { values } from 'mobx';

export const RfvStore = types
	.model('RfvStore', {
		rfvs: types.map(Rfv),
		filterShownIds: types.array(types.string),
		filtersMatchingText: '' // Those that match this string are displayed in the layers list (search)
	})
	.actions(self => {
		const cleanRfv = (rfv) => {
			// Switch LngLat to LatLng
			const coordinates = rfv.geography.coordinates.map((coords) =>
				coords.map((pos) => [pos[1], pos[0]])
			);
			// TODO: For creation! coordinates[0].push(coordinates[0][0]); // Last coordinate should be the same than the first
			return { ...rfv,
				min_altitude: parseInt(rfv.min_altitude),
				max_altitude: parseInt(rfv.max_altitude),
				geography: { ...rfv.geography, coordinates: [coordinates] }
			};
		};

		return {
			fetchRfvs: flow(function* fetchUvrs() {
				try {
					const response = yield getRoot(self).axiosInstance.get('restrictedflightvolume', { headers: { auth: getRoot(self).authStore.token } });
					const rfvs = response.data;
					self.rfvs.replace(
						rfvs.reduce((prior, rfv) => {
							const correctedRfv = cleanRfv(rfv);
							return [...prior, [correctedRfv.id, correctedRfv]];
						}, [])
					);
					self.filterShownIds = Array.from(self.rfvs.keys()); // After fetching, show by default all RFVs
				} catch (error) {
					console.group('/rfvStore fetchRfvs *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			toggleVisibility(rfv) {
				if (_.includes(self.filterShownIds, rfv.id)) {
					self.filterShownIds.remove(rfv.id);
				} else {
					self.filterShownIds.push(rfv.id);
				}
			},
			setFilterByText(text) {
				self.filtersMatchingText = text;
			},
			reset() {
				// Cleans volatile state. The model itself is resetted by the RootStore
			}
		};
	})
	.views(self => ({
		get shownRfvs() {
			return _.filter(values(self.rfvs), (rfv) => _.includes(self.filterShownIds, rfv.id));
		},
		get rfvsWithVisibility() {
			return _.map(values(self.rfvs), (rfv) => {
				const rfvWithVisibility = _.cloneDeep(rfv);
				rfvWithVisibility._visibility = _.includes(self.filterShownIds, rfv.id);
				rfvWithVisibility._matchesFiltersByNames = _.includes(
					rfv.comments.toLowerCase(),
					self.filtersMatchingText.toLowerCase());
				return rfvWithVisibility;
			});
		}
	}));