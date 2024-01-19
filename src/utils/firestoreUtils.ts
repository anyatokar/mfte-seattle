import firebase from "../db/firebase";
import { timestampPT } from "./generalUtils";
import { formFieldsType } from "../pages/Contact";
import IBuilding from "../interfaces/IBuilding";

export function saveBuilding(currentUser: any, building: IBuilding) {
  const {
    buildingID,
    buildingName,
    phone,
    phone2,
    residentialTargetedArea,
    totalRestrictedUnits,
    sedu,
    studioUnits,
    oneBedroomUnits,
    twoBedroomUnits,
    threePlusBedroomUnits,
    urlForBuilding,
    streetNum,
    street,
    city,
    state,
    zip,
    lat,
    lng,
  } = building;

  firebase
    .firestore()
    .collection("users")
    .doc(currentUser.uid)
    .collection("savedHomes")
    .doc(buildingID)
    .set({
      buildingID: buildingID,
      buildingName: buildingName,
      phone: phone,
      phone2: phone2,
      residentialTargetedArea: residentialTargetedArea,
      totalRestrictedUnits: totalRestrictedUnits,
      sedu: sedu,
      studioUnits: studioUnits,
      oneBedroomUnits: oneBedroomUnits,
      twoBedroomUnits: twoBedroomUnits,
      threePlusBedroomUnits: threePlusBedroomUnits,
      urlForBuilding: urlForBuilding,
      streetNum: streetNum,
      street: street,
      city: city,
      state: state,
      zip: zip,
      lat: lat,
      lng: lng,
      savedTimestamp: timestampPT(),
    })
    .then(() => {
      console.log(`${buildingName} saved to user list.`);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

export function deleteBuilding(
  currentUser: any,
  buildingID: string,
  buildingName: string
) {
  const savedHomesQuery = firebase
    .firestore()
    .collection("users")
    .doc(currentUser.uid)
    .collection("savedHomes")
    .where("buildingID", "==", buildingID);
  savedHomesQuery.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      doc.ref
        .delete()
        .then(() => {
          console.log(`${buildingName} deleted from user list.`);
        })
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });
    });
  });
}

export function getNameFirestore(uid: string): Promise<string> {
  const docRef = firebase.firestore().collection("users").doc(uid);
  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data()?.name;
      } else {
        console.log(`No user in "users" with uid ${uid}`);
        return "";
      }
    })
    .catch((error) => {
      console.log(`Error getting data for user ${uid}:`, error);
    });
}

export function updateNameFirestore(uid: string, name: string) {
  return firebase.firestore().collection("users").doc(uid).update({
    name: name,
    updateNameTimestamp: timestampPT(),
  });
}

export function updateEmailFirestore(uid: string, email: string) {
  return firebase.firestore().collection("users").doc(uid).update({
    email: email,
    updateEmailTimestamp: timestampPT(),
  });
}

export function sendMessageFirestore(formFields: formFieldsType) {
  return firebase.firestore().collection("contactus").doc().set({
    authorName: formFields.authorName,
    email: formFields.email,
    subject: formFields.subject,
    description: formFields.description,
    message: formFields.message,
    sentTimestamp: timestampPT(),
    didReply: false,
  });
}

export function addNote(uid: string, buildingID: string, noteToAdd: string) {
  return firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("savedHomes")
    .doc(buildingID)
    .update({
      note: noteToAdd,
      noteTimestamp: timestampPT(),
    });
}

export function deleteUserFirestore(uid: string) {
  return firebase.firestore().collection("users").doc(uid).delete();
}

export function signupFirestore(
  uid: string,
  email: string | null,
  name: string | null
) {
  return firebase.firestore().collection("users").doc(uid).set({
    uid: uid,
    email: email,
    name: name,
    signupOrBackfillTimestamp: timestampPT(),
    // Since Dec 8, 2023. This is to facilitate development and search in Firestore.
    recentUser: true,
  });
}

export function getAllBuildingsRef() {
  return firebase.firestore().collection("buildings");
}

export function getSavedBuildingsRef(uid: string) {
  return firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("savedHomes");
}
