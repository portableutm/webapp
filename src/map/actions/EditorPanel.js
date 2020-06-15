import React from 'react';
import RightAreaButton from '../RightAreaButton';
import {useTranslation} from 'react-i18next';
import useAdesState from '../../state/AdesState';

const EditorPanel = () => {
	const {t} = useTranslation();
	const [state, actions] = useAdesState();
	return (
		<>
			<RightAreaButton
				useCase='editorOptions'
				icon='cog'
				label={t('Options')}
				simpleChildren={false}
				forceOpen={true}
			>
				<div
					className='rightAreaButtonText'
					onClick={() => actions.map.onClicksDisabled(!state.map.onClicksDisabled)}
				>
					{state.map.onClicksDisabled &&
						<p>{t('map.clicks_disabled')}</p>
					}
					{!state.map.onClicksDisabled &&
						<p>{t('map.clicks_enabled')}</p>
					}
				</div>
			</RightAreaButton>
		</>
	);
};

export default EditorPanel;