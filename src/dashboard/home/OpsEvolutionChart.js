import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class OpsEvolutionChart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			options: {
				theme: {
					mode: 'dark',
				},
				chart: {
					background: '#425260',
					foreColor: '#FFFFFF'
				},
				dataLabels: {
					enabled: false
				},
				xaxis: {
					categories: props.categories
				}
			},
			series: [
				{
					name: 'Cant. Operaciones',
					data: props.data
				}
			],
			type: props.type
		};
	}

	render() {
		return (
			<div className="app">
				<div className="row">
					<div className="mixed-chart">
						<Chart
							options={this.state.options}
							series={this.state.series}
							type={this.state.type}
							width="100%"
							height="260"
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default OpsEvolutionChart;