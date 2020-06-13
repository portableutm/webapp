import React, {useState} from 'react';
import {Alignment, Button, Checkbox, Dialog, Divider, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import S from 'sanctuary';
import {DateInput, DatePicker, TimePicker, TimePrecision} from '@blueprintjs/datetime';
import {useTranslation} from 'react-i18next';

function OperationVolumeInfoEditor(props) {
	const { t,  } = useTranslation();
	const [beginCalendarOpen, setBeginCalendarOpen] = useState(false);
	const [endCalendarOpen, setEndCalendarOpen] = useState(false);
	const {info, setInfo} = props;
	const editInfo = (property, newValue) =>
		setInfo(volume => {
			const newVolume = {...volume};
			newVolume[property] = newValue;
			return newVolume;
		});
	return (
		<div>
			{/* title={t('editor.volume.editingvolume_count', {count: S.maybeToNullable(opVolumeIndex)})} */}
			{/*
			near_structure	boolean
			Is this operation volume within 400' of a structure?
			*/}
			<div className="rightAreaButtonText">
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
			</div>
			{/*
			beyond_visual_line_of_sight*	boolean
			x-utm-data-accessibility: OPERATIONAL
			Describes whether any portion of the operation volume is beyond the visual line of sight of the RPIC.
			*/}
			<div className="rightAreaButtonText">
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
			</div>
			{/*
				effective_time_begin*	string($date-time)
				example: 2015-08-20T14:11:56.118Z
				Earliest time the operation will use the operation volume. It must be less than effective_time_end.
				effective_time_begin < effective_time_end MUST be true.
				*/}
			<div className="rightAreaButtonText">
				<p className="centerHorizontally">
					{t('volume.effective_time_begin')}
				</p>
				<DateInput
					data-test-id="map#editor#volume#info#effective_time_begin"
					formatDate={date => date.toLocaleString()}
					parseDate={str => new Date(str)}
					placeholder="DD/MM/YYYY"
					value={info.effective_time_begin}
					timePrecision={TimePrecision.SECOND}
					onChange={value => editInfo('effective_time_begin', value)}
				/>
			</div>
			{/*
			effective_time_end*	string($date-time)
			example: 2015-08-20T14:11:56.118Z
			Latest time the operation will done with the operation volume. It must be greater than effective_time_begin.
			effective_time_begin < effective_time_end MUST be true.
			*/}
			<div className="rightAreaButtonText">
				<p className="centerHorizontally">
					{t('volume.effective_time_end')}
				</p>
				<DateInput
					data-test-id="map#editor#volume#info#effective_time_end"
					formatDate={date => date.toLocaleString()}
					parseDate={str => new Date(str)}
					placeholder="DD/MM/YYYY"
					value={info.effective_time_end}
					timePrecision={TimePrecision.SECOND}
					onChange={value => editInfo('effective_time_end', value)}
				/>
			</div>
			{/*
			min_altitude*	in meters. Good luck NASA!
			max_altitude*	in meters
			*/}
			<FormGroup className="rightAreaButtonText" label={t('volume.min_altitude')} labelFor="min_altitude">
				<InputGroup
					id="min_altitude"
					data-test-id="mapEditorVolumeInfoMinAltitude"
					value={info.min_altitude}
					onChange={evt => editInfo('min_altitude', evt.target.value)}
				/>
			</FormGroup>
			<FormGroup className="rightAreaButtonText" label={t('volume.max_altitude')} labelFor="max_altitude">
				<InputGroup
					id="max_altitude"
					data-test-id="map#editor#volume#info#max_altitude"
					value={info.max_altitude}
					onChange={evt => editInfo('max_altitude', evt.target.value)}
				/>
			</FormGroup>
		</div>
	);
}

export default OperationVolumeInfoEditor;