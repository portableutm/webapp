import React, {useState} from 'react';
import {Alignment, Button, Checkbox, Dialog, Divider, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import S from 'sanctuary';
import {DatePicker, TimePrecision} from '@blueprintjs/datetime';
import {useTranslation} from 'react-i18next';

function OperationVolumeInfoEditor(props) {
	const { t,  } = useTranslation();
	const [beginCalendarOpen, setBeginCalendarOpen] = useState(false);
	const [endCalendarOpen, setEndCalendarOpen] = useState(false);
	const {info, setInfo, opVolumeIndex, setOpVolumeIndex} = props;
	const editInfo = (property, newValue) =>
		setInfo(volume => {
			const newVolume = {...volume};
			newVolume[property] = newValue;
			return newVolume;
		});
	return (
		<Dialog
			title={t('editor_vinfo_editingvolume') + ' ' + S.maybeToNullable(opVolumeIndex)}
			canEscapeKeyClose={true}
			canOutsideClickClose={true}
			onClose={() => setOpVolumeIndex(S.Maybe.Nothing)}
			isOpen={!S.isNothing(opVolumeIndex)}
		>
			{/* Dialog for editing properties of Operation */}
			<div style={{padding: '10px'}}>
				{/*
            near_structure	boolean
            Is this operation volume within 400' of a structure?
            */}
				<Checkbox
					checked={info.near_structure}
					alignIndicator={Alignment.RIGHT}
					data-test-id="map#editor#volume#info#near_structure"
					onChange={change =>
						editInfo('near_structure', change.currentTarget.checked)
					}
				>
					{t('editor_vinfo_nearstructure')}
				</Checkbox>
				{/*
            beyond_visual_line_of_sight*	boolean
            x-utm-data-accessibility: OPERATIONAL
            Describes whether any portion of the operation volume is beyond the visual line of sight of the RPIC.
            */}
				<Checkbox
					checked={info.beyond_visual_line_of_sight}
					alignIndicator={Alignment.RIGHT}
					data-test-id="map#editor#volume#info#bvlos"
					onChange={change =>
						editInfo(
							'beyond_visual_line_of_sight',
							change.currentTarget.checked
						)
					}
				>
					{t('editor_vinfo_bvlos')}
				</Checkbox>
				<Divider/>
				{/*
                    effective_time_begin*	string($date-time)
                    example: 2015-08-20T14:11:56.118Z
                    Earliest time the operation will use the operation volume. It must be less than effective_time_end.
                    effective_time_begin < effective_time_end MUST be true.
                    */}
				{t('editor_vinfo_effectivetimebegin')} <br/>
				{beginCalendarOpen && (
					<DatePicker
						className="centerHorizontally"
						id="effective_time_begin"
						minDate={new Date()}
						value={info.effective_time_begin}
						onChange={value => editInfo('effective_time_begin', value)}
						timePrecision={TimePrecision.MILLISECOND}
					/>
				)}
				<Button
					fill={true}
					data-test-id="map#editor#volume#info#effective_time_begin"
					intent={Intent.PRIMARY}
					text={!beginCalendarOpen ? t('editor_vinfo_selecttime') : t('editor_vinfo_closecalendar')}
					onClick={() => setBeginCalendarOpen(current => !current)}
				/>
				<Divider/>
				{/*
            effective_time_end*	string($date-time)
            example: 2015-08-20T14:11:56.118Z
            Latest time the operation will done with the operation volume. It must be greater than effective_time_begin.
            effective_time_begin < effective_time_end MUST be true.
            */}
				{t('editor_vinfo_effectivetimeend')} <br/>
				{endCalendarOpen && (
					<DatePicker
						className="centerHorizontally"
						id="effective_time_end"
						minDate={new Date()}
						value={info.effective_time_end}
						timePrecision={TimePrecision.MILLISECOND}
					/>
				)}
				<Button
					fill={true}
					data-test-id="map#editor#volume#info#effective_time_end"
					intent={Intent.PRIMARY}
					text={!endCalendarOpen ? t('editor_vinfo_selecttime') : t('editor_vinfo_closecalendar')}
					onClick={() => setEndCalendarOpen(current => !current)}
				/>
				<Divider/>
				{/*
            min_altitude*	in feet 30mt = 98.4252 | 60mt = 196.85 | 120mt = 393.701
            max_altitude*	in feet
            */}
				<FormGroup label={t('editor_vinfo_minaltitude')} labelFor="min_altitude">
					<InputGroup
						id="min_altitude"
						data-test-id="mapEditorVolumeInfoMinAltitude"
						value={info.min_altitude}
						onChange={evt => editInfo('min_altitude', evt.target.value)}
					/>
				</FormGroup>
				<FormGroup label={t('editor_vinfo_maxaltitude')} labelFor="max_altitude">
					<InputGroup
						id="max_altitude"
						data-test-id="map#editor#volume#info#max_altitude"
						value={info.max_altitude}
						onChange={evt => editInfo('max_altitude', evt.target.value)}
					/>
				</FormGroup>
			</div>
		</Dialog>
	);
}

export default OperationVolumeInfoEditor;