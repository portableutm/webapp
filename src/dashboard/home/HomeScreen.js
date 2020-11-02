import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'mobx-store-provider';
import styles from './home.module.css';
import genericListStyle from '../generic/GenericList.module.css';
import { observer } from 'mobx-react';
import * as classnames from 'classnames';

const SimpleValue = ({ title, value, color, addtlClass = null }) => {
	return (
		<div
			className={classnames(styles.simpleValue, { [addtlClass]: addtlClass !== null })}
			style={{ backgroundColor: color }}
		>
			<p className={styles.simpleValueText}>{title}</p>
			<p className={styles.simpleValueValue}>{value}</p>
		</div>
	);
};

const HomeScreen = () => {
	const { opStore, vehStore } = useStore('RootStore', (store) => ({
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
			<div className={styles.homeScreen}>
				<SimpleValue
					title={t('home.total')}
					value={opStore.counts.operationCount}
				/>
				<SimpleValue
					title={t('home.rogue')}
					value={opStore.counts.rogueCount}
					color="darkred"
					addtlClass={opStore.counts.rogueCount > 0 ? styles.rogueValueWarning : styles.rogueValueInactive}
				/>
				<SimpleValue
					title={t('home.active')}
					value={opStore.counts.activeCount}
					color="chocolate"
				/>
				<SimpleValue
					title={t('home.accepted')}
					value={opStore.counts.acceptedCount}
					color="rgb(0,100,0)"
				/>
				<SimpleValue
					title={t('home.pending')}
					value={opStore.counts.pendingCount}
					color="orangered"
				/>
				<SimpleValue
					title={t('home.vehicles')}
					value={vehStore.counts.vehicleCount}
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
 
export default observer(HomeScreen);