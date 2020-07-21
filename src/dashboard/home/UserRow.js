import React from 'react';
import './userrow.css';

const UserRow = ({name, username, quantity}) => {
	return (
		<div className="div-user-row">
			<div className="div-image"></div>
			<div>
				<div className="div-name">{name}</div>
				<div className="div-username">{username}</div>
			</div>
			<div className="div-quantity">{quantity}</div>
		</div>
	);
}
 
export default UserRow;