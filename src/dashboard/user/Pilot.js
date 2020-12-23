import React  from 'react';
import { observer, useLocalStore, useAsObservableSource } from 'mobx-react';
import { useStore } from 'mobx-store-provider';
import { useTranslation } from 'react-i18next';
import { Button, Intent, FormGroup, InputGroup, FileInput } from '@blueprintjs/core';
import * as classnames from 'classnames';
import gStyles from '../generic/GenericList.module.css';
import styles from './Pilot.module.css';
import { ISDINACIA } from '../../consts';

function Pilot({ user }) {
	const { t, } = useTranslation(['glossary', 'common']);
	const { axiosInstance, token, setWarning, fetchUsers, logout } = useStore('RootStore', (store) => ({
		axiosInstance: store.axiosInstance,
		token: store.authStore.token,
		setWarning: store.setFloatingText,
		fetchUsers: store.userStore.fetchUsers,
		logout: store.reset
	}));
	//const { username } = useParams();
	//const [ user, setUser ] = useState(passedUser);

	const obsUser = useAsObservableSource({ ...user });

	const localStore = useLocalStore(() => ({
		isUserDataChangeEnabled: true,
		isPasswordChangeEnabled: false,
		email: obsUser.email,
		document_file: null,
		permit_front_file: null,
		remote_sensor_file: null,
		permit_back_file: null,

		setProperty(property, value) {
			localStore[property] = value;
		},
		setEmail(newEmail) {
			localStore.email = newEmail;
		},
		setPasswordChangeEnabled(value) {
			localStore.isPasswordChangeEnabled = value;
		},
		setUserDataChangeEnabled(value) {
			localStore.isUserDataChangeEnabled = value;
		},
		get isEmailValid() {
			const hasAtSign = localStore.email.includes('@');
			const hasDotSign = localStore.email.includes('.');
			const hasNoSpace = !localStore.email.includes(' ');
			/* We validate emails using a lax policy here, contrary to the user registration */
			/* We should actually verify these emails are valid by confirming also their new address */
			/* not by enforcing a complicated pattern */
			return hasAtSign && hasDotSign && hasNoSpace;
		}
	}));

	const changePassword = () => {
		if (document.getElementById('newpassword').value !==
			document.getElementById('newpasswordverification').value) {
			setWarning('The passwords do not match');
			return;
		}
		const newUserData = { ...user };
		localStore.setPasswordChangeEnabled(false);
		localStore.setUserDataChangeEnabled(false);
		newUserData.password = document.getElementById('newpassword').value;
		//if (newUserData.password.includes(' ')) alert('Your password contains an invalid character');
		axiosInstance
			.put(
				'/user/password/' + user.username,
				newUserData,
				{ headers: { auth: token } })
			.then(() => {
				setWarning('Password change was successful');
				localStore.setUserDataChangeEnabled(true);
			})
			.catch(() => {
				logout(); // An error occured. It's probably Auth related. Let's log out
			});
	};
	const changeUserData = () => {
		localStore.setUserDataChangeEnabled(false);

		const newUserData = new FormData();
		if (ISDINACIA) {
			const dinaciaUserData = { ...user.dinacia_user };
			if (dinaciaUserData.permit_expire_date)
				dinaciaUserData.permit_expire_date = dinaciaUserData.permit_expire_date.toISOString();
			if (document.getElementById('permit_expire_date').valueAsNumber > 0)
				dinaciaUserData.permit_expire_date = document.getElementById('permit_expire_date').valueAsDate;
			console.log(JSON.stringify(dinaciaUserData));
			newUserData.append('dinacia_user_str', JSON.stringify(dinaciaUserData));
			newUserData.append('document_file', localStore.document_file);
			newUserData.append('permit_front_file', localStore.permit_front_file);
			newUserData.append('remote_sensor_file', localStore.remote_sensor_file);
			newUserData.append('permit_back_file', localStore.permit_back_file);
		}

		newUserData.append('firstName', document.getElementById('firstName').value);
		newUserData.append('lastName', document.getElementById('lastName').value);
		newUserData.append('email', document.getElementById('email').value);

		axiosInstance
			.put('/user/info/' + user.username, newUserData, { headers: { 'Content-Type': 'multipart/form-data', auth: token } })
			.then(() => {
				setWarning('Data change was successful');
				fetchUsers();
				localStore.setUserDataChangeEnabled(true);
			})
			.catch((error) => {
				setWarning('Data change failed: ' + error.response.data[0]);
				localStore.setUserDataChangeEnabled(true);
			});
	};

	return (
		<>
			<div className={styles.pilot}>
				<div className={gStyles.header}>

				</div>
				<div className={styles.pilotBottom}>
					<FormGroup
						label={t('users.username')}
						labelFor="username"
						labelInfo={t('common:cant_edit')}
					>
						<InputGroup leftIcon="person" disabled={true} id="username" value={user.username}/>
					</FormGroup>
					{!localStore.isPasswordChangeEnabled &&
					<>
						<FormGroup
							label={t('users.firstname')}
							labelFor="firstName"
						>
							<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="firstName"
								defaultValue={user.firstName}/>
						</FormGroup>
						<FormGroup
							label={t('users.lastname')}
							labelFor="lastName"
						>
							<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="lastName"
								defaultValue={user.lastName}/>
						</FormGroup>
						{ISDINACIA &&
						<>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.document_file === null ?
									t('glossary:users.document_file') :
									localStore.document_file.name}
								onInputChange={(evt) =>
									localStore.setProperty('document_file', evt.target.files[0])}/>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.permit_front_file === null ?
									t('glossary:users.permit_front_file') :
									localStore.permit_front_file.name}
								onInputChange={(evt) =>
									localStore.setProperty('permit_front_file', evt.target.files[0])}/>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.permit_back_file === null ?
									t('glossary:users.permit_back_file') :
									localStore.permit_back_file.name}
								onInputChange={(evt) =>
									localStore.setProperty('permit_back_file', evt.target.files[0])}/>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.remote_sensor_file === null ?
									t('glossary:users.remote_sensor_file') :
									localStore.remote_sensor_file.name}
								onInputChange={(evt) =>
									localStore.setProperty('remote_sensor_file', evt.target.files[0])}/>
							<FormGroup
								label={t('users.permit_expire_date')}
								labelFor="permit_expire_date"
							>
								<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled}
									id="permit_expire_date"
									type="date"
								/>
								{user.dinacia_user != null &&
								<p>
									{t('glossary:current')} {user.dinacia_user.permit_expire_date.toDateString()}
								</p>
								}
							</FormGroup>
						</>
						}
						<FormGroup
							label={t('users.email')}
							labelFor="email"
						>
							<InputGroup
								type="email"
								onChange={(evt) => localStore.setEmail(evt.target.value)}
								leftIcon="envelope"
								disabled={!localStore.isUserDataChangeEnabled}
								id="email"
								intent={localStore.isEmailValid ? Intent.SUCCESS : Intent.WARNING}
								value={localStore.email}/>
						</FormGroup>
						<FormGroup
							label={t('users.role')}
							labelFor="role"
						>
							<div id="role" className="bp3-select bp3-fill">
								<select value={user.role} disabled={true}>
									<option value="admin">Operator</option>
									<option value="pilot">Pilot</option>
								</select>
							</div>
						</FormGroup>
					</>
					}
					<div className={classnames({
						[styles.pilotActions]: !localStore.isPasswordChangeEnabled,
						[styles.pilotActionsVertical]: localStore.isPasswordChangeEnabled
					})}
					>
						{!localStore.isPasswordChangeEnabled &&
						<>
							<Button
								intent={Intent.DANGER}
								disabled={!localStore.isUserDataChangeEnabled}
								onClick={() => localStore.setPasswordChangeEnabled(true)}
							>
								{t('common:change_password', { name: user.username })}
							</Button>

							<Button
								intent={Intent.PRIMARY}
								disabled={!localStore.isUserDataChangeEnabled}
								onClick={() => changeUserData()}
							>
								{t('common:save_changes')}
							</Button>
						</>
						}
						{localStore.isPasswordChangeEnabled &&
						<>
							<FormGroup
								label={t('common:change_password', { name: user.username })}
								labelFor="newpassword"
							>
								<InputGroup type="password" leftIcon="compass" id="newpassword"/>
							</FormGroup>
							<FormGroup
								label={t('common:change_password_confirmation', { name: user.username })}
								labelFor="newpasswordverification"
							>
								<InputGroup type="password" leftIcon="compass" id="newpasswordverification"/>
							</FormGroup>
							<Button
								intent={Intent.PRIMARY}
								onClick={() => changePassword()}
							>
								{t('common:save_changes')}
							</Button>
						</>
						}
					</div>
				</div>
			</div>
		</>
	);
}

export default observer(Pilot);