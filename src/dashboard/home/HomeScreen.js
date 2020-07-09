import React from 'react';
import styles from './home.module.css';
import useAdesState from '../../state/AdesState';
import S from 'sanctuary';
import {maybeValues} from '../../libs/SaferSanctuary';

const SimpleValue = ({title, value, color}) => {
	return (
		<div className={styles.simpleValue} style={{backgroundColor: color}}>
			<p className={styles.simpleValueText}>{title}</p>
			<p className={styles.simpleValueValue}>{value}</p>
		</div>
	);
};

const HomeScreen = () => {
	const [state, ] = useAdesState();
	const operations = S.values(state.operations.list);
	const operationCount = operations.length;
	const activeCount = (S.filter ((op) => op.state === 'ACTIVE') (operations)).length;
	const acceptedCount = (S.filter ((op) => op.state === 'ACCEPTED') (operations)).length;
	const pendingCount = (S.filter ((op) => op.state === 'PENDING') (operations)).length;
	const dronesCount = maybeValues(state.drones.list).length;

	console.log('Ops', operations);

	return (
		<>
			<div className={styles.homeScreen}>
				<SimpleValue
					title="Total of operations"
					value={operationCount}
				/>
				<SimpleValue
					title="Active operations"
					value={activeCount}
					color="chocolate"
				/>
				<SimpleValue
					title="Accepted operations"
					value={acceptedCount}
					color="rgb(0,100,0)"
				/>
				<SimpleValue
					title="Pending operations"
					value={pendingCount}
					color="orangered"
				/>
				<SimpleValue
					title="Drones in the air"
					value={dronesCount}
					color="darkmagenta"
				/>
				{/*
				<div className="div-ops-by-month">
					Operations Evolution in the Last 12 Months
					<OpsEvolutionChart
						categories={['May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr']}
						data={[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 6]}
						type="area"
					/>
				</div>
				<div className="div-users">
                    Active Users Last 30 days
					<UserRow
						name="Juan José Cetraro"
						username="jjcetraro"
						quantity="8"
					/>
					<UserRow
						name="Emiliano Alonzo"
						username="emialonzo"
						quantity="6"
					/>
					<UserRow
						name="Matt Betancurt"
						username="mbentancurt"
						quantity="4"
					/>
					<UserRow
						name="Sebastián Macías"
						username="smacias89"
						quantity="4"
					/>
				</div>
				<div className="div-drones">
                    Drones By Manufacturer
					<DronesChart/>
				</div>
				<div className="div-ops-last-week">
                    Operations Last Week
					<OpsEvolutionChart
						categories={['Jue', 'Vie', 'Sab', 'Dom', 'Lun', 'Mar', 'Mie']}
						data={[0, 0, 0, 0, 1, 0, 3]}
						type="bar"
					/>
				</div>
				*/ }
			</div>
		</>
	);
};
 
export default HomeScreen;