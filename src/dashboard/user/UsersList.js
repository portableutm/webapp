import React, {useEffect, useState} from 'react';

/* External */
import {useTranslation} from 'react-i18next';
import { useParams } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import S from 'sanctuary';
import {Button, Intent, Tab, Tabs} from '@blueprintjs/core';

/* Internal Libs */
import {fM, maybeValues} from '../../libs/SaferSanctuary';

/* Constants */
import {API} from '../../consts';
import useAdesState, {Axios, print} from '../../state/AdesState';
import styles from './UsersList.module.css';
import '../../Ades.css';






import Pilot from './Pilot';

const USERS_ONE_PAGE_NUMBER = 8;

function useUsersState() {
	const [usersList, setUsersList] = useState(S.Nothing);
	const [usersUpdated, setUpdated] = useState(0);
	const [refetchTime, setRefechtime] = useState(0);
	const [isError, setIsError] = useState(false);
	const isEmpty = S.isNothing(usersList);
	const [state, ] = useAdesState();

	const refetch = () => setRefechtime(Date.now());
	const usersListExtracted = maybeValues(usersList);

	useEffect(() => {
		Axios.get(API + 'user', {headers: {auth: fM(state.auth.token)}})
			.then(result => {
				const dataObtained = Array.from(result.data);
				const pairs = S.justs(dataObtained.map((user) => {
					return S.Just(S.Pair(user.username)(user));
				}));
				const users = S.fromPairs(pairs);
				setUsersList(S.Just(users));
				setUpdated(Date.now());
				setIsError(false);
			})
			.catch(error => {
				print(state, true, '*UserState', error);
				setIsError(true);
			});
	}, [refetchTime]); // eslint-disable-line react-hooks/exhaustive-deps

	return [usersListExtracted, usersUpdated, isEmpty, isError, refetch];
}

const UsersList = () => {
	const history = useHistory();
	const {t} = useTranslation();
	const { username } = useParams();

	const [users, usersUpdated, isEmpty, isError, refetch] = useUsersState();
	const [shownPilot, setShownPilot] = useState(S.Nothing);
	const [firstUser, setFirstUser] = useState(0);
	const [lastUser, setLastUser] = useState(USERS_ONE_PAGE_NUMBER);

	/*useEffect(() => {
		// Only run in mount
		if (Date.now() - USERS_DATA_TOO_OLD - state.users.updated > USERS_DATA_TOO_OLD) {
			actions.users.fetch();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps*/

	const usersThisPage = users.slice(firstUser, lastUser); // TODO: Pagination by API
	let tabsTotal = [];
	for (let i = 0; i <  users.length / USERS_ONE_PAGE_NUMBER; i++) {
		tabsTotal.push(i);
	}

	useEffect(() => {
		if (!isEmpty && username != null) {
			const selected = users.find(user => user.username === username);
			setShownPilot(S.Just(selected));
		}
	}, [username, usersUpdated, isEmpty]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			{ 	isError &&
			<>
				<p>
					{t('app.errorocurredfetching')}
				</p>
				<Button
					intent={Intent.PRIMARY}
					onClick={() => refetch()}
				>
					{t('app.tryagain')}
				</Button>
			</>
			}
			{	!isError &&
				S.isNothing(shownPilot) &&
				<>
					<h1>{t('users')}</h1>
					<div className={styles.buttons}>
						<Tabs id='dshUsersListsTabs' onChange={tab => {
							setFirstUser(tab * USERS_ONE_PAGE_NUMBER);
							setLastUser((tab + 1) * USERS_ONE_PAGE_NUMBER);
						}}>
							{tabsTotal.map(tab => {
								const page = tab + 1;
								return <Tab id={tab} key={'tab' + tab} title={t('page') + ' ' + page}/>;
							})
							}
						</Tabs>
					</div>
					<div>
						<table id={styles.usersList} className='.bp3-html-table .bp3-html-table-bordered .bp3-html-table-striped fullHW'>
							<thead>
								<tr>
									<th>{t('user.firstname')}</th>
									<th>{t('user.lastname')}</th>
									<th>{t('user.username')}</th>
									<th>{t('user.email')}</th>
									<th>{t('user.role')}</th>
									<th>{t('actions')}</th>
								</tr>
							</thead>
							<tbody className={styles.usersList}>
								{usersThisPage.map(user => (
									<tr key={user.username}>
										<td>{user.firstName}</td>
										<td>{user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>{user.role}</td>
										<td>
											<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
												<Button
													small={true}
													onClick={() => {
														history.push('/dashboard/users/' + user.username);
														setShownPilot(S.Just(user));
													}}
												>
													{t('edit')}
												</Button>
												<Button
													small={true}
													onClick={() => history.push('/dashboard/vehicles/' + user.username + '/new/')}
												>
													{t('add_veh')}
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			}
			{	!isError &&
				S.isJust(shownPilot) &&
				<>
					<Button icon="circle-arrow-left" text={t('return_to_list')} onClick={() => {
						setShownPilot(S.Nothing);
						history.push('/dashboard/users');
					}} />
					<Pilot user={fM(shownPilot)} />
				</>
			}
		</>
	);
};
 
export default UsersList;