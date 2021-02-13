const buildings = require('./buildings.json');
const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DB,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MID
};

firebase.initializeApp(firebaseConfig);
// const databaseRef = firebase.database().ref();
// export const buildingsRef = databaseRef.child("buildings")
const db = firebase.firestore();

buildings.forEach(function(obj) {

  db.collection("buildingsTest").add({
    id: obj.buildingID,
    buildingName: obj.buildingName,
    phone: obj.phone,
    residentialTargetedArea: obj.residentialTargetedArea,
    totalRestrictedUnits: obj.totalRestrictedUnits,
    studioUnits: obj.studioUnits,
    oneBedroomUnits: obj.oneBedroomUnits,
    twoBedroomUnits: obj.twoBedroomUnits,
    threePlusBedroomUnits: obj.threePlusBedroomUnits,
    urlforBuilding: obj.urlforBuilding,
    lat: obj.lat,
    lng: obj.lng,
    streetNum: obj.number,
    street: obj.street,
    city: obj.city,
    state: obj.state,
    zip: obj.zip
  }).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);

    const currentBuilding = db.collection("buildingsTest").doc(docRef.id);

    return currentBuilding.update({
      buildingID: docRef.id
    })
    .then(() => {
      console.log("Document successfully updated with id: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
});