import { ResponsivePie } from '@nivo/pie'

function Chart(props) {
    const pieData = [
        {
            id: 'blue',
            label: 'Registered but Credit card not validated',
            value: props.data?.blue,
            color: '#4091E2',
        },
        {
            id: 'yellow',
            label: 'Third Party Marketing Users',
            value: props.data?.yellow,
            color: '#F1E156',
        },
        {
            id: 'orange',
            label: 'Registered and Credit card validated',
            value: props.data?.orange,
            color: '#F29130',
        },
        {
            id: 'green',
            label: 'Paid Users',
            value: props.data?.green,
            color: '#40E286',
        },
    ]
    return (
        <div className="chart">
            {props.data ? (
                <ResponsivePie
                    data={pieData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    colors={pieData.map((d) => d.color)}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLinkLabel="label"
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    enableArcLinkLabels={false}
                    arcLabels="label"
                    tooltip={(point) => {
                        return (
                            <div className="chartTooltip">
                                <p>
                                    <span style={{ background: point['datum']['color'] }}></span>
                                    {point['datum']['label']}
                                </p>
                            </div>
                        )
                    }}
                    legends={[
                        {
                            data: pieData.map((item) => {
                                return {
                                    label: item.value,
                                    color: item.color,
                                }
                            }),
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 40,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            ) : (
                // <div className="noChartData">
                //   <h5>Select a location from the map (or) dropdown to view the data</h5>
                // </div>
                ''
            )}
        </div>
    )
}

export default Chart
