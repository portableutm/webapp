import React, { useEffect } from 'react';
import '../Ades.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Content from './Content';
import * as classnames from 'classnames';
import styles from './Dashboard.module.css';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';

function Dashboard({ children }) {
	const { notificationStore } = useStore('RootStore', (store) => ({ notificationStore: store.notificationStore }));

	return (
		<div className={styles.background}>
			<div className={
				classnames(
					styles.dashboard,
					'bp3-dark',
					{ [styles.dashboardNotifs]: notificationStore.isNotEmpty },
					{ [styles.dashboardNoNotifs]: !notificationStore.isNotEmpty },
				)}>
				<Header/>
				<SideMenu/>
				<Content>
					{children}
				</Content>
			</div>
		</div>
	);
}

export default observer(Dashboard);