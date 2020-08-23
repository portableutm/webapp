import React from 'react';

import {observer} from 'mobx-react';

import RestrictedFlightVolume from './RestrictedFlightVolume';
import {useStore} from 'mobx-store-provider';


export const AllRestrictedFlightVolumes = observer(() => {
	const { rfvStore } = useStore(
		'RootStore',
		(store) => ({rfvStore: store.rfvStore})
	);
	return rfvStore.shownRfvs.map((rfv) => (
		<RestrictedFlightVolume
			key={rfv.comments}
			latlngs={rfv.geography.coordinates}
			name={rfv.comments}
			minAltitude={rfv.min_altitude}
			maxAltitude={rfv.max_altitude}
		/>
	));
});