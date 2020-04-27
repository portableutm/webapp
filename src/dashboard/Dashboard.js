import React, {useEffect} from 'react';
import '../Ades.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Content from './Content';

function Dashboard({children}) {
	const darkModeEnabledString = true ? ' bp3-dark' : '';
	//const notifications = useNotificationStore();
	//const notificationCenterOpenString =
	//	notifications.state.all.size > 0 ?
	//		' dashboardNotifs' : ' dashboardNoNotifs';
	const notificationCenterOpenString = ' dashboardNoNotifs';
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
		<div className={'dashboard' + darkModeEnabledString + notificationCenterOpenString}>
			<Header/>
			<SideMenu/>
			<Content>
				{children}
			</Content>
		</div>
	);
}

export default Dashboard;