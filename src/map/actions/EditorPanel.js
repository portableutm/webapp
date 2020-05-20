import React from 'react';
import RightAreaButton from '../RightAreaButton';
import {useTranslation} from 'react-i18next';

const EditorPanel = ({steps, stepsDisabled}) => {
	const {t} = useTranslation();
	return(
		<>
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
							onClick={isDisabled ? () => {} : () => step.action()}
						>
							{step.text}
						</div>
					);})}
			</RightAreaButton>
		</>
	);
};

export default EditorPanel;