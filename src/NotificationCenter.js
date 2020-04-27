/*
import React, {useState, useEffect} from 'react';
import {Elevation, Card, Button, Icon, Intent} from '@blueprintjs/core';
import S from 'sanctuary';
import {Element, animateScroll as scroll} from 'react-scroll';
/!**
* Stores
*!/
//import {useNotificationStore} from './providers/NotificationProvider';
/!**
* Style
*!/
import './Ades.css';
import './css/animate.css';

function NotificationCenter() {
	const {state, dispatch} = useNotificationStore();
	const notificationsArray = Array.from(state.all.values());
	const [enlarged, setEnlarged] = useState(-1);
	const [scrolled, setScrolled] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);
	const deleteNotification = (index, id) => {
		dispatch(S.Just({
			type: 'REMOVE',
			value: id
		}));
		setEnlarged(-1);
	};

	useEffect(() => {
		scroll.scrollTo(scrolled, {smooth: true, containerId: 'notifications', ignoreCancelEvents: true});
	}, [scrolled]);

	useEffect(() => {
		setScrolled(document.getElementById('notifications').scrollHeight - window.innerHeight);
		setMaxScroll(document.getElementById('notifications').scrollHeight - window.innerHeight);
	}, [notificationsArray.length]);

	return (
		<>
			{   notificationsArray.length > 0 &&
			<div className="notificationsScrollControl">
				<Button icon="arrow-up" text="Older notifications" intent={Intent.PRIMARY}
					disabled={scrolled <= 0}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr - (window.innerHeight/2);
							return calc < 0 ? 0 : calc;
						});
					}}/>
				<Button icon="arrow-down" text="Newer notifications" intent={Intent.PRIMARY}
					disabled={scrolled >= maxScroll}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr + (window.innerHeight/2);
							return calc > maxScroll ? maxScroll : calc;
						});
					}}/>
				{/!*scrolled*!/}
			</div>
			}
			{notificationsArray.map((notice, index) => {
				let styling = notice.recent ?
					'notificationCard-' + notice.severity + ' animated fadeIn slower' :
					'notificationCard-' + notice.severity;
				styling = index === enlarged ? 'notificationCard-' + notice.severity + ' animated fast pulse infinite' : styling; // Effect for selected
				return (
					<>
						{/!*index + " >> " + enlarged*!/}
						<Card
							className={styling}
							key={notice.message_id}
							interactive={true}
							onClick={() => setEnlarged(index === enlarged ? -1 : index)}
							elevation={Elevation.TWO}
						>
							<div className="notificationHeader">
								<p>{notice.severity}</p>
								<p>{notice.time_sent}</p>
							</div>
							{notice.free_text}
							{index === enlarged &&
							<div className="notificationActions">
								<Button small={true} intent={Intent.PRIMARY}>REPLY</Button>
								<Button small={true} intent={Intent.DANGER}
									onClick={() => deleteNotification(index, notice.message_id)}>DELETE</Button>
							</div>
							}
						</Card>
					</>
				);
			})}
		</>
	);
}

export default NotificationCenter;*/
