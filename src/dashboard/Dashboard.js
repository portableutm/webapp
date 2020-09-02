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
	useEffect(() => {
		/* Block user scrolling by using keyboard */
		window.addEventListener('keydown', function (e) {
			// space and arrow keys
			if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);
	});

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