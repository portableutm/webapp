import React from 'react';
import {observer} from 'mobx-react';

import OperationPolygon from './OperationPolygon';
import {useStore} from 'mobx-store-provider';

const OperationPolygons = ({operation}) => (
	operation.operation_volumes.map((volume) => {
		return <OperationPolygon
			key={operation.gufi + '#' + volume.id}
			id={operation.gufi + '#' + volume.id}
			isSelected={false}
			latlngs={volume.operation_geography.coordinates[0]}
			state={operation.state}
			info={operation}
			onClick={() => {}}
		/>;
	})
);

export const AllOperationsPolygons = observer(() => {
	const { operationStore } = useStore(
		'RootStore',
		(store) => ({operationStore: store.operationStore})
	);

	return operationStore.shownOperations.map((operation) =>
		<OperationPolygons key={operation.gufi} operation={operation} />
	);
});