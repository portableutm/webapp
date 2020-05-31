import React from 'react';
import RightAreaButton from '../RightAreaButton';
import {useTranslation} from 'react-i18next';
import useAdesState from '../../state/AdesState';

const EditorPanel = ({steps, stepsDisabled}) => {
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
					<p>Clicking on operations and restricted flight volumes will <b>NOT</b> show their properties. <i>Click
						here to change this behaviour</i></p>
					}
					{!state.map.onClicksDisabled &&
					<p>Clicking on operations and restricted flight volumes will show their properties. <i>Click here to
						change this behaviour</i></p>
					}
				</div>
			</RightAreaButton>
			<RightAreaButton
				useCase='editorSteps'
				icon='flow-linear'
				label={t('steps')}
				simpleChildren={false}
				forceOpen={true}
			>
				{steps.map((step, index) => {
					const isDisabled = stepsDisabled.indexOf(index) !== -1;
					const className = isDisabled ?
						'rightAreaButtonTextDisabled' :
						'rightAreaButtonText';
					return (
						<div
							key={step.text}
							className={className}
							onClick={isDisabled ? () => {
							} : () => step.action()}
						>
							{step.text}
						</div>
					);
				})}
			</RightAreaButton>
		</>
	);
};

export default EditorPanel;