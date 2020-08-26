import { flow, getRoot, types } from 'mobx-state-tree';
import { values } from 'mobx';
import { QuickFly } from './entities/QuickFly';
import _ from 'lodash';

export const QuickFlyStore = types
	.model('QuickFlyStore', {
		quickflies: types.map(QuickFly)
	})
	.volatile(() => ({
		hasFetched: false
	}))
	.actions(self => {
		function cleanQf(qf) {
			const newQf = _.cloneDeep(qf);
			const cornerNWswap = { ...qf.cornerNW, coordinates: [qf.cornerNW.coordinates[1], qf.cornerNW.coordinates[0]]  };
			const cornerSEswap = { ...qf.cornerSE, coordinates: [qf.cornerSE.coordinates[1], qf.cornerSE.coordinates[0]]  };
			newQf.cornerNW = cornerNWswap;
			newQf.cornerSE = cornerSEswap;
			return newQf;
		}
		return {
			fetch: flow(function* fetch() {
				try {
					const response = yield getRoot(self).axiosInstance.get('quickfly', { headers: { auth: getRoot(self).authStore.token } });
					self.hasFetched = true;
					const quickflies = response.data;
					self.quickflies.replace(
						quickflies.reduce((prior, qf) => {
							const correctedQf = cleanQf(qf);
							return [...prior, [correctedQf.id, correctedQf]];
						}, [])
					);
				} catch (error) {
					console.group('/rootStore fetchQuickflies *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			post: flow(function* post(quickFly) {
				try {
					const response =
						yield getRoot(self).axiosInstance.post('quickfly', quickFly.asBackendFormat, { headers: { auth: getRoot(self).authStore.token } });
					yield self.fetch();
					getRoot(self).setFloatingText('QuickFly saved successfully');
					return response;
				} catch (error) {
					getRoot(self).setFloatingText('Error while saving QuickFly: ' + error);
				}
			}),
			remove: flow(function* remove(id) {
				// TODO: Change backend for the remove to actually remove from the database instead of just modifying it...
				try {
					const response =
						yield getRoot(self).axiosInstance.delete(`quickfly/${id}`, { headers: { auth: getRoot(self).authStore.token } });
					yield self.fetch();
					getRoot(self).setFloatingText('QuickFly removed successfully');
					return response;
				} catch (error) {
					getRoot(self).setFloatingText('Error while removing QuickFly: ' + error);
				}
			}),
			reset() {
				self.hasFetched = false;
			}
		};
	})
	.views(self => {
		return {
			get allQuickflies() {
				return values(self.quickflies);
			}
		};
	});