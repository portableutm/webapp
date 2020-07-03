import styles from '../css/notification.module.css';
import * as classnames from 'classnames';
import rogueSfx from '../sounds/ROGUE.mp3';
import S from 'sanctuary';

const enlargedStyle = 'animated fast pulse infinite';

class Notification {
	constructor(type, isFocused, isEnlarged) {
		this.type = type || 'INFORMATION';
		this._id = Date.now();
		this._header = null;
		this._body = null;
		this._sound = S.Nothing;
		this._isFocused = isFocused || false;
		this._isEnlarged = isEnlarged || false;
		this._isEnlarged = isEnlarged;
	}

	get sound() {
		return this._sound;
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
			this.type === 'UTMMESSAGE'
		);
	}

	isUtmMessage() {
		return this.type === 'UTMMESSAGE';
	}

	isInformation() {
		return this.type === 'INFORMATION';
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
				[enlargedStyle]: this._isEnlarged,
				[notificationStyle]: this._isFocused
			}
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
		return classnames(styles.notificationGeneric, {[enlargedStyle]: this._isEnlarged}, styles.utmmessageINFORMATIONAL);
	}
}

class OperationGoneRogue extends Notification {
	constructor(header, body) {
		super('GONE_ROGUE', false, false);
		this._header = header;
		this._body = body;
		this._sound = S.Just(rogueSfx);
	}

	getStylingString() {
		return classnames(styles.notificationGeneric, {[enlargedStyle]: this._isEnlarged}, styles.utmmessageEMERGENCY);
	}
}

export {
	Notification as default,
	UTMMessage,
	Information,
	OperationGoneRogue
};