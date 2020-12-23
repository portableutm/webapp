import React from 'react';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { DateInput, TimePrecision } from '@blueprintjs/datetime';
import { useTranslation } from 'react-i18next';
import styles from '../Map.module.css';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';

function OperationVolumeInfoEditor() {
	const { mapStore } = useStore('RootStore', store => ({ mapStore: store.mapStore }));
	const { t,  } = useTranslation('glossary');
	return (
		<div>
			{/* title={t('editor.volume.editingvolume_count', {count: S.maybeToNullable(opVolumeIndex)})} */}
			{/*
			near_structure	boolean
			Is this operation volume within 400' of a structure?
			*/}
			{/* <div className="rightAreaButtonText">
				<Checkbox
					checked={info.near_structure}
					alignIndicator={Alignment.LEFT}
					data-test-id="map#editor#volume#info#near_structure"
					onChange={change =>
						editInfo('near_structure', change.currentTarget.checked)
					}
				>
					{t('editor.volume.nearstructure')}
				</Checkbox>
			</div> */}
			{/*
			beyond_visual_line_of_sight*	boolean
			x-utm-data-accessibility: OPERATIONAL
			Describes whether any portion of the operation volume is beyond the visual line of sight of the RPIC.
			*/}
			{/*<div className="rightAreaButtonText">
				<Checkbox
					checked={info.beyond_visual_line_of_sight}
					alignIndicator={Alignment.LEFT}
					data-test-id="map#editor#volume#info#bvlos"
					onChange={change =>
						editInfo(
							'beyond_visual_line_of_sight',
							change.currentTarget.checked
						)
					}
				>
					{t('editor.volume.bvlos')}
				</Checkbox>
			</div>*/}
			{/*
				effective_time_begin*	string($date-time)
				example: 2015-08-20T14:11:56.118Z
				Earliest time the operation will use the operation volume. It must be less than effective_time_end.
				effective_time_begin < effective_time_end MUST be true.
				*/}
			<div className={styles.sidebarButtonText}>
				<p className={styles.sidebarButtonTextContentLeft}>
					{t('volumes.effective_time_begin')}
				</p>
				<div data-test-id="map#editor#volume#info#effective_time_begin" className={styles.sidebarButtonTextContent}>
					<DateInput
						canClearSelection={false}
						minDate={new Date()}
						formatDate={date => date.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
						parseDate={str => new Date(str)}
						placeholder="DD/MM/YYYY"
						value={mapStore.editorOperation.operation_volumes[0].effective_time_begin}
						timePrecision={TimePrecision.MINUTE}
						onChange={value => mapStore.setOperationVolumeInfo(0, 'effective_time_begin', value)}
					/>
				</div>
			</div>
			{/*
			effective_time_end*	string($date-time)
			example: 2015-08-20T14:11:56.118Z
			Latest time the operation will done with the operation volume. It must be greater than effective_time_begin.
			effective_time_begin < effective_time_end MUST be true.
			*/}
			<div className={styles.sidebarButtonText}>
				<p className={styles.sidebarButtonTextContentLeft}>
					{t('volumes.effective_time_end')}
				</p>
				<div data-test-id="map#editor#volume#info#effective_time_end" className={styles.sidebarButtonTextContent}>
					<DateInput
						canClearSelection={false}
						minDate={new Date()}
						formatDate={date => date.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
						parseDate={str => new Date(str)}
						placeholder="DD/MM/YYYY"
						value={mapStore.editorOperation.operation_volumes[0].effective_time_end}
						timePrecision={TimePrecision.MINUTE}
						onChange={value => mapStore.setOperationVolumeInfo(0,'effective_time_end', value)}
					/>
				</div>
			</div>
			{/*
			min_altitude*	in meters. Good luck NASA!
			max_altitude*	in meters
			*/}
			{/* <FormGroup className="rightAreaButtonText" label={t('volume.min_altitude')} labelFor="min_altitude">
				<InputGroup
					id="min_altitude"
					data-test-id="map#editor#volume#info#min_altitude"
					value={info.min_altitude}
					onChange={evt => editInfo('min_altitude', evt.target.value)}
				/>
			</FormGroup> */}
			<FormGroup className={styles.sidebarButtonText} label={t('volumes.max_altitude')} labelFor="max_altitude">
				<InputGroup
					className={styles.sidebarButtonTextContentOverflows}
					id="max_altitude"
					data-test-id="map#editor#volume#info#max_altitude"
					intent={mapStore.editorOperation.operation_volumes[0].max_altitude > 0 ? Intent.NONE : Intent.WARNING}
					value={mapStore.editorOperation.operation_volumes[0].max_altitude}
					onChange={evt => {
						console.log('evt.currentTarget.value', evt.currentTarget.value);
						const value = evt.currentTarget.value !== '' ? parseInt(evt.currentTarget.value) : 0;
						mapStore.setOperationVolumeInfo(0,'max_altitude', value);
					}}
				/>
			</FormGroup>
		</div>
	);
}

export default observer(OperationVolumeInfoEditor);