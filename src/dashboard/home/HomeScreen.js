import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'mobx-store-provider';
import styles from './home.module.css';
import { useHistory } from 'react-router-dom';
import genericListStyle from '../generic/GenericList.module.css';
import { observer } from 'mobx-react';
import * as classnames from 'classnames';

const SimpleValue = ({ title, onClick, value, color, addtlClass = null }) => {
	return (
		<div
			className={classnames(styles.simpleValue, { [addtlClass]: addtlClass !== null })}
			style={{ backgroundColor: color }}
			onClick={onClick}
		>
			<p className={styles.simpleValueText}>{title}</p>
			<p className={styles.simpleValueValue}>{value}</p>
		</div>
	);
};

const HomeScreen = () => {
	const history = useHistory();
	const { opStore } = useStore('RootStore', (store) => ({
		opStore: store.operationStore,
		vehStore: store.vehicleStore
	}));
	const { t } = useTranslation('dashboard');

	return (
		<>
			<div className={genericListStyle.header}>
				<h1>
					{t('home.title').toUpperCase()}
				</h1>
			</div>
			<p className={styles.textDescription}>
				{t('home.click_over_any_item_to')}
			</p>
			<div className={styles.homeScreen}>
				<SimpleValue
					title={t('home.pending')}
					value={opStore.counts.pendingCount}
					color={'#ecbf08'}
					onClick={() => {
						opStore.setFilterPending(true);
						opStore.setFilterAccepted(false);
						opStore.setFilterActivated(false);
						opStore.setFilterRogue(false);
						opStore.setFilterClosed(false);
						history.push('/dashboard/operations');
					}}
				/>
				{/*<SimpleValue
					title={t('home.total')}
					value={opStore.counts.operationCount}
				/> */}
				<SimpleValue
					title={t('home.rogue')}
					value={opStore.counts.rogueCount}
					color={'#b31e1e'}
					addtlClass={opStore.counts.rogueCount > 0 ? styles.rogueValueWarning : styles.rogueValueInactive}
					onClick={() => {
						opStore.setFilterPending(false);
						opStore.setFilterAccepted(false);
						opStore.setFilterActivated(false);
						opStore.setFilterRogue(true);
						opStore.setFilterClosed(false);
						history.push('/dashboard/operations');
					}}
				/>
				<SimpleValue
					title={t('home.active')}
					value={opStore.counts.activeCount}
					onClick={() => {
						opStore.setFilterPending(false);
						opStore.setFilterAccepted(false);
						opStore.setFilterActivated(true);
						opStore.setFilterRogue(false);
						opStore.setFilterClosed(false);
						history.push('/dashboard/operations');
					}}
					color="rgb(0,100,0)"
				/>
				{/* <SimpleValue
					title={t('home.accepted')}
					value={opStore.counts.acceptedCount}
				/>
				<SimpleValue
					title={t('home.vehicles')}
					value={vehStore.counts.vehicleCount}
				/> */}
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
 
export default observer(HomeScreen);