import React, {useEffect, useRef, useState} from 'react';
import './Map.scss';
import firebase from '../../db/firebase';
import 'firebase/firestore';
import { loadMapApi } from "../../utils/GoogleMapsUtils";

interface IMap {
  mapType: google.maps.MapTypeId;
  mapTypeControl?: boolean;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false}) => {

  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();

  const startMap = (): void => {
    if (!map) {
      defaultMapStart();
    }
  };
  useEffect(startMap, [map]);

  const defaultMapStart = (): void => {
    const defaultAddress = new google.maps.LatLng(47.608013, -122.335167);
    initMap(11, defaultAddress);
  };

  const initMap = (zoomLevel: number, address: GoogleLatLng): void => {
    if (ref.current) {
      setMap( 
        new google.maps.Map(ref.current, {
          zoom: zoomLevel,
          center: address,
          mapTypeControl: mapTypeControl,
          streetViewControl: false,
          rotateControl: false,
          scaleControl: true,
          fullscreenControl: false,
          panControl: false,
          zoomControl: true,
          gestureHandling: 'cooperative',
          mapTypeId: mapType,
          draggableCursor: 'pointer',
        })
      )
      // const latLng = new google.maps.LatLng(47.608013, -122.335167)

      // const marker = 
      //   new google.maps.Marker({
      //     position: latLng,
      //     map: map,
      //     animation: google.maps.Animation.DROP,
      // });

  



    // var geocoder = new google.maps.Geocoder();

    // const address = 'Seattle, WA';

    // geocoder.geocode( { 'address': address}, function(results, status) {
    //   if (status == 'OK') {
    //     map.setCenter(results[0].geometry.location);
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: results[0].geometry.location
    //     });
    //   } else {
    //     alert('Geocode was not successful for the following reason: ' + status);
    //   }
    // });
    }
  };

  var timer:number = 10;
  var markers:any = [];

  function clearMarkers(del:any) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    if(del === true){
        markers = [];
    }
  }

//   function toastDown(count) {
//     setTimeout(function () {
//         var toast = doc.getElementById("toast");
//         toast.classList.remove("mdl-snackbar--active");
//         toast.setAttribute('aria-hidden', 'true');
//     }, timer * count);
// }
const [scriptLoaded, setScriptLoaded] = useState(false);

useEffect(() => {
  const googleMapScript = loadMapApi();
  googleMapScript.addEventListener('load', function () {
    setScriptLoaded(true);
  });
}, []);

// const [buildings, setBuildings] = useState([] as any);
// const [loading, setLoading] = useState(false);

// const refB = firebase.firestore().collection("buildings");

// function getBuildings() {
//   setLoading(true);
//   refB.onSnapshot((querySnapshot) => {
//     const items: Array<object> = [];
//     querySnapshot.forEach((doc) => {
//         items.push(doc.data());
//     });
//     setBuildings(items)
//     setLoading(false)
//   });
// }

// useEffect(() => {
//     getBuildings();
// }, []);

// if (loading) {
//     return <h1>loading...</h1>;
// }

const sites = [{latitude: 47.482880, longitude: -122.217064 }, 
  {latitude: 47.608013, longitude: -125.335167 }, {latitude: 47.608013, longitude: -122.335167 }]

drop(sites)

// marker.setMap(map);


  function drop(filteredMeetings:any) {
    // clearMarkers(true);
    for (var i = 0; i < filteredMeetings.length; i++) {
        //drop toast once markers all dropped
        // if(i == filteredMeetings.length - 1) {
            // toastDown(i);
        // } 
        addMarkerWithTimeout(filteredMeetings[i], i * timer);
    }
}

function addMarkerWithTimeout (site:any, timeout:number){
  // function addMarkerWithTimeout (site:any, timeout:any){
  var dropTimer = window.setTimeout(function() {
      // meetingBadgesUp(site);
      // var p = new google.maps.LatLng(47.608013, -122.335167);
      var p = new google.maps.LatLng(site.latitude, site.longitude);
      // var boolAm = false;
      // var boolNoon = false;
      // var boolPm = false;
      // var infoContent = '<span class="bold caps">' + site.val().name + 
      //         '<br>' + site.val().hour + site.val().min + ' ' + site.val().timeframe + '</span><br><span class="cap">' +
      //         '<a href="http://maps.google.com/?q=' + site.val().street + ' ' + site.val().city + ' ' + site.val().state + 
      //         ' ' + site.val().zip + '">' + site.val().street + '<br>' + site.val().city + ', ' + site.val().state + 
      //         '  ' + site.val().zip + '</a><br>' + site.val().siteNotes + '</span>';
      // switch(site.val().timeframe) {
      //     case 'am':
      //         boolAm = true;
      //         break;
      //     case 'noon':
      //         boolNoon = true;
      //         break;
      //     case 'pm':
      //         boolPm = true;
      //         break;
      // }
      var marker = new google.maps.Marker({
          position: p,
          map: map,
          // day: site.val().day,
          // meetingOpen: site.val().meetingOpen,
          // meetingClosed: !site.val().meetingOpen,
          // onlyMen: site.val().onlyMen,
          // onlyWomen: site.val().onlyWomen,
          // childcare: site.val().childcare,
          // meditation: site.val().meditation,
          // speaker: site.val().speaker,
          // step: site.val().step,
          // spanish: site.val().spanish,
          // bigBook: site.val().bigBook,
          // discussion: site.val().discussion,
          // tradition: site.val().tradition,
          // beginner: site.val().beginner,
          // am: boolAm,
          // noon: boolNoon,
          // pm: boolPm,
          animation: google.maps.Animation.DROP,
      });

      markers.push(marker);
      //add infowindow with closure
      // google.maps.event.addListener(marker, 'click', (function(marker) {
      //     return function() {
      //         // infoWindow.setContent(infoContent);
      //         // infoWindow.open(map, marker);
      //     };
      // })(marker));
  })
}

  return (
    <div className="map-container">
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;