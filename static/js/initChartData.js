function initChartData() {
	console.log('chart 1');
	var chart = AmCharts.makeChart("chartdiv", {
		"type": "serial",
		"theme": "light",
		"marginRight": 40,
		"marginLeft": 40,
		"autoMarginOffset": 20,
		"dataDateFormat": "YYYY-MM-DD",
		"valueAxes": [{
			"id": "v1",
			"axisAlpha": 0,
			"position": "left",
			"ignoreAxisWidth": true
		}],
		"balloon": {
			"borderThickness": 1,
			"shadowAlpha": 0
		},
		"graphs": [{
			"id": "g1",
			"balloon": {
				"drop": true,
				"adjustBorderColor": false,
				"color": "#ffffff"
			},
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"bulletSize": 5,
			"hideBulletsCount": 50,
			"lineThickness": 2,
			"title": "red line",
			"useLineColorForBulletBorder": true,
			"valueField": "value",
			"balloonText": "<span style='font-size:12px;'>[[value]]</span>"
		}],
		"chartScrollbar": {
			"graph": "g1",
			"oppositeAxis": false,
			"offset": 30,
			"scrollbarHeight": 80,
			"backgroundAlpha": 0,
			"selectedBackgroundAlpha": 0.1,
			"selectedBackgroundColor": "#888888",
			"graphFillAlpha": 0,
			"graphLineAlpha": 0.5,
			"selectedGraphFillAlpha": 0,
			"selectedGraphLineAlpha": 1,
			"autoGridCount": true,
			"color": "#AAAAAA"
		},
		"chartCursor": {
			"pan": true,
			"valueLineEnabled": true,
			"valueLineBalloonEnabled": true,
			"cursorAlpha": 1,
			"cursorColor": "#258cbb",
			"limitToGraph": "g1",
			"valueLineAlpha": 0.2
		},
		"valueScrollbar": {
			"oppositeAxis": false,
			"offset": 50,
			"scrollbarHeight": 10
		},
		"categoryField": "date",
		"categoryAxis": {
			"parseDates": true,
			"dashLength": 1,
			"minorGridEnabled": true
		},
		"export": {
			"enabled": true
		},
		"dataProvider": [{
			"date": "2012-07-27",
			"value": 13
		}, {
			"date": "2012-07-28",
			"value": 11
		}, {
			"date": "2012-07-29",
			"value": 15
		}, {
			"date": "2012-07-30",
			"value": 16
		}, {
			"date": "2012-07-31",
			"value": 18
		}, {
			"date": "2012-08-01",
			"value": 13
		}, {
			"date": "2012-08-02",
			"value": 22
		}, {
			"date": "2012-08-03",
			"value": 23
		}, {
			"date": "2012-08-04",
			"value": 20
		}, {
			"date": "2012-08-05",
			"value": 17
		}, {
			"date": "2012-08-06",
			"value": 16
		}, {
			"date": "2012-08-07",
			"value": 18
		}, {
			"date": "2012-08-08",
			"value": 21
		}, {
			"date": "2012-08-09",
			"value": 26
		}, {
			"date": "2012-08-10",
			"value": 24
		}, {
			"date": "2012-08-11",
			"value": 29
		}, {
			"date": "2012-08-12",
			"value": 32
		}, {
			"date": "2012-08-13",
			"value": 18
		}, {
			"date": "2012-08-14",
			"value": 24
		}, {
			"date": "2012-08-15",
			"value": 22
		}, {
			"date": "2012-08-16",
			"value": 18
		}, {
			"date": "2012-08-17",
			"value": 19
		}, {
			"date": "2012-08-18",
			"value": 14
		}, {
			"date": "2012-08-19",
			"value": 15
		}, {
			"date": "2012-08-20",
			"value": 12
		}, {
			"date": "2012-08-21",
			"value": 8
		}, {
			"date": "2012-08-22",
			"value": 9
		}, {
			"date": "2012-08-23",
			"value": 8
		}, {
			"date": "2012-08-24",
			"value": 7
		}, {
			"date": "2012-08-25",
			"value": 5
		}, {
			"date": "2012-08-26",
			"value": 11
		}, {
			"date": "2012-08-27",
			"value": 13
		}, {
			"date": "2012-08-28",
			"value": 18
		}, {
			"date": "2012-08-29",
			"value": 20
		}, {
			"date": "2012-08-30",
			"value": 29
		}, {
			"date": "2012-08-31",
			"value": 33
		}, {
			"date": "2012-09-01",
			"value": 42
		}, {
			"date": "2012-09-02",
			"value": 35
		}, {
			"date": "2012-09-03",
			"value": 31
		}, {
			"date": "2012-09-04",
			"value": 47
		}, {
			"date": "2012-09-05",
			"value": 52
		}, {
			"date": "2012-09-06",
			"value": 46
		}, {
			"date": "2012-09-07",
			"value": 41
		}, {
			"date": "2012-09-08",
			"value": 43
		}, {
			"date": "2012-09-09",
			"value": 40
		}, {
			"date": "2012-09-10",
			"value": 39
		}, {
			"date": "2012-09-11",
			"value": 34
		}, {
			"date": "2012-09-12",
			"value": 29
		}, {
			"date": "2012-09-13",
			"value": 34
		}, {
			"date": "2012-09-14",
			"value": 37
		}, {
			"date": "2012-09-15",
			"value": 42
		}, {
			"date": "2012-09-16",
			"value": 49
		}, {
			"date": "2012-09-17",
			"value": 46
		}, {
			"date": "2012-09-18",
			"value": 47
		}, {
			"date": "2012-09-19",
			"value": 55
		}, {
			"date": "2012-09-20",
			"value": 59
		}, {
			"date": "2012-09-21",
			"value": 58
		}, {
			"date": "2012-09-22",
			"value": 57
		}, {
			"date": "2012-09-23",
			"value": 61
		}, {
			"date": "2012-09-24",
			"value": 59
		}, {
			"date": "2012-09-25",
			"value": 67
		}, {
			"date": "2012-09-26",
			"value": 65
		}, {
			"date": "2012-09-27",
			"value": 61
		}, {
			"date": "2012-09-28",
			"value": 66
		}, {
			"date": "2012-09-29",
			"value": 69
		}, {
			"date": "2012-09-30",
			"value": 71
		}, {
			"date": "2012-10-01",
			"value": 67
		}, {
			"date": "2012-10-02",
			"value": 63
		}, {
			"date": "2012-10-03",
			"value": 46
		}, {
			"date": "2012-10-04",
			"value": 32
		}, {
			"date": "2012-10-05",
			"value": 21
		}, {
			"date": "2012-10-06",
			"value": 18
		}, {
			"date": "2012-10-07",
			"value": 21
		}, {
			"date": "2012-10-08",
			"value": 28
		}, {
			"date": "2012-10-09",
			"value": 27
		}, {
			"date": "2012-10-10",
			"value": 36
		}, {
			"date": "2012-10-11",
			"value": 33
		}, {
			"date": "2012-10-12",
			"value": 31
		}, {
			"date": "2012-10-13",
			"value": 30
		}, {
			"date": "2012-10-14",
			"value": 34
		}, {
			"date": "2012-10-15",
			"value": 38
		}, {
			"date": "2012-10-16",
			"value": 37
		}, {
			"date": "2012-10-17",
			"value": 44
		}, {
			"date": "2012-10-18",
			"value": 49
		}, {
			"date": "2012-10-19",
			"value": 53
		}, {
			"date": "2012-10-20",
			"value": 57
		}, {
			"date": "2012-10-21",
			"value": 60
		}, {
			"date": "2012-10-22",
			"value": 61
		}, {
			"date": "2012-10-23",
			"value": 69
		}, {
			"date": "2012-10-24",
			"value": 67
		}, {
			"date": "2012-10-25",
			"value": 72
		}, {
			"date": "2012-10-26",
			"value": 77
		}, {
			"date": "2012-10-27",
			"value": 75
		}, {
			"date": "2012-10-28",
			"value": 70
		}, {
			"date": "2012-10-29",
			"value": 72
		}, {
			"date": "2012-10-30",
			"value": 70
		}, {
			"date": "2012-10-31",
			"value": 72
		}, {
			"date": "2012-11-01",
			"value": 73
		}, {
			"date": "2012-11-02",
			"value": 67
		}, {
			"date": "2012-11-03",
			"value": 68
		}, {
			"date": "2012-11-04",
			"value": 65
		}, {
			"date": "2012-11-05",
			"value": 71
		}, {
			"date": "2012-11-06",
			"value": 75
		}, {
			"date": "2012-11-07",
			"value": 74
		}, {
			"date": "2012-11-08",
			"value": 71
		}, {
			"date": "2012-11-09",
			"value": 76
		}, {
			"date": "2012-11-10",
			"value": 77
		}, {
			"date": "2012-11-11",
			"value": 81
		}, {
			"date": "2012-11-12",
			"value": 83
		}, {
			"date": "2012-11-13",
			"value": 80
		}, {
			"date": "2012-11-14",
			"value": 81
		}, {
			"date": "2012-11-15",
			"value": 87
		}, {
			"date": "2012-11-16",
			"value": 82
		}, {
			"date": "2012-11-17",
			"value": 86
		}, {
			"date": "2012-11-18",
			"value": 80
		}, {
			"date": "2012-11-19",
			"value": 87
		}, {
			"date": "2012-11-20",
			"value": 83
		}, {
			"date": "2012-11-21",
			"value": 85
		}, {
			"date": "2012-11-22",
			"value": 84
		}, {
			"date": "2012-11-23",
			"value": 82
		}, {
			"date": "2012-11-24",
			"value": 73
		}, {
			"date": "2012-11-25",
			"value": 71
		}, {
			"date": "2012-11-26",
			"value": 75
		}, {
			"date": "2012-11-27",
			"value": 79
		}, {
			"date": "2012-11-28",
			"value": 70
		}, {
			"date": "2012-11-29",
			"value": 73
		}, {
			"date": "2012-11-30",
			"value": 61
		}, {
			"date": "2012-12-01",
			"value": 62
		}, {
			"date": "2012-12-02",
			"value": 66
		}, {
			"date": "2012-12-03",
			"value": 65
		}, {
			"date": "2012-12-04",
			"value": 73
		}, {
			"date": "2012-12-05",
			"value": 79
		}, {
			"date": "2012-12-06",
			"value": 78
		}, {
			"date": "2012-12-07",
			"value": 78
		}, {
			"date": "2012-12-08",
			"value": 78
		}, {
			"date": "2012-12-09",
			"value": 74
		}, {
			"date": "2012-12-10",
			"value": 73
		}, {
			"date": "2012-12-11",
			"value": 75
		}, {
			"date": "2012-12-12",
			"value": 70
		}, {
			"date": "2012-12-13",
			"value": 77
		}, {
			"date": "2012-12-14",
			"value": 67
		}, {
			"date": "2012-12-15",
			"value": 62
		}, {
			"date": "2012-12-16",
			"value": 64
		}, {
			"date": "2012-12-17",
			"value": 61
		}, {
			"date": "2012-12-18",
			"value": 59
		}, {
			"date": "2012-12-19",
			"value": 53
		}, {
			"date": "2012-12-20",
			"value": 54
		}, {
			"date": "2012-12-21",
			"value": 56
		}, {
			"date": "2012-12-22",
			"value": 59
		}, {
			"date": "2012-12-23",
			"value": 58
		}, {
			"date": "2012-12-24",
			"value": 55
		}, {
			"date": "2012-12-25",
			"value": 52
		}, {
			"date": "2012-12-26",
			"value": 54
		}, {
			"date": "2012-12-27",
			"value": 50
		}, {
			"date": "2012-12-28",
			"value": 50
		}, {
			"date": "2012-12-29",
			"value": 51
		}, {
			"date": "2012-12-30",
			"value": 52
		}, {
			"date": "2012-12-31",
			"value": 58
		}, {
			"date": "2013-01-01",
			"value": 60
		}, {
			"date": "2013-01-02",
			"value": 67
		}, {
			"date": "2013-01-03",
			"value": 64
		}, {
			"date": "2013-01-04",
			"value": 66
		}, {
			"date": "2013-01-05",
			"value": 60
		}, {
			"date": "2013-01-06",
			"value": 63
		}, {
			"date": "2013-01-07",
			"value": 61
		}, {
			"date": "2013-01-08",
			"value": 60
		}, {
			"date": "2013-01-09",
			"value": 65
		}, {
			"date": "2013-01-10",
			"value": 75
		}, {
			"date": "2013-01-11",
			"value": 77
		}, {
			"date": "2013-01-12",
			"value": 78
		}, {
			"date": "2013-01-13",
			"value": 70
		}, {
			"date": "2013-01-14",
			"value": 70
		}, {
			"date": "2013-01-15",
			"value": 73
		}, {
			"date": "2013-01-16",
			"value": 71
		}, {
			"date": "2013-01-17",
			"value": 74
		}, {
			"date": "2013-01-18",
			"value": 78
		}, {
			"date": "2013-01-19",
			"value": 85
		}, {
			"date": "2013-01-20",
			"value": 82
		}, {
			"date": "2013-01-21",
			"value": 83
		}, {
			"date": "2013-01-22",
			"value": 88
		}, {
			"date": "2013-01-23",
			"value": 85
		}, {
			"date": "2013-01-24",
			"value": 85
		}, {
			"date": "2013-01-25",
			"value": 80
		}, {
			"date": "2013-01-26",
			"value": 87
		}, {
			"date": "2013-01-27",
			"value": 84
		}, {
			"date": "2013-01-28",
			"value": 83
		}, {
			"date": "2013-01-29",
			"value": 84
		}, {
			"date": "2013-01-30",
			"value": 81
		}]
	});

	chart.addListener("rendered", zoomChart);

	zoomChart();

	function zoomChart() {
		chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
	}
}


function initChartData2() {
	AmCharts.makeChart("chartdiv2", {
		"type": "pie",
		"labelsEnabled": false,
		"autoMargins": false,
		"marginTop:": 0,
		"marginBottom": 0,
		"marginLeft": 0,
		"marginRight": 0,
		"pullOutRadius": 0,
		"theme": "light",
		"dataProvider": [{
			"network": "Instagram",
			"engagments": 501.9
		}, {
			"network": "Twitter",
			"engagments": 300
		}, {
			"network": "YouTube",
			"engagments": 200
		}, {
			"network": "Tumblr",
			"engagments": 184
		}, {
			"network": "Facebook",
			"engagments": 43
		}],
		"valueField": "engagments",
		"titleField": "network",
		"balloon": {
			"fixedPosition": true
		},
		"colors": ["#04be5b", "#0083d6", "#ff9947", "#d2335c"],
		"export": {
			"enabled": false
		}
	});
}

function initChart() {
	Chart.pluginService.register({
		beforeRender: function(chart) {
			if (chart.config.options.showAllTooltips) {
				// create an array of tooltips
				// we can't use the chart tooltip because there is only one tooltip per chart
				chart.pluginTooltips = [];
				chart.config.data.datasets.forEach(function(dataset, i) {
					chart.getDatasetMeta(i).data.forEach(function(sector, j) {
						chart.pluginTooltips.push(new Chart.Tooltip({
							_chart: chart.chart,
							_chartInstance: chart,
							_data: chart.data,
							_options: chart.options.tooltips,
							_active: [sector]
						}, chart));
					});
				});

				// turn off normal tooltips
				chart.options.tooltips.enabled = false;
			}
		},
		afterDraw: function(chart, easing) {
			if (chart.config.options.showAllTooltips) {
				// we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
				if (!chart.allTooltipsOnce) {
					if (easing !== 1)
						return;
					chart.allTooltipsOnce = true;
				}

				// turn on tooltips
				chart.options.tooltips.enabled = true;
				Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
					tooltip.initialize();
					tooltip.update();
					// we don't actually need this since we are not animating tooltips
					tooltip.pivot();
					tooltip.transition(easing).draw();
				});
				chart.options.tooltips.enabled = false;
			}
		}
	});
}

function getChart(ele, type, data, noLegend) {
	var ctx = document.getElementById(ele).getContext("2d");
	return new Chart(ctx, {
		type: type,
		data: data,
		options: {
			// showAllTooltips: true,
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = data.labels[tooltipItem.index];
						var tooltipData = allData[tooltipItem.index];
						var total = 0;
						for (var i in allData) {
							total += allData[i];
						}
						var tooltipPercentage = Math.round((tooltipData / total) * 100);
						return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
					}
				}
			},
			legend: {
				display: !noLegend
			},
			responsive: true,
			scales: {
				xAxes: [{
					type: "time",
					time: {
						format: 'YYYY-MM-DD',
						// round: 'day'
						tooltipFormat: 'll HH:mm'
					},
					scaleLabel: {
						display: true,
						labelString: 'Date'
					}
				},],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'value'
					}
				}]
			},
		}
	})
}

function gimmeLines() {
	var data = {
		labels: globalData.map(v => new Date(v.date)),
		datasets: [{
			label: 'Performance',
			data: globalData.map(v => v.value),
			fillColor: "rgba(172,194,132,0.4)",
			strokeColor: "#ACC26D",
			pointColor: "#fff",
			pointStrokeColor: "#9DB86D",
			color: "#FFEA88",
		}]
	}
	return new Chart(document.getElementById('chart1').getContext("2d"), {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			scales: {
				xAxes: [{
					type: "time",
					time: {
						format: 'YYYY-MM-DD',
						// round: 'day'
						tooltipFormat: 'll HH:mm'
					},
					scaleLabel: {
						display: true,
						labelString: 'Date'
					},
					ticks: {
						maxRotation: 0
					}
				},],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'value'
					}
				}]
			},
			pan: {
				enabled: true,
				mode: 'y'
			},
			zoom: {
				enabled: true,
				mode: 'x',
				limits: {
					//max: 10,
					min: 0.5
				}
			},
			animate: {
				onComplete: function() {
					var sourceCanvas = this.chart.ctx.canvas;
					// the -5 is so that we don't copy the edges of the line
					var copyWidth = this.scale.xScalePaddingLeft - 5;
					// the +5 is so that the bottommost y axis label is not clipped off
					// we could factor this in using measureText if we wanted to be generic
					var copyHeight = this.scale.endPoint + 5;
					var targetCtx = document.getElementById("chart1-bg").getContext("2d");
					targetCtx.canvas.width = copyWidth;
					targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);
				}
			}
		}
	})
}
function gimmePie() {
	var data = {
		labels: ["Instagram", "Twitter", "YouTube", "Tumblr", "Facebook"],
		datasets: [
			{
				label: "Network",
				backgroundColor: ["#04be5b", "#0083d6", "#ff9947", "#d2335c"],
				data: [501.9, 300, 200, 184, 43]
			}
		]
	}

	return getChart('chart2', 'pie', data, true);
}

var globalData = [
	{
		"date": "2012-07-27",
		"value": 13
	}, {
		"date": "2012-07-28",
		"value": 11
	}, {
		"date": "2012-07-29",
		"value": 15
	}, {
		"date": "2012-07-30",
		"value": 16
	}, {
		"date": "2012-07-31",
		"value": 18
	}, {
		"date": "2012-08-01",
		"value": 13
	}, {
		"date": "2012-08-02",
		"value": 22
	}, {
		"date": "2012-08-03",
		"value": 23
	}, {
		"date": "2012-08-04",
		"value": 20
	}, {
		"date": "2012-08-05",
		"value": 17
	}, {
		"date": "2012-08-06",
		"value": 16
	}, {
		"date": "2012-08-07",
		"value": 18
	}, {
		"date": "2012-08-08",
		"value": 21
	}, {
		"date": "2012-08-09",
		"value": 26
	}, {
		"date": "2012-08-10",
		"value": 24
	}, {
		"date": "2012-08-11",
		"value": 29
	}, {
		"date": "2012-08-12",
		"value": 32
	}, {
		"date": "2012-08-13",
		"value": 18
	}, {
		"date": "2012-08-14",
		"value": 24
	}, {
		"date": "2012-08-15",
		"value": 22
	}, {
		"date": "2012-08-16",
		"value": 18
	}, {
		"date": "2012-08-17",
		"value": 19
	}, {
		"date": "2012-08-18",
		"value": 14
	}, {
		"date": "2012-08-19",
		"value": 15
	}, {
		"date": "2012-08-20",
		"value": 12
	}, {
		"date": "2012-08-21",
		"value": 8
	}, {
		"date": "2012-08-22",
		"value": 9
	}, {
		"date": "2012-08-23",
		"value": 8
	}, {
		"date": "2012-08-24",
		"value": 7
	}, {
		"date": "2012-08-25",
		"value": 5
	}, {
		"date": "2012-08-26",
		"value": 11
	}, {
		"date": "2012-08-27",
		"value": 13
	}, {
		"date": "2012-08-28",
		"value": 18
	}, {
		"date": "2012-08-29",
		"value": 20
	}, {
		"date": "2012-08-30",
		"value": 29
	}, {
		"date": "2012-08-31",
		"value": 33
	}, {
		"date": "2012-09-01",
		"value": 42
	}, {
		"date": "2012-09-02",
		"value": 35
	}, {
		"date": "2012-09-03",
		"value": 31
	}, {
		"date": "2012-09-04",
		"value": 47
	}, {
		"date": "2012-09-05",
		"value": 52
	}, {
		"date": "2012-09-06",
		"value": 46
	}, {
		"date": "2012-09-07",
		"value": 41
	}, {
		"date": "2012-09-08",
		"value": 43
	}, {
		"date": "2012-09-09",
		"value": 40
	}, {
		"date": "2012-09-10",
		"value": 39
	}, {
		"date": "2012-09-11",
		"value": 34
	}, {
		"date": "2012-09-12",
		"value": 29
	}, {
		"date": "2012-09-13",
		"value": 34
	}, {
		"date": "2012-09-14",
		"value": 37
	}, {
		"date": "2012-09-15",
		"value": 42
	}, {
		"date": "2012-09-16",
		"value": 49
	}, {
		"date": "2012-09-17",
		"value": 46
	}, {
		"date": "2012-09-18",
		"value": 47
	}, {
		"date": "2012-09-19",
		"value": 55
	}, {
		"date": "2012-09-20",
		"value": 59
	}, {
		"date": "2012-09-21",
		"value": 58
	}, {
		"date": "2012-09-22",
		"value": 57
	}, {
		"date": "2012-09-23",
		"value": 61
	}, {
		"date": "2012-09-24",
		"value": 59
	}, {
		"date": "2012-09-25",
		"value": 67
	}, {
		"date": "2012-09-26",
		"value": 65
	}, {
		"date": "2012-09-27",
		"value": 61
	}, {
		"date": "2012-09-28",
		"value": 66
	}, {
		"date": "2012-09-29",
		"value": 69
	}, {
		"date": "2012-09-30",
		"value": 71
	}, {
		"date": "2012-10-01",
		"value": 67
	}, {
		"date": "2012-10-02",
		"value": 63
	}, {
		"date": "2012-10-03",
		"value": 46
	}, {
		"date": "2012-10-04",
		"value": 32
	}, {
		"date": "2012-10-05",
		"value": 21
	}, {
		"date": "2012-10-06",
		"value": 18
	}, {
		"date": "2012-10-07",
		"value": 21
	}, {
		"date": "2012-10-08",
		"value": 28
	}, {
		"date": "2012-10-09",
		"value": 27
	}, {
		"date": "2012-10-10",
		"value": 36
	}, {
		"date": "2012-10-11",
		"value": 33
	}, {
		"date": "2012-10-12",
		"value": 31
	}, {
		"date": "2012-10-13",
		"value": 30
	}, {
		"date": "2012-10-14",
		"value": 34
	}, {
		"date": "2012-10-15",
		"value": 38
	}, {
		"date": "2012-10-16",
		"value": 37
	}, {
		"date": "2012-10-17",
		"value": 44
	}, {
		"date": "2012-10-18",
		"value": 49
	}, {
		"date": "2012-10-19",
		"value": 53
	}, {
		"date": "2012-10-20",
		"value": 57
	}, {
		"date": "2012-10-21",
		"value": 60
	}, {
		"date": "2012-10-22",
		"value": 61
	}, {
		"date": "2012-10-23",
		"value": 69
	}, {
		"date": "2012-10-24",
		"value": 67
	}, {
		"date": "2012-10-25",
		"value": 72
	}, {
		"date": "2012-10-26",
		"value": 77
	}, {
		"date": "2012-10-27",
		"value": 75
	}, {
		"date": "2012-10-28",
		"value": 70
	}, {
		"date": "2012-10-29",
		"value": 72
	}, {
		"date": "2012-10-30",
		"value": 70
	}, {
		"date": "2012-10-31",
		"value": 72
	}, {
		"date": "2012-11-01",
		"value": 73
	}, {
		"date": "2012-11-02",
		"value": 67
	}, {
		"date": "2012-11-03",
		"value": 68
	}, {
		"date": "2012-11-04",
		"value": 65
	}, {
		"date": "2012-11-05",
		"value": 71
	}, {
		"date": "2012-11-06",
		"value": 75
	}, {
		"date": "2012-11-07",
		"value": 74
	}, {
		"date": "2012-11-08",
		"value": 71
	}, {
		"date": "2012-11-09",
		"value": 76
	}, {
		"date": "2012-11-10",
		"value": 77
	}, {
		"date": "2012-11-11",
		"value": 81
	}, {
		"date": "2012-11-12",
		"value": 83
	}, {
		"date": "2012-11-13",
		"value": 80
	}, {
		"date": "2012-11-14",
		"value": 81
	}, {
		"date": "2012-11-15",
		"value": 87
	}, {
		"date": "2012-11-16",
		"value": 82
	}, {
		"date": "2012-11-17",
		"value": 86
	}, {
		"date": "2012-11-18",
		"value": 80
	}, {
		"date": "2012-11-19",
		"value": 87
	}, {
		"date": "2012-11-20",
		"value": 83
	}, {
		"date": "2012-11-21",
		"value": 85
	}, {
		"date": "2012-11-22",
		"value": 84
	}, {
		"date": "2012-11-23",
		"value": 82
	}, {
		"date": "2012-11-24",
		"value": 73
	}, {
		"date": "2012-11-25",
		"value": 71
	}, {
		"date": "2012-11-26",
		"value": 75
	}, {
		"date": "2012-11-27",
		"value": 79
	}, {
		"date": "2012-11-28",
		"value": 70
	}, {
		"date": "2012-11-29",
		"value": 73
	}, {
		"date": "2012-11-30",
		"value": 61
	}, {
		"date": "2012-12-01",
		"value": 62
	}, {
		"date": "2012-12-02",
		"value": 66
	}, {
		"date": "2012-12-03",
		"value": 65
	}, {
		"date": "2012-12-04",
		"value": 73
	}, {
		"date": "2012-12-05",
		"value": 79
	}, {
		"date": "2012-12-06",
		"value": 78
	}, {
		"date": "2012-12-07",
		"value": 78
	}, {
		"date": "2012-12-08",
		"value": 78
	}, {
		"date": "2012-12-09",
		"value": 74
	}, {
		"date": "2012-12-10",
		"value": 73
	}, {
		"date": "2012-12-11",
		"value": 75
	}, {
		"date": "2012-12-12",
		"value": 70
	}, {
		"date": "2012-12-13",
		"value": 77
	}, {
		"date": "2012-12-14",
		"value": 67
	}, {
		"date": "2012-12-15",
		"value": 62
	}, {
		"date": "2012-12-16",
		"value": 64
	}, {
		"date": "2012-12-17",
		"value": 61
	}, {
		"date": "2012-12-18",
		"value": 59
	}, {
		"date": "2012-12-19",
		"value": 53
	}, {
		"date": "2012-12-20",
		"value": 54
	}, {
		"date": "2012-12-21",
		"value": 56
	}, {
		"date": "2012-12-22",
		"value": 59
	}, {
		"date": "2012-12-23",
		"value": 58
	}, {
		"date": "2012-12-24",
		"value": 55
	}, {
		"date": "2012-12-25",
		"value": 52
	}, {
		"date": "2012-12-26",
		"value": 54
	}, {
		"date": "2012-12-27",
		"value": 50
	}, {
		"date": "2012-12-28",
		"value": 50
	}, {
		"date": "2012-12-29",
		"value": 51
	}, {
		"date": "2012-12-30",
		"value": 52
	}, {
		"date": "2012-12-31",
		"value": 58
	}, {
		"date": "2013-01-01",
		"value": 60
	}, {
		"date": "2013-01-02",
		"value": 67
	}, {
		"date": "2013-01-03",
		"value": 64
	}, {
		"date": "2013-01-04",
		"value": 66
	}, {
		"date": "2013-01-05",
		"value": 60
	}, {
		"date": "2013-01-06",
		"value": 63
	}, {
		"date": "2013-01-07",
		"value": 61
	}, {
		"date": "2013-01-08",
		"value": 60
	}, {
		"date": "2013-01-09",
		"value": 65
	}, {
		"date": "2013-01-10",
		"value": 75
	}, {
		"date": "2013-01-11",
		"value": 77
	}, {
		"date": "2013-01-12",
		"value": 78
	}, {
		"date": "2013-01-13",
		"value": 70
	}, {
		"date": "2013-01-14",
		"value": 70
	}, {
		"date": "2013-01-15",
		"value": 73
	}, {
		"date": "2013-01-16",
		"value": 71
	}, {
		"date": "2013-01-17",
		"value": 74
	}, {
		"date": "2013-01-18",
		"value": 78
	}, {
		"date": "2013-01-19",
		"value": 85
	}, {
		"date": "2013-01-20",
		"value": 82
	}, {
		"date": "2013-01-21",
		"value": 83
	}, {
		"date": "2013-01-22",
		"value": 88
	}, {
		"date": "2013-01-23",
		"value": 85
	}, {
		"date": "2013-01-24",
		"value": 85
	}, {
		"date": "2013-01-25",
		"value": 80
	}, {
		"date": "2013-01-26",
		"value": 87
	}, {
		"date": "2013-01-27",
		"value": 84
	}, {
		"date": "2013-01-28",
		"value": 83
	}, {
		"date": "2013-01-29",
		"value": 84
	}, {
		"date": "2013-01-30",
		"value": 81
	}
]
