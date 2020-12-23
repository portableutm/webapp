import { types } from 'mobx-state-tree';
import styles from './notification.module.css';
import * as classnames from 'classnames';

export const Notification = types
	.model('BaseNotification', {
		id: types.identifier,
		type: types.optional(types.enumeration(
			'NotificationType',
			['INFORMATION', 'UTMMESSAGE', 'GONE_ROGUE']), 'INFORMATION'),
		header: types.string,
		body: '',
		// for UTMMessages
		severity: types.maybeNull(types.enumeration(
			'UtmMessageSeverity',
			['EMERGENCY', 'ALERT', 'CRITICAL', 'WARNING', 'NOTICE', 'INFORMATIONAL'])),
		time_sent: types.maybeNull(types.Date),
		// for displaying
		isFocused: false,
		isEnlarged: false,
		isAcknowledged: false
	})
	.volatile(() => ({
		soundInternal: null
	}))
	.views(self => ({
		get sound() {
			if (!self.isAcknowledged) {
				return self.soundInternal;
			} else {
				// Acknowledged notifications produce no sound
				return null;
			}
		},
		get stylingString() {
			if (self.type === 'UTMMESSAGE') {
				const severityStyle = 'utmmessage' + self.severity;
				const notificationStyle = styles.notificationFocused;
				return classnames(
					styles.notificationGeneric,
					styles[severityStyle],
					{
						[styles.notificationSelected]: self.isEnlarged,
						[notificationStyle]: self.isFocused
					},
					{ [styles.notificationHidden]: self.isAcknowledged }
				);
			} else if (self.type === 'INFORMATION') {
				return classnames(
					styles.notificationGeneric,
					'animated fadeInRight',
					{ [styles.notificationSelected]: self.isEnlarged },
					styles.utmmessageINFORMATIONAL,
					{ [styles.notificationHidden]: self.isAcknowledged }
				);
			} else if (self.type === 'GONE_ROGUE') {
				return classnames(
					styles.notificationGeneric,
					styles.utmmessageEMERGENCY,
					{ [styles.notificationSelected]: self.isEnlarged },
					{ [styles.notificationHidden]: self.isAcknowledged });
			} else {
				// Unknown
				return '';
			}
		}
	}))
	.actions(self => ({
		setSound(sound) {
			self.soundInternal = sound;
		},
		enlarge() {
			self.isEnlarged = true;
		},
		collapse() {
			self.isEnlarged = false;
		},
		toggleAck() {
			self.isAcknowledged = !self.isAcknowledged;
		}
	}));