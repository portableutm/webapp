import { flow, getRoot, types } from 'mobx-state-tree';
import Uvr from './entities/Uvr';
import _ from 'lodash';
import { values } from 'mobx';

export const UvrStore = types
	.model('UvrStore', {
		uvrs: types.map(Uvr),
		filterShownIds: types.array(types.string),
		filtersMatchingText: '' // Those that match this string are displayed in the layers list (search)
	})
	.actions(self => {
		const cleanUvr = (uvr) => {
			// Switch LngLat to LatLng
			const coordinates = uvr.geography.coordinates.map((coords) =>
				coords.map((pos) => [pos[1], pos[0]])
			);
			// TODO: For creation! coordinates[0].push(coordinates[0][0]); // Last coordinate should be the same than the first
			return { ...uvr,
				min_altitude: parseInt(uvr.min_altitude),
				max_altitude: parseInt(uvr.max_altitude),
				effective_time_begin: new Date(uvr.effective_time_begin),
				effective_time_end: new Date(uvr.effective_time_end),
				geography: { ...uvr.geography, coordinates: [coordinates] }
			};
		};

		return {
			fetchUvrs: flow(function* fetchUvrs() {
				try {
					const response = yield getRoot(self).axiosInstance.get('uasvolume', { headers: { auth: getRoot(self).authStore.token } });
					const uvrs = response.data;
					self.uvrs.replace(
						uvrs.reduce((prior, uvr) => {
							const correctedUvr = cleanUvr(uvr);
							if (correctedUvr.effective_time_end >= new Date()) {
								return [...prior, [correctedUvr.message_id, correctedUvr]];
							} else {
								return [...prior];
							}
						}, [])
					);
					self.filterShownIds = Array.from(self.uvrs.keys()); // After fetching, show by default all UVRs
				} catch (error) {
					console.group('/uvrStore fetchUvrs *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			toggleVisibility(uvr) {
				if (_.includes(self.filterShownIds, uvr.message_id)) {
					self.filterShownIds.remove(uvr.message_id);
				} else {
					self.filterShownIds.push(uvr.message_id);
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
		get shownUvrs() {
			return _.filter(values(self.uvrs), (uvr) => _.includes(self.filterShownIds, uvr.message_id));
		},
		get uvrsWithVisibility() {
			return _.map(values(self.uvrs), (uvr) => {
				const uvrWithVisibility = _.cloneDeep(uvr);
				uvrWithVisibility._visibility = _.includes(self.filterShownIds, uvr.message_id);
				uvrWithVisibility._matchesFiltersByNames = _.includes(
					uvr.reason.toLowerCase(),
					self.filtersMatchingText.toLowerCase());
				return uvrWithVisibility;
			});
		}
	}));