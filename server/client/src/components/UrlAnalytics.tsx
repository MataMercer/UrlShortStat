import React from 'react';
import { Col, Row, Button, Container } from 'reactstrap';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import axios from 'axios';
import config from '../config/config';
import { AppActions } from '../types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../store';
import { Analytics } from '../types/Url';
axios.defaults.withCredentials = true;
var moment = require('moment');
var momentTz = require('moment-timezone');

type UrlAnalyticsProps = {
	code: string;
	timeSpan: string;
	unitsBackInTime: number;
	isOpen: boolean;
};

type UrlAnalyticsState = {
	loading: boolean;
	chart?: Chart;
	totalVisitCount: number;
	timeSpanVisitCount: number;
	visitGrowth: number;
};

type Props = UrlAnalyticsProps & LinkDispatchProps & LinkStateProp;
class UrlAnalytics extends React.Component<Props, UrlAnalyticsState> {
	chartRef: React.RefObject<HTMLCanvasElement> = React.createRef();

	state: UrlAnalyticsState = {
		loading: false,
		chart: undefined,
		timeSpanVisitCount: 0,
		totalVisitCount: 0,
		visitGrowth: 0,
	};

	getAnalytics(unitsBackInTime: number): Promise<Analytics | null> {
		const body = {
			code: this.props.code,
			timeSpan: this.props.timeSpan,
			unitsBackInTime: unitsBackInTime,
			timeSpanVisitCount: 0,
			totalVisitCount: 0,
			userTimeZone: momentTz.tz.guess()
		};
		return axios
			.post(config.serverUrl + '/api/url/analytics/', body)
			.then(res => {
				console.log(res.data);
				// this.setState({loading: false});

				//change the format of the response to match the format for plotting on chartjs
				let dataPointsRes = res.data.dataPoints;
				let dataPoints: { [key: string]: number } = {};

				//fill data with 0s
				let lowerBoundDate = null;
				let upperBoundDate = null;
				let format = null;
				const currentDate = new Date();
				let date = null;
				switch (this.props.timeSpan) {
					case 'month':
						lowerBoundDate = new Date(
							currentDate.getFullYear(),
							currentDate.getMonth() - unitsBackInTime,
							1
						); // first dday of month
						upperBoundDate = new Date(
							currentDate.getFullYear(),
							currentDate.getMonth() - unitsBackInTime + 1,
							0
						); //first of next month
						format = 'MM/DD/YYYY';
						date = new Date(
							upperBoundDate.getFullYear(),
							upperBoundDate.getMonth(),
							upperBoundDate.getDate()
						);
						for (let i = 0; date > lowerBoundDate; i++) {
							date = new Date(
								upperBoundDate.getFullYear(),
								upperBoundDate.getMonth(),
								upperBoundDate.getDate() - i
							);
							const formattedDate = moment(date)
								.format(format)
								.toString();

							if (!(formattedDate in dataPointsRes)) {
								dataPoints[formattedDate] = 0;
							} else {
								dataPoints[formattedDate] = dataPointsRes[formattedDate];
							}
						}

						break;
					case 'year':
						lowerBoundDate = new Date(
							currentDate.getFullYear() - unitsBackInTime,
							0,
							1
						);
						upperBoundDate = new Date(
							currentDate.getFullYear() + 1 - unitsBackInTime,
							0,
							0
						);
						//even though the units is by month, chartjs wants the day to be included for some reason. chartjs will not read MM/YYYY, only MM/DD/YYYY.
						format = 'MM/DD/YYYY';
						date = new Date(
							upperBoundDate.getFullYear(),
							upperBoundDate.getMonth()
						);
						for (let i = 0; date > lowerBoundDate; i++) {
							date = new Date(
								upperBoundDate.getFullYear(),
								upperBoundDate.getMonth() - i
							);
							const formattedDate = moment(date)
								.format(format)
								.toString();
							//the server still goes by this format in its response. MM/YYYY
							const resFormattedDate = moment(date)
								.format('MM/YYYY')
								.toString();
							if (!(resFormattedDate in dataPointsRes)) {
								dataPoints[formattedDate] = 0;
							} else {
								dataPoints[formattedDate] = dataPointsRes[resFormattedDate];
							}
						}

						break;
					default:
						//last 30 days
						upperBoundDate = new Date(
							currentDate.getFullYear(),
							currentDate.getMonth(),
							currentDate.getDate() - 30 * unitsBackInTime
						);
						lowerBoundDate = new Date(
							currentDate.getFullYear(),
							currentDate.getMonth(),
							currentDate.getDate() - 30 * (unitsBackInTime + 1)
						);
						format = 'MM/DD/YYYY';

						for (let i = 0; i < 30; i++) {
							const date = new Date(
								upperBoundDate.getFullYear(),
								upperBoundDate.getMonth(),
								upperBoundDate.getDate() - i
							);
							const formattedDate = moment(date)
								.format(format)
								.toString();

							if (!(formattedDate in dataPointsRes)) {
								dataPoints[formattedDate] = 0;
							} else {
								dataPoints[formattedDate] = dataPointsRes[formattedDate];
							}
						}
				}

				//tightly couple the dates with number of visits so order will be preserved.
				let data = [];
				for (let key in dataPoints) {
					data.push({
						x: key,
						y: dataPoints[key],
					});
				}

				//javascript doesn't guarantee ordered elements for all browsers in objects. We need to make sure its in order bc we derived this data from an object.
				data = data.sort((a, b) => {
					return new Date(a.x) > new Date(b.x) ? 1 : -1;
				});

				const analyticsResult: Analytics = {
					data,
					totalVisitCount: res.data.totalVisitCount,
					timeSpanVisitCount: res.data.timeSpanVisitCount,
				};

				return analyticsResult;
			})
			.catch(error => {
				console.log(error.response);
				return null;
			});
	}

	getXAxisLabel(): string {
		switch (this.props.timeSpan) {
			case 'month':
				return 'Days';
			case 'year':
				return 'Months';
			default:
				return 'Days';
		}
	}

	getUnits(): 'day' | 'month' {
		switch (this.props.timeSpan) {
			case 'month':
				return 'day';
			case 'year':
				return 'month';
			default:
				return 'day';
		}
	}

	initChart(): void {
		const myChartRef = this.chartRef.current!.getContext(
			'2d'
		) as CanvasRenderingContext2D;

		// var color = Chart.helpers.color;
		const lineColor = '#69cfff';
		const config: Chart.ChartConfiguration = {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Visits',
						backgroundColor: lineColor,
						borderColor: lineColor,
						fill: false,
						data: [],
					},
				],
			},
			options: {
				maintainAspectRatio: false,
				scales: {
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: this.getXAxisLabel(),
							},
						},
					],
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: 'Number of Visits',
							},
							ticks: {
								beginAtZero: true,
							},
						},
					],
				},
			},
		};
		this.setState({ chart: new Chart(myChartRef, config) });
	}

	getLabels(analytics: Analytics, analyticsPrev: Analytics): string[] {
		let labelList: string[] = [];
		for (
			let i = 0;
			i < analytics.data.length || i < analyticsPrev.data.length;
			i++
		) {
			labelList.push(
				`${i < analytics.data.length ? analytics.data[i].x : ''};${
					i < analyticsPrev.data.length ? analyticsPrev.data[i].x : ''
				}`
			);
		}

		return labelList;
	}

	getYData(analytics: Analytics): number[] {
		let yList: number[] = [];
		for (let i = 0; i < analytics.data.length; i++) {
			yList.push(analytics.data[i].y);
		}
		return yList;
	}

	async updateData(): Promise<void> {
		if (!this.state.chart) {
			return;
		}

		const analytics = await this.getAnalytics(this.props.unitsBackInTime);
		if (!analytics) {
			return;
		}

		const analyticsPrev = await this.getAnalytics(
			this.props.unitsBackInTime + 1
		);
		if (!analyticsPrev) {
			return;
		}

		// console.log(analytics);
		// this.state.chart.data.datasets.forEach((dataset:Chart.ChartDataSets) => {
		//     dataset.data.pop();
		//     dataset.data = analytics.data;
		// });

		this.state.chart.data.labels = this.getLabels(analytics, analyticsPrev);
		const dateFormat =
			this.props.timeSpan === 'year' ? 'MMM YYYY' : 'MMM DD, YYYY';
		this.state.chart.options.scales = {
			xAxes: [
				{
					id: 'x-axis-1',
					position: 'bottom',
					scaleLabel: {
						display: true,
						labelString: this.getXAxisLabel(),
					},
					ticks: {
						callback: function(label) {
							return moment(new Date(label.split(';')[0])).format(dateFormat);
						},
					},
				},
				{
					id: 'x-axis-2',
					position: 'top',
					scaleLabel: {
						display: true,
						labelString: this.getXAxisLabel(),
					},
					ticks: {
						callback: function(label) {
							return moment(new Date(label.split(';')[1])).format(dateFormat);
						},
					},
				},
			],
			yAxes: [
				{
					id: 'y-axis-1',
					scaleLabel: {
						display: true,
						labelString: 'Number of Visits',
					},
					ticks: {
						beginAtZero: true,
					},
				},
			],
		};

		const lineColorCurrent = '#69cfff';
		const lineColorPrev = '#f54242';
		this.state.chart.data.datasets = [
			{
				xAxisID: 'x-axis-1',
				yAxisID: 'y-axis-1',
				label: 'This Time Period',
				backgroundColor: lineColorCurrent,
				borderColor: lineColorCurrent,
				fill: false,
				data: this.getYData(analytics),
			},
			{
				xAxisID: 'x-axis-2',
				yAxisID: 'y-axis-1',
				label: 'Last Time Period',
				backgroundColor: lineColorPrev,
				borderColor: lineColorPrev,
				fill: false,
				data: this.getYData(analyticsPrev),
			},
		];

		const growthPercent =
			((analytics.timeSpanVisitCount - analyticsPrev.timeSpanVisitCount) /
				(analytics.timeSpanVisitCount + analyticsPrev.timeSpanVisitCount)) *
			100;

		this.state.chart.update();
		this.setState({
			timeSpanVisitCount: analytics.timeSpanVisitCount,
			totalVisitCount: analytics.totalVisitCount,
			visitGrowth: Number.isNaN(growthPercent) ? 0 : growthPercent,
		});
	}

	componentDidMount() {
		this.initChart();
	}

	async componentDidUpdate(
		prevProps: UrlAnalyticsProps,
		prevState: UrlAnalyticsState
	) {
		if (
			(this.props.isOpen !== prevProps.isOpen && this.props.isOpen === true) ||
			this.props.timeSpan !== prevProps.timeSpan ||
			this.props.unitsBackInTime !== prevProps.unitsBackInTime
		) {
			this.updateData();
		}
	}

	onClickRefresh() {
		this.updateData();
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<Row>
							<Button size="sm" onClick={this.onClickRefresh.bind(this)}>
								<i className="fas fa-sync"></i>
							</Button>
						</Row>

						<Row>
							<Col>
								<div
									onClick={e => {
										e.stopPropagation();
									}}
								>
									<canvas id="myChart" ref={this.chartRef} />
								</div>
							</Col>
						</Row>
					</Col>
				</Row>

				<Row>
					<Col>
						<Row>
							<h4>{this.state.totalVisitCount}</h4>
						</Row>
						<Row>Total visits</Row>
					</Col>
					<Col>
						<Row>
							<h4>{this.state.timeSpanVisitCount}</h4>
						</Row>
						<Row>
							Visits this{' '}
							{' ' +
								(this.props.timeSpan === 'last30days'
									? '30 Day Period'
									: this.props.timeSpan)}
						</Row>
					</Col>
					<Col>
						<Row>
							<h4>
								{this.state.visitGrowth}%
								{this.state.visitGrowth !== 0 ? (this.state.visitGrowth > 0 ? (
									<i className="fas fa-long-arrow-alt-up arrow-green"></i>
								) : (
									<i className="fas fa-long-arrow-alt-down arrow-red"></i>
								)) : ''}
							</h4>
						</Row>
						<Row>Growth Over Previous Period</Row>
					</Col>
				</Row>
			</Container>
		);
	}
}

interface LinkStateProp {
	loading: boolean;
}

interface LinkDispatchProps {}

const mapStateToProps = (
	state: AppState,
	ownProps: UrlAnalyticsProps
): LinkStateProp => ({
	loading: state.url.loading,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: UrlAnalyticsProps
): LinkDispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UrlAnalytics);
