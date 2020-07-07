import styles from '../css/notification.module.css';
import * as classnames from 'classnames';
import rogueSfx from '../sounds/ROGUE.mp3';
import S from 'sanctuary';
import i18n from 'i18next';

class Notification {
	get isAcknowledged() {
		return this._isAcknowledged;
	}

	set isAcknowledged(value) {
		this._isAcknowledged = value;
	}
	constructor(type, isFocused, isEnlarged) {
		this.type = type || 'INFORMATION';
		this._id = '' + Date.now();
		this._header = null;
		this._body = null;
		this._sound = S.Nothing;
		this._isFocused = isFocused || false;
		this._isEnlarged = isEnlarged || false;
		this._isAcknowledged = false;
	}

	get isLocalized() {
		return this._isLocalized;
	}

	get sound() {
		if (this._isAcknowledged) {
			/* Acknowledged notifications produce no sound */
			return S.Nothing;
		} else {
			return this._sound;
		}
	}

	set isEnlarged(value) {
		this._isEnlarged = value;
	}

	get isFocused() {
		return this._isFocused;
	}

	get isEnlarged() {
		return this._isEnlarged;
	}

	get id() {
		return this._id;
	}

	get header() {
		if (!this._header) throw ('Notification: Attempted to get header of default notification. Don\'t use the notification class, only its inherited');
		return this._header;
	}

	get body() {
		if (!this._body) throw ('Notification: Attempted to get body of default notification. Don\'t use the notification class, only its inherited');
		return this._body;
	}

	isValidType() {
		return (
			this.type === 'INFORMATION' ||
			this.type === 'UTMMESSAGE' 	||
			this.type === 'GONE_ROGUE'
		);
	}

	isUtmMessage() {
		return this.type === 'UTMMESSAGE';
	}

	isInformation() {
		return this.type === 'INFORMATION';
	}
	
	isGoneRogue() {
		return this.type === 'GONE_ROGUE';
	}
}

class UTMMessage extends Notification {
	/* Please use the getters instead of accessing directly into the members */
	constructor(message_id, severity, time_sent, free_text, ...rest) {
		super('UTMMESSAGE', ...rest);
		this._id = message_id;
		this._uss_name = 'DronfiesUSS';
		this._discovery_reference = null;
		this._message_type = 'OPERATION_CONFORMING';
		this._prev_message_id = null;
		this._severity = severity;
		this._time_sent = time_sent;
		this._header = '(' + severity + ') received at ' + time_sent;
		this._body = free_text;
	}

	get severity() {
		return this._severity;
	}

	get time_sent() {
		return this._time_sent;
	}

	get free_text() {
		return this.body;
	}

	get uss_name() {
		throw('uss_name is unused');
	}

	get discovery_reference() {
		throw('discovery_reference is unused');
	}

	get message_type() {
		throw('message_type is unused');
	}

	get prev_message_id() {
		return this._prev_message_id;
	}

	getStylingString() {
		const severityStyle = 'utmmessage' + this._severity;
		const notificationStyle = styles.notificationFocused;
		return classnames(
			styles.notificationGeneric,
			styles[severityStyle],
			{
				[styles.notificationSelected]: this._isEnlarged,
				[notificationStyle]: this._isFocused
			},
			{[styles.notificationHidden]: this.isAcknowledged}
		);
	}
}

class Information extends Notification {
	constructor(header, body, ...focusedOrEnlarged) {
		super('INFORMATION', ...focusedOrEnlarged);
		this._header = header;
		this._body = body;
		this._sound = S.Nothing;
	}

	getStylingString() {
		return classnames(
			styles.notificationGeneric,
			'animated fadeInRight',
			{[styles.notificationSelected]: this._isEnlarged},
			styles.utmmessageINFORMATIONAL,
			{[styles.notificationHidden]: this.isAcknowledged}
		);
	}
}

class OperationGoneRogue extends Notification {
	constructor(nameOrId) {
		super('GONE_ROGUE', false, false);
		this._header = i18n.t('notifications.operation_gone_rogue.header');
		this._body = i18n.t('notifications.operation_gone_rogue.body', {operation: nameOrId});
		this._sound = S.Just(rogueSfx);
	}

	getStylingString() {
		return classnames(styles.notificationGeneric, styles.utmmessageEMERGENCY, {[styles.notificationSelected]: this._isEnlarged}, {[styles.notificationHidden]: this.isAcknowledged});
	}
}

export {
	Notification as default,
	UTMMessage,
	Information,
	OperationGoneRogue
};