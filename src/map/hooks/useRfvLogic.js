import {useEffect, useState} from 'react';
import S from 'sanctuary';

/* Internal */
import useAdesState from '../../state/AdesState';

const useRfvLogic = () => {
	const [state, ] = useAdesState(state => state.rfv, actions => actions.rfv);
	const [shownRfvs, setShownRfvs] = useState(S.keys(state.list));

	useEffect(() => {
		setShownRfvs(S.keys(state.list));
	}, [state.updated]); // eslint-disable-line react-hooks/exhaustive-deps

	return [shownRfvs, setShownRfvs];
};

export default useRfvLogic;