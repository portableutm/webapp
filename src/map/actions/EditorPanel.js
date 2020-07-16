import React from 'react';
import SidebarButton from '../SidebarButton';
import {useTranslation} from 'react-i18next';
import useAdesState from '../../state/AdesState';
import styles from '../Map.module.css';

const EditorPanel = () => {
	const {t} = useTranslation('map');
	const [state, actions] = useAdesState();
	return (
		<>
			<SidebarButton
				useCase='editorOptions'
				icon='cog'
				label={t('options')}
				simpleChildren={false}
				forceOpen={true}
			>
				<div
					className={styles.sidebarButtonText}
					onClick={() => actions.map.onClicksDisabled(!state.map.onClicksDisabled)}
				>
					{state.map.onClicksDisabled &&
						<p>{t('clicks_disabled')}</p>
					}
					{!state.map.onClicksDisabled &&
						<p>{t('clicks_enabled')}</p>
					}
				</div>
			</SidebarButton>
		</>
	);
};

export default EditorPanel;