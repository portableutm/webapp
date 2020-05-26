/* istanbul ignore file */

import React, {useState} from 'react';
import { InputGroup, H4, Button, RadioGroup, Radio } from '@blueprintjs/core';

function Simulator() {
	const [message, setMessage] = useState({
		message_id: 'CHANGE_ME',
		uss_name: 'DronfiesAdes',
		time_sent: '2015-08-20T14:11:56.118Z',
		severity: 'INFORMATIONAL',
		message_type: 'OTHER_SEE_FREE_TEXT',
		free_text: 'Text',
		callback: 'http://localhost'
	});

	return (
		<div className="simulator">
			<H4>Send UTMMessage</H4>
			<InputGroup
				large
				placeholder="message_id"
				onChange={(evt) => {
					const {value} = evt.target;
					setMessage((message) => {let newMsg = {...message}; newMsg.message_id = value; return newMsg;});
				}}
			/>
			<InputGroup
				large
				placeholder="free_text"
				onChange={(evt) => {
					const {value} = evt.target;
					setMessage((message) => {let newMsg = {...message}; newMsg.free_text = value; return newMsg;});
				}}
			/>
			<RadioGroup
				label="severity"
				onChange={(evt) => {
					const {value} = evt.currentTarget;
					setMessage((message) => {let newMsg = {...message}; newMsg.severity = value; return newMsg;});
				}}
				selectedValue={message.severity}
			>
				<Radio label="EMERGENCY
                There is an immediate impact to the safety of other air operations,
                the safety of people, or the safety of structures on the ground.
                Actions to mitigate required by other operations." value="EMERGENCY" />
				<Radio label="ALERT
                There may be an impact to the safety of other air operations, the
                safety of people, or the safety of structures on the ground. Actions to
                mitigate required by other operations." value="ALERT" />
				<Radio label="CRITICAL
                Without mitigations by the affected operation, the situation may rise to
                an emergency in the near future." value="CRITICAL" />
				<Radio label="WARNING
                There is a contained issue that may result in the loss of aircraft. No
                immediate or likely effect to other operations, people on the ground,
                or structures." value="WARNING" />
				<Radio label="NOTICE
                This issue is provided for situational awareness. Planning by operators
                and USSs may be affected." value="NOTICE" />
				<Radio label="INFORMATIONAL
                This issue is provided for situational awareness." value="INFORMATIONAL" />
			</RadioGroup>
			<Button intent="success" text="Send" onClick={() => {
				message.time_sent = (new Date()).toLocaleTimeString();
				const bc = new BroadcastChannel('simulator');
				bc.postMessage(message);
			}}/>
			<Button intent="danger" text="Clear Local Storage" onClick={() => {
				localStorage.clear();
			}}/>
		</div>
	);
}

export default Simulator;