import React from 'react';
import './mainscreen.css';
import OpsEvolutionChart from './OpsEvolutionChart';
import DronesChart from './DronesChart';
import UserRow from './UserRow';
import ValueCard from './ValueCard';

const MainScreen = () => {
	return (
		<>
			<h1>Main Screen</h1>
			<div className="div-container">
				<div className="div-active-ops">
					<ValueCard
						title="Active"
						value="4"
					/>
				</div>
				<div className="div-accepted-ops">
					<ValueCard
						title="Accepted"
						value="5"
					/>
				</div>
				<div className="div-pending-ops">
					<ValueCard
						title="Pending"
						value="1"
					/>
				</div>
				<div className="div-ops-by-month">
					Operations Evolution in the Last 12 Months
                    <OpsEvolutionChart
						categories={['May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr']}
                        data={[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 6]}
                        type="area"
					/>
				</div>
				<div className="div-users">
                    Active Users Last 30 days
					<UserRow
						name="Juan José Cetraro"
						username="jjcetraro"
						quantity="8"
					/>
					<UserRow
						name="Emiliano Alonzo"
						username="emialonzo"
						quantity="6"
					/>
					<UserRow
						name="Matt Betancurt"
						username="mbentancurt"
						quantity="4"
					/>
					<UserRow
						name="Sebastián Macías"
						username="smacias89"
						quantity="4"
					/>
				</div>
				<div className="div-drones">
                    Drones By Manufacturer
					<DronesChart/>
				</div>
				<div className="div-ops-last-week">
                    Operations Last Week
					<OpsEvolutionChart
						categories={['Jue', 'Vie', 'Sab', 'Dom', 'Lun', 'Mar', 'Mie']}
                        data={[0, 0, 0, 0, 1, 0, 3]}
                        type="bar"
					/>
				</div>
			</div>
		</>
	);
}
 
export default MainScreen;