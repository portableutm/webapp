import React, {useEffect} from 'react';
import '../Ades.css';
import {useLocation} from 'react-router-dom';
import {animateScroll as scroll} from 'react-scroll';


function MainArea({children}) {
	const location = useLocation();
	const firstPath = location.pathname.split('/')[1];
	const secondPath = location.pathname.split('/')[2];
	useEffect(() => {
		// Dashboard works differently than the sites embedded within the map view
		// Here we scroll down if we should render the dashboard
		if (firstPath === 'dashboard') {
			const duration =
                secondPath != null ? 0 : 1000;
			// Transition effect when in /dashboard, not to be repeated when browsing away
			scroll.scrollToBottom({containerId: 'main', ignoreCancelEvents: true, duration: duration});
		} else {
			scroll.scrollToTop({containerId: 'main', ignoreCancelEvents: true});
		}
	}, [location]); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<div id='main' className='mainArea'>
			{React.Children.only(children)}
		</div>
	);
}
export default MainArea;