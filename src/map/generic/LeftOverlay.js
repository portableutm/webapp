import {Intent, Menu, MenuItem} from '@blueprintjs/core';
import React, {useState} from 'react';
import PropTypes from 'prop-types';

function LeftOverlay({children, disabled = []}) {
	//const notifications = useNotificationStore();
	//const popOverMapNotifs =
	//    notifCount(notifications.state) > 0 ?
	//        " popOverMapNotifs" : " popOverMapNoNotifs";
	const popOverMapNotifs = ' popOverMapNoNotifs';
	const [clicked, setClicked] = useState(-1);
	return (
		<div className={'popOverMap animated fadeInUpBig' + popOverMapNotifs}>
			<Menu>
				{children.map((item, index) => {
					return <MenuItem
						intent={index <= clicked ? Intent.SUCCESS : Intent.WARNING}
						disabled={disabled.includes(index)} text={item.text}
						onClick={() => {
							setClicked(index);
							item.action();
						}}/>;
				})}
			</Menu>
		</div>
	);
}

LeftOverlay.propTypes = {
	children: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string.isRequired,
			action: PropTypes.func.isRequired
		}).isRequired
	).isRequired
};

export default LeftOverlay;