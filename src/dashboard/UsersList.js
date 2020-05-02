import React, {useEffect, useState} from 'react';
import A from 'axios';
import {API, USERS_DATA_TOO_OLD} from '../consts';
import _, {fM, fSM} from '../libs/SaferSanctuary';
import S from 'sanctuary';
import '../Ades.css';
import {Button, Tab, Tabs} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import useAdesState from '../state/AdesState';

const USERS_ONE_PAGE_NUMBER = 5;

const UsersList = () => {
	const history = useHistory();

	const [state, actions] = useAdesState();
	const [firstUser, setFirstUser] = useState(0);
	const [lastUser, setLastUser] = useState(USERS_ONE_PAGE_NUMBER);

	//-------------------------------------------------------------------------------------
	//------------------------------------- useEffect -------------------------------------
	//-------------------------------------------------------------------------------------
	
	// The useEffect is used to fetch the users data. It depends on authToken,
	// because at first render, authToken is empty, so we have to reexecute the
	// useEffect when the token is received.
	useEffect(() => {
		if (Date.now() - USERS_DATA_TOO_OLD - state.users.updated > USERS_DATA_TOO_OLD) {
			actions.users.fetch();
		}
	}, []);
	const users = S.values(fSM(state.users.list));
	const usersThisPage = users.slice(firstUser, lastUser);
	let tabsTotal = [];
	for (let i = 0; i <  users.length / USERS_ONE_PAGE_NUMBER; i++) {
		tabsTotal.push(i);
	}

	return (
		<>
			<h1>UsersList</h1>
			<div className="dshUsersListButtons">
				<Tabs id="dshUsersListsTabs" onChange={tab => {
					setFirstUser(tab * USERS_ONE_PAGE_NUMBER);
					setLastUser((tab + 1) * USERS_ONE_PAGE_NUMBER);
				}}>
					{	tabsTotal.map(tab => {
						const page = tab + 1;
						return	<Tab id={tab} key={'tab' + tab} title={'Page ' + page}/>;
					})
					}
				</Tabs>
			</div>
			<div>
				<table id="dshUsersList" className="bp3-html-table .bp3-html-table-bordered .bp3-html-table-striped fullHW">
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Username</th>
							<th>Email</th>
							<th>Role</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody className="dshUsersList">
						{usersThisPage.map(user => (
							<tr key={user.username}>
								<td>{user.firstName}</td>
								<td>{user.lastName}</td>
								<td>{user.username}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
								<td><Button small={true} onClick={() => history.push('/dashboard/users/' + user.username)}>Edit</Button></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
 
export default UsersList;