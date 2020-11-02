import React from 'react';
import '../Ades.css';
import { Menu, MenuDivider, MenuItem, Intent, Dialog, Button } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Dashboard.module.css';
import { adesVersion } from '../consts';
import { useStore } from 'mobx-store-provider';
import { observer, useLocalStore } from 'mobx-react';

function SideMenu() {
	const { t, i18n } = useTranslation(['dashboard', 'glossary']);
	const { authStore, logout } = useStore('RootStore',
		(store) => ({
			authStore: store.authStore,
			logout: store.reset
		}));
	const history = useHistory();
	const localStore = useLocalStore(() => ({
		isLogoutDialogOpen: false,
		setLogoutDialogOpen(flag) {
			localStore.isLogoutDialogOpen = flag;
		}
	}));

	const changeLanguage = () => {
		if (i18n.language === 'en') {
			i18n.changeLanguage('es');
		} else {
			i18n.changeLanguage('en');
		}
	};

	const LogoutConfirmation = observer(() => {
		return (
			<Dialog
				className="logoutDialog bp3-dark"
				autoFocus="true"
				isOpen={localStore.isLogoutDialogOpen}
				onClose={() => localStore.setLogoutDialogOpen(false)}
			>
				<h2>{t('sidemenu.logout_confirmation')}</h2>
				{t('sidemenu.logout_details')}
				<div className="logoutButtons">
					<Button style={{ margin: '5px' }} intent={Intent.DANGER} onClick={() => localStore.setLogoutDialogOpen(false)}>
						{t('sidemenu.logout_negative')}
					</Button>
					<Button style={{ margin: '5px' }} intent={Intent.SUCCESS} onClick={logout}>
						{t('sidemenu.logout_positive')}
					</Button>
				</div>
			</Dialog>
		);
	});

	if (authStore.role === 'admin') {
		return (
			<>
				<LogoutConfirmation />
				<div className={styles.side}>
					<Menu>
						<MenuItem className="animated flash slower infinite"
							icon="map" intent={Intent.PRIMARY}
							text={t('sidemenu.returnmap')}
							onClick={() => history.push('/')}/>
						<MenuItem icon="home"
							text={t('sidemenu.dshhome')}
							onClick={() => history.push('/dashboard')}/>
						<MenuItem icon="flag"
							text={t('sidemenu.changelanguage')}
							onClick={() => changeLanguage()}/>

						<MenuDivider title={
							`${t('sidemenu.logged_in')} ${authStore.username}`
						}/>
						<MenuItem icon="person" text={t('sidemenu.edit_your_info')} onClick={() => history.push('/dashboard/users/' + authStore.username)}/>
						<MenuItem icon="log-out" text={t('sidemenu.logout')} onClick={() => localStore.setLogoutDialogOpen(true)}/>

						<MenuDivider title={t('glossary:users.plural_generic')} />
						<MenuItem
							icon="user"
							text={t('sidemenu.all_users')}
							onClick={() => history.push('/dashboard/users')}/>
						<MenuItem
							icon="new-person"
							text={t('sidemenu.new_user.text')}
							onClick={() => history.push('/dashboard/users/new')}/>
						<MenuDivider title={t('glossary:entities')}/>
						<MenuItem icon="numbered-list"
							text={t('sidemenu.operations_list')}
							onClick={() => history.push('/dashboard/operations')}/>
						<MenuItem icon="numbered-list"
							text={t('sidemenu.vehicles_list')}
							onClick={() => history.push('/dashboard/vehicles')}/>
						<MenuItem icon="numbered-list"
							text={t('sidemenu.uvrs_list')}
							onClick={() => history.push('/dashboard/uvrs')}/>
						<MenuDivider title={t('ades_options.title')} />
						<MenuItem icon="cog"
							text={t('ades_options.web')}
							onClick={() => history.push('/dashboard/configuration')}/>
						<MenuItem style={{ fontFamily: '"Maven Pro", sans-serif' }} text={'v' + adesVersion} disabled={true}/>
					</Menu>
				</div>
			</>
		);
	} else if (authStore.role === 'pilot') {
		return (
			<>
				<LogoutConfirmation />
				<div className={styles.side}>
					<Menu>
						<MenuItem icon="home"
							text={t('sidemenu.dshhome')}
							onClick={() => history.push('/dashboard')}/>
						<MenuItem icon="flag"
							text={t('sidemenu.changelanguage')}
							onClick={() => changeLanguage()}/>

						<MenuDivider title={authStore.username}/>
						<MenuItem icon="person" text={t('sidemenu.edit_your_info')} onClick={() => history.push('/dashboard/users/' + authStore.username)}/>
						<MenuItem icon="log-out" text={t('sidemenu.logout')} onClick={() => localStore.isLogoutDialogOpen = true}/>

						<MenuDivider title={t('glossary:operations.plural_generic')} />
						{/* <MenuItem icon="zoom-in" text="Pending assesment"/> */}
						<MenuItem icon="numbered-list"
							text={t('sidemenu.operations_list_pilot')}
							onClick={() => history.push('/dashboard/operations')}/>
						<MenuDivider title={t('glossary:vehicles.plural_generic')}/>
						<MenuItem icon="airplane"
							text={t('sidemenu.vehicles_new')}
							onClick={() => history.push('/dashboard/vehicles/new')}/>
						<MenuItem icon="numbered-list"
							text={t('sidemenu.vehicles_list_pilot')}
							onClick={() => history.push('/dashboard/vehicles')}
						/>
						<MenuItem style={{ fontFamily: '"Maven Pro", sans-serif' }} text={'v' + adesVersion} disabled={true}/>
					</Menu>
				</div>
			</>
		);
	}
}

export default observer(SideMenu);