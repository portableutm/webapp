import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import {
	useHistory
} from 'react-router-dom';

import { adesVersion } from '../consts.js';
import { useTranslation } from 'react-i18next';
import { useStore } from 'mobx-store-provider';

function ContextualMenu() {
	const history = useHistory();
	const { t, } = useTranslation();
	const { authStore } = useStore('RootStore',
		(store) => ({
			authStore: store.authStore
		}));
	return(
		<Menu>
			<MenuItem icon="map" text={t('hamburger.map')} onClick={() => history.push('/')}/>
			<MenuItem icon="dashboard" text={t('hamburger.dashboard')} onClick={() => history.push('/dashboard')}/>
			<MenuItem icon="layout" text={t('hamburger.createnewop')} onClick={() => history.push('/operation/new')}/>
			{authStore.role === 'admin' &&
			<MenuItem icon="polygon-filter" text={t('hamburger.createnewuvr')} onClick={() => history.push('/uvr/new')}/>
			}
			<MenuItem text={'PortableUTM WebApp v' + adesVersion} disabled={true}/>
		</Menu>
	);
}
export default ContextualMenu;