import {useEffect, useState} from 'react';

/* Libraries */
import S from 'sanctuary';
import {fM} from '../../libs/SaferSanctuary';
import {useParams} from 'react-router-dom';

/* Internal state */
import useAdesState, {extractOperationsFromState, filterOperationsByIds, filterOperationsByState} from '../../state/AdesState';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

/* Global constants */


const initial = S.fromPairs([
	S.Pair('0')(false),
	S.Pair('1')(true),
	S.Pair('2')(true),
	S.Pair('3')(true),
	S.Pair('4')(false)
	/*
	S.Pair('3')(false),
	S.Pair('4')(true),*/
	/*S.Pair('5')(true)*/]);

const useOperationFilter = () => {
	const [selectedFilters, setSelectedFilters] = useState(initial);
	const [adesState, actions] = useAdesState();
	const {id} = useParams();
	const [ids, setIds] = useState(adesState.map.ids);
	const [allOperations, setOperations] = useState(extractOperationsFromState(adesState));
	const [filteredOperations, setFilteredOperations] = useState([]);
	const { t,  } = useTranslation();
	const history = useHistory();

	let states = [
		{
			text: t('map.filter.accepted'),
			filter: 'ACCEPTED'
		},
		{
			text: t('map.filter.pending'),
			filter: 'PENDING'
		},
		{
			text: t('map.filter.activated'),
			filter: 'ACTIVATED'
		},
		{
			text: t('map.filter.rogue'),
			filter: 'ROGUE'
		},
		/*
		{
			text: t('map.filter.proposed'),
			filter: 'PROPOSED'
		},
		*/
		/*
		{
			text: t('map.filter.closed'),
			filter: 'CLOSED'
		},
		*/
		/*
		{
			text: t('map.filter.nonconforming'),
			filter: 'NONCONFORMING'
		},
		 */
	];
	const closedState = {
		text: t('map.filter.closed'),
		filter: 'CLOSED'
	};

	if (adesState.debug) states.push(closedState);

	useEffect(() => {
		if (id !== null) {
			actions.map.addId(id);
			/*setSelectedFilters(S.fromPairs([
				S.Pair('0')(false),
				S.Pair('1')(false),
				S.Pair('2')(false),
				S.Pair('3')(false),
				S.Pair('4')(false)]
			));*/
		}
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setIds(adesState.map.ids);
	}, [adesState.map.ids]);

	useEffect(() => {
		const filterNames = S.pipe(
			[
				S.filter((elem) => fM(S.value(elem)(selectedFilters))),
				S.map((elem) => states[parseInt(elem)].filter)
			])
		(S.keys(selectedFilters));

		const filteredOperations = S.join
		([
			filterOperationsByState(filterNames)(allOperations),
			filterOperationsByIds(ids)(allOperations)
		]); // Show all operations that match ONE of the filters.

		setFilteredOperations(Array.from(new Set(filteredOperations))); // Remove duplicates
	}, [allOperations, selectedFilters, ids, id]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setOperations(extractOperationsFromState(adesState));
	}, [adesState.operations.updated]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect( () => {
		//console.log("filteredOperations", filteredOperations);
	}, [filteredOperations]); // eslint-disable-line react-hooks/exhaustive-deps
	/*
		allOperations
		filteredOperations: Operations that match the filters
		id: Focused id
		ids
		selectedFilters: selected filters names
		setSelectedFilters: To show
		setIds: To show
	 */

	return [allOperations, filteredOperations, id, selectedFilters, setSelectedFilters, states, ids, setIds];
};

export {useOperationFilter as default};