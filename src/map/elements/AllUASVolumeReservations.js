import React from 'react';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';
import UASVolumeReservation from './UASVolumeReservation';

export const AllUASVolumeReservations = observer(() => {
	const { uvrStore } = useStore(
		'RootStore',
		(store) => ({ uvrStore: store.uvrStore })
	);
	return uvrStore.shownUvrs.map((uvr) => {
		return (
			<UASVolumeReservation
				key={uvr.message_id}
				latlngs={uvr.geography.coordinates}
				uvrInfo={uvr}
			/>
		);
	});
});