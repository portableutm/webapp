import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'mobx-store-provider';
import OperationPolygon from './OperationPolygon';

const OperationPolygons = ({ operation }) => (
	operation.operation_volumes.map((volume) => {
		return <OperationPolygon
			key={operation.gufi + '#' + volume.id}
			id={operation.gufi + '#' + volume.id}
			isSelected={false}
			gufi={operation.gufi}
			name={operation.name}
			latlngs={volume.operation_geography.coordinates[0]}
			state={operation.state}
		/>;
	})
);

export const AllOperationsPolygons = observer(() => {
	const { operationStore } = useStore(
		'RootStore',
		(store) => ({ operationStore: store.operationStore })
	);

	return operationStore.shownOperations.map((operation) =>
		<OperationPolygons key={operation.gufi} operation={operation} />
	);
});