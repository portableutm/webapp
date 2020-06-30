import React, {useEffect} from 'react';
import '../Ades.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Content from './Content';
import useAdesState from '../state/AdesState';
import S from 'sanctuary';

function Dashboard({children}) {
	const [state, ] = useAdesState();
	const notificationCenterOpenString =
		S.isJust(state.notifications.list) ?
			' dashboardNotifs' : ' dashboardNoNotifs';
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
		<div className={'dashboard bp3-dark' + notificationCenterOpenString}>
			<Header/>
			<SideMenu/>
			<Content>
				{children}
			</Content>
		</div>
	);
}

export default Dashboard;