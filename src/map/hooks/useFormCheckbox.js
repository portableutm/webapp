import React, {useState} from 'react';

function useFormCheckbox(defaultValue) {
	const [checked, setChecked] = useState(defaultValue);

	const handleCheckEvent = (evt) => setChecked(evt.currentTarget.checked);

	return [checked, handleCheckEvent];
}

export default useFormCheckbox;