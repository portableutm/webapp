import React, {useState} from 'react';
import {Icon} from '@blueprintjs/core';
import * as classnames from 'classnames';
import styles from './Map.module.css';

function ExpandedRightAreaButton({useCase, isExpanded, onClick , simpleChildren, children}) {
	return (
		<div
			className={classnames(styles.sidebarText, {[styles.sidebarExpanded]: isExpanded}, {[styles.sidebarContracted]: !isExpanded})}
		>
			{	simpleChildren && children.map((sub, index) => {
				if (sub.isSpecial != null && sub.isSpecial) {
					return sub.div;
				} else {
					return (
						<div
							className={styles.sidebarButtonText}
							data-test-id={'map' + useCase + index}
							key={sub.name}
							onClick={() => onClick(sub)}
						>
							{sub.name}
						</div>
					);
				}
			}
			)
			}
			{	!simpleChildren &&
				children
			}
		</div>
	);
}

function SidebarButton({forceOpen = false, useCase, icon, label, onClick, simpleChildren, children, className = ''}) {
	const [isExpanded, setExpanded] = useState(forceOpen);
	return (
		<>
			<div
				data-test-id={'mapButton' + useCase}
				className={classnames(styles.sidebarButton, className)}
				onClick={() => setExpanded(current => !current)}
			>
				<Icon icon={icon} iconSize={20} color='rgb(255,255,255)'/>
				<div className={styles.rightAreaText}>
					{label}
				</div>
				{	!isExpanded &&
					<Icon icon='chevron-down' iconSize={20}/>
				}
				{	isExpanded &&
					<Icon icon='chevron-up' iconSize={20}/>
				}
			</div>
			<ExpandedRightAreaButton
				isExpanded={isExpanded}
				useCase={useCase}
				onClick={onClick}
				simpleChildren={simpleChildren}
			>
				{children}
			</ExpandedRightAreaButton>
		</>
	);
}

export default SidebarButton;