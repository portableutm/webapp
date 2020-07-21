import React from 'react';
import styles from './Header.module.css';
import logo from '../images/logo.png';

function Header() {
	return(
		<div className={styles.header}>
			<img src={logo} alt="PortableUTM" className={styles.logo} />
		</div>
	);
}
export default Header;