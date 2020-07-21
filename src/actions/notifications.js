import S from 'sanctuary';
import {Mutex} from 'async-mutex';
const notificationMutex = new Mutex(); // Allow single-access to notifications

export const add = (store, notification) => {
	notificationMutex
		.acquire()
		.then(function (release) {
			const currentNotifications = store.state.notifications.list;
			const notifications = S.insert(notification.id)(notification)(currentNotifications);
			store.setState({notifications: {list: notifications, updated: Date.now()}});
			release();
		});
};
export const update = (store, notification) => {
	notificationMutex
		.acquire()
		.then(function (release) {
			const currentNotifications = store.state.notifications.list;
			const notifications = S.insert(notification.id)(notification)(currentNotifications);
			store.setState({notifications: {list: notifications, updated: Date.now()}});
			release();
		});
};
export const remove = (store, id) => {
	notificationMutex
		.acquire()
		.then(function (release) {
			const currentNotifications = store.state.notifications.list;
			const notifications = S.remove(id)(currentNotifications);
			store.setState({notifications: {list: notifications, updated: Date.now()}});
			release();
		});
};