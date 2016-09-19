function initChartData(data) {
	'use strict';
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
		"dataProvider": data,
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
