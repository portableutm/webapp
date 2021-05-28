import React, { useState } from 'react';
import { Button, Card, Elevation, Intent, Overlay } from '@blueprintjs/core';


let consentTitle = 'CLAUSULA DE CONSETIMIENTO INFORMADO';

let consentTxtList = ['De conformidad con la ley N° 18.331 de 11 de agosto de 2008, de Protección de Datos Personales y Acción de Habeas Data (LPDP), los datos suministrados a partir del momento de su registro por usted quedarán incorporados a la base de datos del “Sistema UTM” utilizado por la Dirección Nacional  de Aviación Civil e Infraestructura Aeronáutica (DINACIA); la información  será utilizada exclusivamente para la siguiente finalidad: registro, autorización y gestión de vuelo de dispositivos aéreos y aeronaves no tripuladas (Drones)',
	'Los datos personales serán tratados con el grado de protección adecuado, tomándose las medidas de seguridad necesarias para evitar su alteración, pérdida, tratamiento o acceso no autorizado por parte de terceros.',
	'El responsable de la Base de Datos es la DINACIA y la dirección donde podrá ejercer los derechos de acceso, rectificación, actualización, inclusión o supresión es: notripulados@dinacia.gub.uy'
];


export const Consent = () => {
	const [isOpen, setOpen] = useState(false);

	const toggleOverlay = () => {
		setOpen(!isOpen);
	};
	return <div>
		<Button
			style={{ margin: '0px' }}
			intent={Intent.SUCCESS}
			// type="submit"
			// loading={!registrationButtonEnabled}
			// disabled={!registrationButtonEnabled}
			// text={t('common:show_consent')}
			text={'Terminos y condiciones'}
			onClick={toggleOverlay} />
		<Overlay isOpen={isOpen} onClose={toggleOverlay}>
			<Card style={{ margin: '100px' }} elevation={Elevation.ONE}>
				<h3>{consentTitle}</h3>
				{/* <p>{consentTxt}</p> */}
				{consentTxtList.map(text=><p>{text}</p>)}
			</Card>
		</Overlay>
	</div>;
};

// className={styles.window}