import { flow, getRoot, types } from 'mobx-state-tree';
import Uvr from './entities/Uvr';
import _ from 'lodash';
import { values } from 'mobx';

export const UvrStore = types
	.model('UvrStore', {
		uvrs: types.map(Uvr),
		filterShownIds: types.array(types.string),
		filterMatchingText: '', // Those that match this string are displayed in the layers list (search)
		filterProperty: 'reason'
	})
	.volatile(() => ({ hasFetched: false }))
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
					self.hasFetched = true;
				} catch (error) {
					console.group('/uvrStore fetchUvrs *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			post: flow(function* post(newUvr /* : <BaseUvr> */) {
				try {
					const response =
						yield getRoot(self).axiosInstance.post('uasvolume', newUvr, { headers: { auth: getRoot(self).authStore.token } });
					yield self.fetchUvrs();
					getRoot(self).setFloatingText('UVR saved successfully');
					return response;
				} catch (error) {
					let errorString = error;
					if (error.response && error.response.data && error.response.data.message) errorString = error.response.data.message;
					getRoot(self).setFloatingText(`An error (${errorString}) has ocurred while saving the UAS Volume Reservation.`);
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
				self.filterMatchingText = text;
			},
			setFilterProperty(property) {
				self.filterProperty = property;
			},
			/* Sorting */
			setSortingProperty(prop) {
				self.sortingProperty = prop;
			},
			setSortingOrder(order) {
				self.sortingOrder = order;
			},
			reset() {
				// Cleans volatile state. The model itself is resetted by the RootStore
				self.hasFetched = false;
			}
		};
	})
	.views(self => ({
		get allUvrs() {
			return values(self.uvrs);
		},
		get shownUvrs() {
			return _
				.chain(values(self.uvrs))
				.filter((uvr) =>
					_.includes(self.filterShownIds, uvr.message_id) || /* Show in map only matching IDs */
					uvr.effective_time_end.getTime() > Date.now() /* and not finished */
				)
				.value();
		},
		get uvrsWithVisibility() {
			return _
				.chain(values(self.uvrs))
				.map((uvr) => {
					const uvrWithVisibility = _.cloneDeep(uvr);
					uvrWithVisibility._visibility = _.includes(self.filterShownIds, uvr.message_id);
					uvrWithVisibility._matchesFiltersByNames = _.includes(
						uvr[self.filterProperty].toLowerCase(),
						self.filterMatchingText.toLowerCase()
					);
					return uvrWithVisibility;})
				.orderBy(uvr => {
					if (self.sortingProperty === 'start') return uvr.effective_time_begin.getTime();
					if (self.sortingProperty === 'end') return uvr.effective_time_end.getTime();
					return uvr[self.sortingProperty];
				}, self.sortingOrder)
				.value();
		},
		get counts() {
			const uvrs = values(self.uvrs);
			let uvrCount = 0;
			let matchesFilters = 0;
			_.forEach(uvrs, (uvr) => {
				uvrCount++;
				if (_.includes(
					uvr[self.filterProperty].toLowerCase(),
					self.filterMatchingText.toLowerCase()
				)) matchesFilters++;
			});
			return { uvrCount, matchesFilters };
		}
	}));