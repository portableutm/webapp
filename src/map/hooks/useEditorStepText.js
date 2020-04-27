import {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';

function useEditorStepText(setOperationInfo, setInfoWindowOpen, setCurrentStep, setErrorCallback) {
	const [stepsDisabled, setStepsDisabled] = useState([1, 2]);
	const [stepKey, setStepKey] = useState(
		'editor_completesteps'
	);
	const {t, i18n} = useTranslation();
	const [stepText, setStepText] = useState(t(stepKey));

	useEffect(() => {
		const translation = t(stepKey);
		if (stepKey === translation) {
			// We use a fake stepKey to form a correct sentence for errors
			setStepText(`ERROR: ${stepKey}. ${t('editor_savingerror')}`);
		} else {
			setStepText(translation);
		}
	}, [stepKey, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

	const stepDefineVolume = () => {
		setStepKey('editor_definevolume');
		setStepsDisabled([2]);
		setCurrentStep(1);
	};

	const stepCompleteInfo = () => {
		setStepKey('editor_defineoperationinfo');
		setStepsDisabled([]);
		setCurrentStep(2);
		setInfoWindowOpen(true);
	};
	const stepSaveOperation = () => {
		setStepKey('editor_savingoperation');
		setStepsDisabled([0, 1]);
		setCurrentStep(3);
		setErrorCallback(() => error => {
			setStepKey(error);
			setStepsDisabled([2]);
		});
	};

	const stepsToDefineOperation = [
		{
			text: t('editor_step_definevolumes'),
			action: () => stepDefineVolume()
		},
		{
			text: t('editor_step_defineoperationinfo'),
			action: () => stepCompleteInfo()
		},
		{
			text: t('editor_step_finish'),
			action: () => stepSaveOperation()
		}
	];

	return [stepsToDefineOperation, stepText, stepsDisabled];
}

export default useEditorStepText;