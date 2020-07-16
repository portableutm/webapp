import React, {useState, useEffect} from 'react';
import {Elevation, Card, Button, Intent, Icon} from '@blueprintjs/core';
import {animateScroll as scroll} from 'react-scroll';
import useAdesState from './state/AdesState';

import S from 'sanctuary';
import './Ades.css';
import styles from './entities/Notification/notification.module.css';
import './css/animate.css';
import {fM} from './libs/SaferSanctuary';
import useSound from 'use-sound';
import * as classnames from 'classnames';

function NotificationCenter() {
	const [state, actions] = useAdesState(state => state.notifications, actions => actions.notifications);
	const notifications = S.values(state.list);
	const [scrolled, setScrolled] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);
	const [enlarged, setEnlarged] = useState(-1);
	const [sound, setSound] = useState('');
	const [play, {stop}] = useSound(sound, { loop: true, interrupt: true });

	useEffect(() => {
		if (sound !== '') {
			play();
		} else {
			stop();
		}
	}, [sound, play, stop]);

	useEffect(() => {
		scroll.scrollTo(scrolled, {smooth: true, containerId: 'notifications', ignoreCancelEvents: true});
	}, [scrolled]);

	useEffect(() => {
		setScrolled(document.getElementById('notifications').scrollHeight - window.innerHeight);
		setMaxScroll(document.getElementById('notifications').scrollHeight - window.innerHeight);
	}, [notifications.length]);

	useEffect(() => {
		let hasAnySound = false;
		notifications.forEach(notification => {
			if (S.isJust(notification.sound)) {
				hasAnySound = true;
				setSound(fM(notification.sound));
			}
		});
		if (!hasAnySound) setSound('');
	}, [state.updated]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			{   notifications.length > 0 &&
			<div className={styles.scrollControl}>
				<Button icon="arrow-up" intent={Intent.PRIMARY}
					disabled={scrolled <= 0}
					style={{marginRight: '5px', backgroundColor: 'rgb(57, 64, 83)'}}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr - (window.innerHeight/2);
							return calc < 0 ? 0 : calc;
						});
					}}/>
				<Button icon="arrow-down" intent={Intent.PRIMARY}
					disabled={scrolled >= maxScroll}
					style={{backgroundColor: 'rgb(57, 64, 83)'}}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr + (window.innerHeight/2);
							return calc > maxScroll ? maxScroll : calc;
						});
					}}/>
			</div>
			}
			{notifications.map((notification, index) => {
				/*let styling = notification.recent ?
					'notificationCard-' + notification.severity + ' animated fadeIn slower' :
					'notificationCard-' + notification.severity;
				styling = index === enlarged ? 'notificationCard-' + notification.severity + ' animated fast pulse infinite' : styling; // Effect for selected
				styling = notification.focus ? styling + ' notificationFocused' : styling; // Show over overlay for focused notification
				 */

				return (
					<React.Fragment key={notification.id}>
						<Card
							className={notification.getStylingString()}
							interactive={true}
							onClick={() => {
								if (enlarged === index) {
									notification.isEnlarged = false;
									setEnlarged(-1);
								} else {
									if (enlarged > -1) {
										/* There's a notification currently selected */
										notifications[enlarged].isEnlarged = false;
										actions.update(notifications[enlarged]);
									}
									notification.isEnlarged = true;
									setEnlarged(index);
								}
								actions.update(notification);
							}}
							elevation={Elevation.TWO}
						>
							<div className={styles.notificationHeader}>
								<p>{notification.header}</p>
								<p style={{fontSize: '12px'}}>{(new Date(parseInt(notification.id))).toLocaleTimeString()}</p>
							</div>
							{notification.body}
							<div
								className={
									classnames(
										styles.actions,
										{[styles.actionsVisible]: notification.isEnlarged})
								}
								onClick={
									/* This prevents the execution of the onClick of the card - i.e. the selecting/deselecting */
									(evt) =>
										evt.stopPropagation()
								}
							>
								<div
									className={styles.notificationButtonTop}
									onClick={() => {
										notification.isAcknowledged = !notification.isAcknowledged;
										actions.update(notification);
									}}
								>
									{!notification.isAcknowledged &&
									<Icon
										icon="tick"
										iconSize={40}
									/>
									}
									{notification.isAcknowledged &&
									<Icon
										icon="cross"
										iconSize={40}
									/>
									}
								</div>
								<div
									className={styles.notificationButtonBottom}
									onClick={() => {
										setEnlarged(-1);

										actions.remove(notification.id);
									}}
								>
									<Icon
										icon="trash"
										iconSize={40}
									/>
								</div>
							</div>
						</Card>
						{notification.isFocused &&
						<div className='blackFull animated fadeIn fast'>

						</div>
						}
					</React.Fragment>
				);
			})}
		</>
	);
}

export default NotificationCenter;
