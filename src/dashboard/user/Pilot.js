import React from 'react';
import { observer, useLocalStore, useAsObservableSource } from 'mobx-react';
import { useStore } from 'mobx-store-provider';
import { useTranslation } from 'react-i18next';
import { Button, Intent, FormGroup, InputGroup, FileInput } from '@blueprintjs/core';
import * as classnames from 'classnames';
import gStyles from '../generic/GenericList.module.css';
import styles from './Pilot.module.css';
import { ISDINACIA } from '../../consts';
import { buildUrl } from '../../Utils';

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

	// let userWithDianciaFields = user.dinacia_user ? user : { ...user, ...{dinacia_user:{document_file_path:""}} }
	// const obsUser = useAsObservableSource({ ...userWithDianciaFields });
	// console.error(` ---__--__->>${JSON.stringify(obsUser)}`)

	// const obsUser = useAsObservableSource({ dinacia_user, ...user });
	const obsUser = useAsObservableSource({ ...user });

	// const obsUser = useAsObservableSource({ ...{dinacia_user:{document_file_path:""}}, ...user });

	const localStore = useLocalStore(() => ({
		isUserDataChangeEnabled: true,
		isPasswordChangeEnabled: false,
		email: obsUser.email,
		document_file: null,
		permit_front_file: null,
		// remote_sensor_file: null,
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
		console.log(` Pruebbaaaaaa`)
		if (ISDINACIA) {

			let address = document.getElementById('address').value
			let document_type = document.getElementById('document_type').value
			let document_number = document.getElementById('document_number').value
			let phone = document.getElementById('phone').value
			let cellphone = document.getElementById('cellphone').value
			let nationality = document.getElementById('nationality').value

			let dinacia_user = { address, document_type, document_number, phone, cellphone, nationality }

			const dinaciaUserData = { ...user.dinacia_user, ...dinacia_user };

			// alert(`-8-8-8-8-----> ${JSON.stringify(dinaciaUserData.permit_expire_date)}`);

			try{
				if (dinaciaUserData.permit_expire_date !== null){
					// console.log(`PRUEBA XX:::::: ${dinaciaUserData.permit_expire_date}`)
					dinaciaUserData.permit_expire_date = dinaciaUserData.permit_expire_date.toISOString();
				}

			}catch(e){
				dinaciaUserData.permit_expire_date = null
			}

			if (document.getElementById('permit_expire_date').valueAsNumber > 0){
				dinaciaUserData.permit_expire_date = document.getElementById('permit_expire_date').valueAsDate;
			}
			
			console.log(JSON.stringify(dinaciaUserData));
			newUserData.append('dinacia_user_str', JSON.stringify(dinaciaUserData));
			newUserData.append('document_file', localStore.document_file);
			newUserData.append('permit_front_file', localStore.permit_front_file);
			// newUserData.append('remote_sensor_file', localStore.remote_sensor_file);
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
						<InputGroup leftIcon="person" disabled={true} id="username" value={user.username} />
					</FormGroup>
					{!localStore.isPasswordChangeEnabled &&
						<>
							<FormGroup
								label={t('users.firstname')}
								labelFor="firstName"
							>
								<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="firstName"
									defaultValue={user.firstName} />
							</FormGroup>
							<FormGroup
								label={t('users.lastname')}
								labelFor="lastName"
							>
								<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="lastName"
									defaultValue={user.lastName} />
							</FormGroup>
							{ISDINACIA && obsUser.dinacia_user &&
								<>
									<FormGroup
										label={t('users.address')}
										labelFor="address"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="address"
											defaultValue={user.dinacia_user.address} />
									</FormGroup>
									<FormGroup
										label={t('users.cellphone')}
										labelFor="cellphone"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="cellphone"
											defaultValue={user.dinacia_user.cellphone} />
									</FormGroup>
									<FormGroup
										label={t('users.document_type')}
										labelFor="document_type"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="document_type"
											defaultValue={user.dinacia_user.document_type} />
									</FormGroup>
									<FormGroup
										label={t('users.document_number')}
										labelFor="document_number"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="document_number"
											defaultValue={user.dinacia_user.document_number} />
									</FormGroup>
									<FormGroup
										label={t('users.phone')}
										labelFor="phone"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="phone"
											defaultValue={user.dinacia_user.phone} />
									</FormGroup>
									<FormGroup
										label={t('users.nationality')}
										labelFor="nationality"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled} id="nationality"
											defaultValue={user.dinacia_user.nationality} />
									</FormGroup>



									{obsUser.dinacia_user.document_file_path &&
										<button onClick={() => {
											const win = window.open(buildUrl(obsUser.dinacia_user.document_file_path), '_blank');
											win.focus();
										}}>La foto actual de {t('glossary:users.document_file')} es {
												obsUser.dinacia_user.document_file_path.substring(obsUser.dinacia_user.document_file_path.lastIndexOf('/') + 1)
											}</button>
									}
									<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
										text={localStore.document_file === null ?
											t('glossary:users.document_file') :
											localStore.document_file.name}
										onInputChange={(evt) =>
											localStore.setProperty('document_file', evt.target.files[0])} />

									{obsUser.dinacia_user.permit_front_file_path &&
										<button onClick={() => {
											const win = window.open(buildUrl(obsUser.dinacia_user.permit_front_file_path), '_blank');
											win.focus();
										}}>La foto actual de {t('glossary:users.permit_front_file')} es {
												obsUser.dinacia_user.permit_front_file_path.substring(obsUser.dinacia_user.permit_front_file_path.lastIndexOf('/') + 1)
											}</button>
									}
									<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
										text={localStore.permit_front_file === null ?
											t('glossary:users.permit_front_file') :
											localStore.permit_front_file.name}
										onInputChange={(evt) =>
											localStore.setProperty('permit_front_file', evt.target.files[0])} />

									{obsUser.dinacia_user.permit_back_file_path &&
										<button onClick={() => {
											const win = window.open(buildUrl(obsUser.dinacia_user.permit_back_file_path), '_blank');
											win.focus();
										}}>La foto actual de {t('glossary:users.permit_back_file')} es {
												obsUser.dinacia_user.permit_back_file_path.substring(obsUser.dinacia_user.permit_back_file_path.lastIndexOf('/') + 1)
											}</button>
									}
									<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
										text={localStore.permit_back_file === null ?
											t('glossary:users.permit_back_file') :
											localStore.permit_back_file.name}
										onInputChange={(evt) =>
											localStore.setProperty('permit_back_file', evt.target.files[0])} />

									{/* <FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.remote_sensor_file === null ?
									t('glossary:users.remote_sensor_file') :
									localStore.remote_sensor_file.name}
								onInputChange={(evt) =>
									localStore.setProperty('remote_sensor_file', evt.target.files[0])}/> */}

									<FormGroup
										label={t('users.permit_expire_date')}
										labelFor="permit_expire_date"
									>
										<InputGroup leftIcon="person" disabled={!localStore.isUserDataChangeEnabled}
											id="permit_expire_date"
											type="date"
										/>
										{user.dinacia_user && user.dinacia_user.permit_expire_date &&
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
									value={localStore.email} />
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
									<InputGroup type="password" leftIcon="compass" id="newpassword" />
								</FormGroup>
								<FormGroup
									label={t('common:change_password_confirmation', { name: user.username })}
									labelFor="newpasswordverification"
								>
									<InputGroup type="password" leftIcon="compass" id="newpasswordverification" />
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