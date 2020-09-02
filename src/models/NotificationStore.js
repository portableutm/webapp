import { types } from 'mobx-state-tree';
import _ from 'lodash';
import { values } from 'mobx';
import i18n from 'i18next';
import { Notification } from './entities/Notification';
import rogueSfx from '../sounds/ROGUE.mp3';

export const NotificationStore = types
	.model('NotificationStore', {
		notifications: types.map(Notification)
	})
	.actions(self => ({
		addUTMMessage(json) {
			const newNotification = Notification.create({
				id: json.message_id,
				severity: json.severity,
				time_sent: new Date(json.time_sent),
				header: i18n.t('notifications.utmmessage.header', { severity: json.severity, time_sent: json.time_sent }),
				body: json.free_text,
				type: 'UTMMESSAGE'
			});
			self.notifications.set(newNotification.id, newNotification);
		},
		addInformation(json) {
			const newInformation = Notification.create({
				id: '' + Date.now(),
				header: json.header,
				body: json.body,
				time_sent: new Date(),
				type: 'INFORMATION'
			});
			self.notifications.set(newInformation.id, newInformation);
		},
		addOperationGoneRogue(nameOrId) {
			const newOperationGoneRogue = Notification.create({
				id: nameOrId,
				header: i18n.t('notifications.operation_gone_rogue.header'),
				body: i18n.t('notifications.operation_gone_rogue.body', { operation: nameOrId }),
				time_sent: new Date(),
				type: 'GONE_ROGUE'
			});
			newOperationGoneRogue.setSound(rogueSfx);
			self.notifications.set(newOperationGoneRogue.id, newOperationGoneRogue);
		},
		remove(id) {
			self.notifications.delete(id);
		},
		/* Acting on one notification */
		collapseNotification(id) {
			self.notifications.get(id).collapse();
		}
	}))
	.views(self => ({
		get isNotEmpty() {
			return self.notifications.size > 0;
		},
		get amount() {
			return self.notifications.size;
		},
		get list() {
			return values(self.notifications);
		},
		get firstSound() {
			const firstElementWithSound = _.find(values(self.notifications), (notif) => notif.sound !== null);
			if (firstElementWithSound) {
				return firstElementWithSound.sound;
			} else {
				return null;
			}
		}
	}));