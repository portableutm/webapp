import React from 'react';
import {Menu, MenuItem} from '@blueprintjs/core';
import {
	useHistory
} from 'react-router-dom';

import {adesVersion} from '../consts.js';
import {useTranslation} from 'react-i18next';

function ContextualMenu() {
	const history = useHistory();
	const { t, } = useTranslation();
	return(
		<Menu>
			<MenuItem icon="map" text={t('contextualmenu_map')} onClick={() => history.push('/')}/>
			<MenuItem icon="dashboard" text={t('contextualmenu_dashboard')} onClick={() => history.push('/dashboard')}/>
			<MenuItem icon="plus" text={t('contextualmenu_createnewop')} onClick={() => history.push('/operation/new')}/>
			<MenuItem text={'PortableUTM WebApp v' + adesVersion} disabled={true}/>
		</Menu>
	);
}
export default ContextualMenu;