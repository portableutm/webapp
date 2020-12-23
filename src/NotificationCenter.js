import React, { useState, useEffect } from 'react';
import { Elevation, Card, Button, Intent, Icon } from '@blueprintjs/core';
import { animateScroll as scroll } from 'react-scroll';
import { useStore } from 'mobx-store-provider';
import { autorun } from 'mobx';
import useSound from 'use-sound';

import './Ades.css';
import styles from './models/entities/notification.module.css';
import './css/animate.css';
import * as classnames from 'classnames';
import emptySfx from './sounds/empty.mp3';
import { observer } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

function NotificationCenter() {
	const { notStore } = useStore('RootStore', (store) => ({ notStore: store.notificationStore }));
	const [scrolled, setScrolled] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);
	const [enlarged, setEnlarged] = useState(-1);
	const [sound, setSound] = useState(emptySfx);
	const [play, { stop }] = useSound(sound, { loop: true, interrupt: true });

	useEffect(() => {
		if (sound !== null) {
			play();
		} else {
			stop();
		}
	}, [sound, play, stop]);

	useEffect(() => {
		scroll.scrollTo(scrolled, { smooth: true, containerId: 'notifications', ignoreCancelEvents: true });
	}, [scrolled]);

	useEffect(() => {
		setScrolled(document.getElementById('notifications').scrollHeight - window.innerHeight);
		setMaxScroll(document.getElementById('notifications').scrollHeight - window.innerHeight);
	}, [notStore.amount]);


	useEffect(() => {
		const dispose = autorun(() => {
			setSound(notStore.firstSound);
		});
		return () => {
			dispose();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			{   notStore.isNotEmpty &&
			<div className={styles.scrollControl}>
				<Button icon="arrow-up" intent={Intent.PRIMARY}
					disabled={scrolled <= 0}
					style={{ marginRight: '5px', backgroundColor: 'rgb(57, 64, 83)' }}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr - (window.innerHeight/2);
							return calc < 0 ? 0 : calc;
						});
					}}/>
				<Button icon="arrow-down" intent={Intent.PRIMARY}
					disabled={scrolled >= maxScroll}
					style={{ backgroundColor: 'rgb(57, 64, 83)' }}
					onClick={() => {
						setScrolled(curr => {
							const calc = curr + (window.innerHeight/2);
							return calc > maxScroll ? maxScroll : calc;
						});
					}}/>
			</div>
			}
			{ 	notStore.list.map((notification) => {
				return (
					<React.Fragment key={notification.id}>
						<Card
							className={notification.stylingString}
							interactive={true}
							onClick={() => {
								if (enlarged === notification.id) {
									notification.collapse();
									setEnlarged(-1);
								} else {
									if (enlarged > -1) {
										/* There's a notification currently selected */
										notStore.collapseNotification(enlarged);
									}
									notification.enlarge();
									setEnlarged(notification.id);
								}
							}}
							elevation={Elevation.TWO}
						>
							<div className={styles.notificationHeader}>
								<p>{notification.header}</p>
								<p style={{ fontSize: '12px' }}>{notification.time_sent.toLocaleTimeString()}</p>
							</div>
							<ReactMarkdown
								source={notification.body}
							/>
							<div

								className={
									classnames(
										styles.actions,
										{ [styles.actionsVisible]: notification.isEnlarged })
								}
								onClick={
									/* This prevents the execution of the onClick of the card - i.e. the selecting/deselecting */
									(evt) =>
										evt.stopPropagation()
								}
							>
								<div
									className={styles.notificationButtonTop}
									data-test-id="acknowledgeNotification"
									onClick={() => {
										notification.toggleAck();
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
									data-test-id="deleteNotification"
									className={styles.notificationButtonBottom}
									onClick={() => {
										setEnlarged(-1);
										notStore.remove(notification.id);
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

export default observer(NotificationCenter);
