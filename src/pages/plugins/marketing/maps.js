import { compose, withProps, withState } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { Circle } from 'react-google-maps'

const Maps = compose(
    withProps({
        /**
         * Note: create and replace your own key in the Google console.
         * https://console.developers.google.com/apis/dashboard
         * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
         */
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places&signed_in=true`,
        loadingElement: <div style={{ height: `100%`, width: `100%` }} />,
        containerElement: (
            <div
                style={{
                    height: `100%`,
                    maxHeight: `650px`,
                    width: `100%`,
                    maxWidth: `100%`,
                }}
            />
        ),
        mapElement: <div style={{ height: `100%`, width: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
)((props) => (
    <GoogleMap defaultZoom={4} defaultCenter={{ lat: 32.7767, lng: -96.797 }}>
        {props.data.map((d, i) => (
            <Marker
                key={i}
                flat={true}
                position={{ lat: d.lat, lng: d.lng }}
                icon={
                    props.loc_det.includes(d.location)
                        ? '/assets/images/markergreen.png'
                        : '/assets/images/marker.png'
                }
                label={{
                    text: d.bidders,
                    color: 'black',
                    background: '#fff',
                    fontSize: '12px',
                    className: 'marker-position',
                }}
                onClick={() => props.getData(d)}
            >
                <Circle
                    key={`circle_${i}`}
                    defaultCenter={{
                        lat: d.lat,
                        lng: d.lng,
                    }}
                    radius={20000}
                    options={{
                        fillColor: props.loc_det.includes(d.location) ? '#b3f374' : '#ffffff8c',
                        fillOpacity: 0.3,
                        strokeColor: '#FFF',
                        strokeWeight: 0,
                    }}
                />
            </Marker>
        ))}
    </GoogleMap>
))

export default Maps
