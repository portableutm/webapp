import React from 'react';

/* Visuals */
import {Checkbox} from '@blueprintjs/core';

/* Logic */
import useOperationFilter from '../hooks/useOperationFilter';
import S from 'sanctuary';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import RightAreaButton from '../RightAreaButton';
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';

const StateFilters = ({selectedFilters, setSelectedFilters}) => {
	const [, , , , , , , states] = useOperationFilter();
	return (
		<>
			{/*
			<div className='rightAreaButtonTextsSeparator'>
				{t('map_filter_bystate')}
			</div>
			*/}
			{states.map((filter, index) => {
				return (
					<div
						key={index + filter.text}
						className='rightAreaButtonText'
					>
						<Checkbox
							className='donotselect'
							data-test-id={'layers' + filter.filter}
							checked={S.maybeToNullable(S.value('' + index)(selectedFilters))}
							onChange={(evt) => {
								setSelectedFilters((current) =>
									S.insert('' + index)(!fM(S.value('' + index)(current)))(current)
								);
							}}
						>
							{filter.text}
						</Checkbox>

					</div>
				);
			})}
		</>
	);
};

const OperationFilters = ({operations, ids, setIds}) => {
	const { t,  } = useTranslation();
	return (
		<>
			<div className='rightAreaButtonTextsSeparator'>
				{t('map_filter_byid')}
			</div>
			{operations.map((op, index) => {
				return (
					<div
						className='rightAreaButtonText'
						key={op.gufi + index}
					>
						<Checkbox
							checked={ids.includes(op.gufi)}
							onChange={() =>
								setIds(currIds => {
									if (currIds.includes(op.gufi)) {
										return currIds.filter(cid => op.gufi !== cid);
									} else {
										const newIds = currIds.slice();
										newIds.push(op.gufi);
										return newIds;
									}
								})
							}
						>
							{op.flight_comments}
						</Checkbox>
					</div>
				);
			}
			)}
		</>
	);
};

/* Button that opens a Menu that permits users selects what layers to show */
const Layers = ({filtersSelected, setFiltersSelected, operations, idsSelected, setIdsSelected, disabled}) => {
	const [state, ] = useAdesState();
	return (
		<>
			{/*
		<div data-test-id='mapButtonLayers' className='layersButton'>
			<Popover content={
				<div>
					<Menu>
						<StateFilters selectedFilters={filtersSelected} setSelectedFilters={setFiltersSelected}/>
						<OperationFilters operations={operations} ids={idsSelected} setIds={setIdsSelected}/>
					</Menu>
				</div>
			} position={Position.BOTTOM_LEFT} disabled={disabled}>
				<div className='contextualMenu'>
					<Icon icon='layers' iconSize={44} color={disabled ? 'rgb(200,200,200)' : 'rgb(50,50,50)'}/>
				</div>
			</Popover>
		</div>
		*/}
			<RightAreaButton
				forceOpen={true}
				useCase='Layers'
				icon='layers'
				label='LAYERS'
				simpleChildren={false}
			>
				<StateFilters selectedFilters={filtersSelected} setSelectedFilters={setFiltersSelected}/>
				{ state.debug &&
				<OperationFilters operations={operations} ids={idsSelected} setIds={setIdsSelected}/>
				}
			</RightAreaButton>
		</>
	);
};

Layers.propTypes = {
	filtersSelected: PropTypes.object.isRequired,
	setFiltersSelected: PropTypes.func.isRequired,
	operations: PropTypes.array.isRequired,
	idsSelected: PropTypes.array.isRequired,
	setIdsSelected: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired
};
export default Layers;