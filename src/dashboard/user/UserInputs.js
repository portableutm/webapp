import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { ISDINACIA } from '../../consts';
import React from 'react';

const UserInputs = ({ localStore }) => {
	const { t,  } = useTranslation('glossary');
	return useObserver(() => {
		return Object.keys(localStore.user).map((prop) => {
			if (prop !== 'role' && prop !== 'dinacia_user' && prop !== 'password') {
				return (
					<FormGroup
						key={prop}
						label={t(`users.${prop}`)}
						labelFor={`input-${prop}`}>
						<InputGroup
							key={'input' + prop}
							id={`input-${prop}`}
							value={localStore.user[prop]}
							onChange={e => localStore.user.setProperty(prop, e.target.value)}
						/>
					</FormGroup>
				);
			} else if (ISDINACIA && prop === 'dinacia_user') {
				return Object.keys(localStore.user.dinacia_user).map((propDu) => {
					if (propDu !== 'dinacia_company' && propDu.substring(propDu.length - 5) !== '_file') {
						return (
							<FormGroup
								key={propDu}
								label={t(`users.${propDu}`)}
								labelFor={`input-${propDu}`}>
								<InputGroup
									key={'input' + propDu}
									id={`input-${propDu}`}
									value={localStore.user.dinacia_user[propDu]}
									onChange={e => localStore.user.setDinaciaProperty(propDu, e.target.value)}
								/>
							</FormGroup>
						);
					} else {
						return null;
					}
				});
			} else {
				return null;
			}
		});
	});
};

export default UserInputs;