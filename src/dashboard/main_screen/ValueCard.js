import React from 'react';
import './valuecard.css';

const ValueCard = ({title, value}) => {
	return (
		<div className="div-card-container">
			<div className="div-title">
				<span>{title}</span>
			</div>
			<div className="div-value">
				{value}
			</div>
			<div className="div-operations">
				operations
			</div>
		</div>
	);
}
 
export default ValueCard;