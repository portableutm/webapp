import {useEffect, useState} from 'react';

/* Libraries */
import S from 'sanctuary';
import {fM} from '../../libs/SaferSanctuary';
import {useParams} from 'react-router-dom';

/* Internal state */
import useAdesState, {extractOperationsFromState, filterOperationsByIds, filterOperationsByState} from '../../state/AdesState';
import {useTranslation} from 'react-i18next';

/* Global constants */


const initial = S.fromPairs([
	S.Pair('0')(false),
	S.Pair('1')(false),
	S.Pair('2')(true),
	S.Pair('3')(false),
	S.Pair('4')(true),
	/*S.Pair('5')(true)*/]);

const useOperationFilter = () => {
	const [selectedFilters, setSelectedFilters] = useState(initial);
	const [adesState, ] = useAdesState();
	const {id} = useParams();
	const [ids, setIds] = useState( id == null ? [] : [id]);
	const [allOperations, setOperations] = useState(extractOperationsFromState(adesState));
	const [filteredOperations, setFilteredOperations] = useState([]);
	const { t,  } = useTranslation();

	const states = [
		{
			text: t('map_filter_proposed'),
			filter: 'PROPOSED'
		},
		{
			text: t('map_filter_accepted'),
			filter: 'ACCEPTED'
		},
		{
			text: t('map_filter_activated'),
			filter: 'ACTIVATED'
		},
		{
			text: t('map_filter_closed'),
			filter: 'CLOSED'
		},
		/*
		{
			text: t('map_filter_nonconforming'),
			filter: 'NONCONFORMING'
		},
		 */
		{
			text: t('map_filter_rogue'),
			filter: 'ROGUE'
		}
	];

	useEffect(() => {
		setIds([id]);
	}, [id]);

	useEffect(() => {
		const filterNames = id == null ? S.pipe(
			[
				S.filter((elem) => fM(S.value(elem)(selectedFilters))),
				S.map((elem) => states[parseInt(elem)].filter)
			])
		(S.keys(selectedFilters)) : [];

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

	return [allOperations, filteredOperations, id, ids, selectedFilters, setSelectedFilters, setIds, states];
};

export {useOperationFilter as default};