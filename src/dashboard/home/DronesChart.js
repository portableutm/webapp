import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class DronesChart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			options: {
                labels: ['DJI', 'Parrot', '3DR', 'Other'],
				dataLabels: {
					enabled: false
				},
				chart: {
					type: 'donut',
					background: '#425260',
					foreColor: '#FFFFFF'
				},
				responsive: [{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}]
			},
            series: [6, 2, 1, 1]
		};
	}

	render() {
		return (
			<div id="chart">
				<ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
			</div>
		);
	}
}

export default DronesChart;