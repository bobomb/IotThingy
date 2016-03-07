var rawSensorData
var formattedSensorData = [];
var sensorId = -1;
$.getJSON("data/sensor/1", function (data) {
  rawSensorData = data;
  if(rawSensorData.length > 0)
    sensorId = rawSensorData[0]['sensor_id']
  
  $.each(data, function (index, entry) {
    //$(".derp").append('<br>' + entry['temperature']);
      var milliseconds = new Date(entry['timestamp']).getTime();
      //highcarts requires dates in millisecond form
      formattedSensorData.push([milliseconds, entry['temperature']]);
  });


  $('#container').highcharts({
    chart: {
      zoomType: 'x'
    },
    title: {
      text: 'Temperature of sensor ' + sensorId
    },
    subtitle: {
      text: document.ontouchstart === undefined ?
        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
    },
    xAxis: {
      type: 'datetime',
      range: 1000 * 60 * 60 * 6 // see the jlast 6 hours
    },
    yAxis: {
      title: {
        text: 'Temperarture (degrees F)'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    series: [{
      type: 'area',
      name: 'Temperature',
      data: formattedSensorData
    }]
  });
});