import React, {useEffect} from 'react';
import '../Ades.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Content from './Content';
import useAdesState from '../state/AdesState';
import S from 'sanctuary';
import * as classnames from 'classnames';
import styles from './Dashboard.module.css';

function Dashboard({children}) {
	const [state, ] = useAdesState();
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
					{ [styles.dashboardNotifs]: S.values(state.notifications.list).length > 0 },
					{ [styles.dashboardNoNotifs]: S.values(state.notifications.list).length === 0 },
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

export default Dashboard;