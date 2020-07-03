import React, {useState, useEffect} from 'react';
import {Elevation, Card, Button, Intent} from '@blueprintjs/core';
import {animateScroll as scroll} from 'react-scroll';
import useAdesState from './state/AdesState';

import S from 'sanctuary';
import './Ades.css';
import styles from './css/notification.module.css';
import './css/animate.css';
import {fM, maybeValues} from './libs/SaferSanctuary';
import useSound from 'use-sound';

const Sound = ({sound}) => {
	console.log(`Sound: ${sound}`);
	const [play, {isPlaying, stop}] = useSound(sound, {interrupt: true});
	const [repeats, setRepeats] = useState(0);

	useEffect(() => {
		play();
		if (isPlaying) {
			setRepeats(repeats => repeats + 1);
		}
		if (repeats === 4) {
			stop();
		}
	}, [play, isPlaying]);

	return null;
};

function NotificationCenter() {
	const [state, ] = useAdesState(state => state.notifications);
	const notificationsArray = maybeValues(state.list);
	const [enlarged, setEnlarged] = useState(-1);
	const [scrolled, setScrolled] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);

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
			<div className={styles.scrollControl}>
				<Button icon="arrow-up" intent={Intent.PRIMARY}
					disabled={scrolled <= 0}
					style={{marginRight: '5px', backgroundColor: 'rgba(57, 64, 83, 1)'}}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr - (window.innerHeight/2);
							return calc < 0 ? 0 : calc;
						});
					}}/>
				<Button icon="arrow-down" intent={Intent.PRIMARY}
					disabled={scrolled >= maxScroll}
					style={{backgroundColor: 'rgba(57, 64, 83, 1)'}}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr + (window.innerHeight/2);
							return calc > maxScroll ? maxScroll : calc;
						});
					}}/>
			</div>
			}
			{notificationsArray.map((notification, index) => {
				/*let styling = notification.recent ?
					'notificationCard-' + notification.severity + ' animated fadeIn slower' :
					'notificationCard-' + notification.severity;
				styling = index === enlarged ? 'notificationCard-' + notification.severity + ' animated fast pulse infinite' : styling; // Effect for selected
				styling = notification.focus ? styling + ' notificationFocused' : styling; // Show over overlay for focused notification
				 */

				return (
					<>
						{	S.isJust(notification.sound) &&
							<Sound sound={fM(notification.sound)} />
						}
						<Card
							className={notification.getStylingString()}
							key={notification.id}
							interactive={true}
							onClick={() => {
								if (index === enlarged) {
									/* It's enlarged - unelarge */
									notification.isEnlarged = false;
									setEnlarged( -1 );
								} else {
									notification.isEnlarged = true;
									setEnlarged( index );
								}
							}}
							elevation={Elevation.TWO}
						>
							<div className={styles.notificationHeader}>
								<p>{notification.header}</p>
							</div>
							{notification.body}
							{notification.isEnlarged &&
							<div className={styles.actions}>
								<Button small={true} intent={Intent.PRIMARY}>REPLY</Button>
								<Button small={true} intent={Intent.DANGER}
								>DELETE</Button>
							</div>
							}
						</Card>
						{notification.isFocused &&
						<div className='blackFull animated fadeIn fast'>

						</div>
						}
					</>
				);
			})}
		</>
	);
}

export default NotificationCenter;
