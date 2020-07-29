import React, {useEffect, useState} from 'react';

/* External */
import {useTranslation} from 'react-i18next';
import { useParams } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import S from 'sanctuary';
import {Button, Intent, Tab, Tabs} from '@blueprintjs/core';
import { useQuery } from 'urql';

/* Internal Libs */
import {fM, maybeValues} from '../../libs/SaferSanctuary';

/* Constants */
import useAdesState, {Axios, print} from '../../state/AdesState';
import genericStyles from '../generic/GenericList.module.css';
import styles from './UsersList.module.css';
import '../../Ades.css';






import Pilot from './Pilot';

const USERS_ONE_PAGE_NUMBER = 8;

/* function useUsersState() {
	const [usersList, setUsersList] = useState(S.Nothing);
	const [usersUpdated, setUpdated] = useState(0);
	const [refetchTime, setRefechtime] = useState(0);
	const [isError, setIsError] = useState(false);
	const isEmpty = S.isNothing(usersList);
	const [state, ] = useAdesState();

	const refetch = () => setRefechtime(Date.now());
	const usersListExtracted = maybeValues(usersList);

	useEffect(() => {
		Axios.get(state.api + 'user', {headers: {auth: fM(state.auth.token)}})
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
} */

const AllUsersQuery = `
	query {
		user {
			firstName
			lastName
			username
			email
			role
			operations(order_by: {submit_time: desc}, limit: 1) {
			  name
			}
		}
	}
`;

const UsersList = () => {
	const history = useHistory();
	const {t} = useTranslation(['glossary','common']);
	const { username } = useParams();

	const [result, execQuery] = useQuery({
		query: AllUsersQuery
	});

	const { data, fetching, error } = result;

	console.log('DATA', fetching, error, data);

	if (error) {
		return (
			<>
				<p>
					{t('app.errorocurredfetching')}
				</p>
				<Button
					intent={Intent.PRIMARY}
					onClick={() => {}}
				>
					{t('app.tryagain')}
				</Button>
			</>
		);
	} else if (fetching) {
		return (
			<>
				<p>
					Fetching
				</p>
			</>
		);
	} else {
		return (
			<>
				<div className={genericStyles.header}>
					<h1>
						{t('users.plural_generic').toUpperCase()}
					</h1>
				</div>
				<div className={styles.buttons}>
					Disabled
				</div>
				<div>
					<table id='usersList' className='.bp3-html-table .bp3-html-table-bordered .bp3-html-table-striped fullHW'>
						<thead>
							<tr>
								<th>{t('users.firstname')}</th>
								<th>{t('users.lastname')}</th>
								<th>{t('users.username')}</th>
								<th>{t('users.email')}</th>
								<th>{t('users.role')}</th>
								<th>last operation</th>
							</tr>
						</thead>
						<tbody className={styles.usersList}>
							{data.user.map(user => (
								<tr key={user.username}>
									<td>{user.firstName}</td>
									<td>{user.lastName}</td>
									<td>{user.username}</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td>{user.operations.length > 0 && user.operations[0].name}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
	/* return (
		<>
			{ 	isError &&

			}
			{	!isError &&
				S.isNothing(shownPilot) &&

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
	); */
};
 
export default UsersList;