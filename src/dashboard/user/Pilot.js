import React, {useState} from 'react';
import profile from '../../images/profile.png';
import {Button, Intent, Card, Elevation, FormGroup, InputGroup} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';
import useAdesState, {Axios} from '../../state/AdesState';
import {fM} from '../../libs/SaferSanctuary';

function Pilot({user}) {
	const { t, } = useTranslation();
	//const { username } = useParams();
	//const [ user, setUser ] = useState(passedUser);
	const [isUserDataChangeEnabled, setUserDataChangeEnabled] = useState(true);
	const [isPasswordChangeEnabled, setPasswordChangeEnabled] = useState(false);
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [state, actions] = useAdesState();

	const onEmailInputChange = (evt) => {
		const email = evt.currentTarget.value;
		const hasAtSign = email.includes('@');
		const hasDotSign = email.includes('.');
		const hasNoSpace = !email.includes(' ');
		/* We validate emails using a lax policy here, contrary to the user registration */
		/* We should actually verify these emails are valid by confirming also their new address */
		/* not by enforcing a complicated pattern */
		// TODO: Confirm new user email is valid.
		setIsEmailValid(hasAtSign && hasDotSign && hasNoSpace);
	};

	const changePassword = () => {
		const newUserData = {...user};
		setPasswordChangeEnabled(false);
		setUserDataChangeEnabled(false);
		newUserData.password = document.getElementById('newpassword').value;
		//if (newUserData.password.includes(' ')) alert('Your password contains an invalid character');
		Axios
			.put('/user/password/' + newUserData.username, newUserData, {headers: {auth: fM(state.auth.token)}})
			.then(() =>
				actions.auth.info(newUserData.username, () => {
					actions.warning.setWarning('Password change was successful');
					setUserDataChangeEnabled(true);
				}, () => {
					actions.auth.logout();
				})
			)
			.catch(() => {
				actions.auth.logout();
			});
	};
	const changeUserData = () => {
		setUserDataChangeEnabled(false);
		const newUserData = {...user};
		newUserData.firstName = document.getElementById('firstName').value;
		newUserData.lastName = document.getElementById('lastName').value;
		newUserData.email = document.getElementById('email').value;
		Axios
			.put('/user/info/' + newUserData.username, newUserData, {headers: {auth: fM(state.auth.token)}})
			.then(() =>
				actions.auth.info(newUserData.username, () => {
					actions.warning.setWarning('Data change was successful');
					setUserDataChangeEnabled(true);
				}, () => {
					actions.auth.logout();
				})
			)
			.catch((error) => {
				actions.warning.setWarning('Data change failed: ' + error.response.data[0]);
				setUserDataChangeEnabled(true);
			});
	};

	/*
	useEffect(() => {
		// Only run in mount
		if (Date.now() - USERS_DATA_TOO_OLD - state.users.updated > USERS_DATA_TOO_OLD) {
			actions.users.fetch();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (user == null) {
			let users = state.users.list;
			if (S.isJust(users)) {
				users = S.fromMaybe({})(users);
				setUser(S.fromMaybe({firstName: 'Does not', lastName: 'exist', username: 'error', email:'error', role:'admin'})(S.value(username)(users)));
			}
		}
	}, [state.users.updated]); // eslint-disable-line react-hooks/exhaustive-deps
	 */

	return (
		<div className='dshPilot'>
			<div className='dshPilotLeft'>
				<img className='dshPilotImg' src={profile} title="User icon by Icons8" alt="Default profile"/>
			</div>
			<div className='dshPilotRight'>
				{   user == null &&
				<h1 className="bp3-heading bp3-skeleton">Loading McLoading</h1>
				}
				{	user != null &&
					<h1 className="bp3-heading">{user.firstName + ' ' + user.lastName}</h1>
				}
			</div>
			<div className='dshPilotBottom'>
				{	user != null &&
					<>
						<Card className='fullHW' elevation={Elevation.TWO}>
							<FormGroup
								label={t('user.username')}
								labelFor="username"
								labelInfo="(non-editable)"
							>
								<InputGroup leftIcon="person" disabled={true} id="username"  value={user.username}/>
							</FormGroup>
							<FormGroup
								label={t('user.firstname')}
								labelFor="firstName"
							>
								<InputGroup leftIcon="person" disabled={!isUserDataChangeEnabled} id="firstName" defaultValue={user.firstName}/>
							</FormGroup>
							<FormGroup
								label={t('user.lastname')}
								labelFor="lastName"
							>
								<InputGroup leftIcon="person" disabled={!isUserDataChangeEnabled} id="lastName" defaultValue={user.lastName}/>
							</FormGroup>
							<FormGroup
								label={t('user.email')}
								labelFor="email"
							>
								<InputGroup
									type="email"
									onChange={onEmailInputChange}
									leftIcon="envelope"
									disabled={!isUserDataChangeEnabled}
									id="email"
									intent={isEmailValid ? Intent.SUCCESS : Intent.WARNING}
									defaultValue={user.email}/>
							</FormGroup>
							<FormGroup
								label={t('user.role')}
								labelFor="role"
							>
								<div id="role" className="bp3-select bp3-fill">
									<select value={user.role} disabled={true}>
										<option value="admin">Operator</option>
										<option value="pilot">Pilot</option>
									</select>
								</div>
							</FormGroup>
							<Button
								intent={Intent.PRIMARY}
								disabled={!isUserDataChangeEnabled}
								onClick={() => changeUserData()}
							>
								Save changes
							</Button>
						</Card>
						<Card className='fullHW' elevation={Elevation.TWO} style={{marginTop: '10px', marginBottom: '10px'}}>
							{	!isPasswordChangeEnabled &&
								<Button
									intent={Intent.DANGER}
									disabled={!isUserDataChangeEnabled}
									onClick={() => setPasswordChangeEnabled(true)}
								>
									Change password
								</Button>
							}
							{	isPasswordChangeEnabled &&
								<>
									<FormGroup
										label={t('user.change_password')}
										labelFor="newpassword"
									>
										<InputGroup type="password" leftIcon="compass" id="newpassword"/>
									</FormGroup>
									<Button
										intent={Intent.PRIMARY}
										onClick={() => changePassword()}
									>
									Save new password
									</Button>
								</>
							}
						</Card>
					</>
				}
			</div>
		</div>
	);
}
export default Pilot;