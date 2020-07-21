import {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';

function useEditorStepText(setOperationInfo, setInfoWindowOpen, setCurrentStep, setErrorCallback) {
	const [stepsDisabled, setStepsDisabled] = useState([1, 2]);
	const [stepKey, setStepKey] = useState(
		'editor.completesteps'
	);
	const {t, i18n} = useTranslation();
	const [stepText, setStepText] = useState(t(stepKey));

	useEffect(() => {
		const translation = t(stepKey);
		if (stepKey === translation) {
			// We use a fake stepKey to form a correct sentence for errors
			setStepText(`ERROR: ${stepKey}. ${t('editor.savingerror')}`);
		} else {
			setStepText(translation);
		}
	}, [stepKey, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

	const stepDefineVolume = () => {
		setStepKey('editor.definevolume');
		setStepsDisabled([2]);
		setCurrentStep(1);
	};

	const stepCompleteInfo = () => {
		setStepKey('editor.defineoperationinfo');
		setStepsDisabled([]);
		setCurrentStep(2);
		setInfoWindowOpen(true);
	};
	const stepSaveOperation = () => {
		setStepKey('editor.savingoperation');
		setStepsDisabled([0, 1]);
		setCurrentStep(3);
		setErrorCallback(() => error => {
			setStepKey(error);
			setStepsDisabled([2]);
		});
	};

	const stepsToDefineOperation = [
		{
			text: t('editor.step.definevolumes'),
			action: () => stepDefineVolume()
		},
		{
			text: t('editor.step.defineoperationinfo'),
			action: () => stepCompleteInfo()
		},
		{
			text: t('editor.step.finish'),
			action: () => stepSaveOperation()
		}
	];

	return [stepsToDefineOperation, stepText, stepsDisabled];
}

export default useEditorStepText;