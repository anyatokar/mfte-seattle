import { db } from "../db/firebase";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { adInquiryFormFieldsType } from "../pages/Advertise";
import { contactUsFormFieldsType } from "../pages/Contact";
import IBuilding from "../interfaces/IBuilding";

export async function saveBuilding(
  uid: string | undefined,
  building: IBuilding
) {
  if (!uid || !building) {
    return;
  }

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

  const userDocRef = doc(db, "users", uid);
  const buildingDocRef = doc(userDocRef, "savedHomes", buildingID);

  await setDoc(buildingDocRef, {
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
    savedTimestamp: new Date(),
  })
    .then(() => {
      console.log(`${buildingName} saved to user list.`);
    })
    .catch((error: any) => {
      console.error("Error adding document: ", error);
    });
}

export async function deleteBuilding(
  uid: string | undefined,
  buildingID: string,
  buildingName: string
) {
  if (!uid) {
    return;
  }

  const userDocRef = doc(db, "users", uid);
  await deleteDoc(doc(userDocRef, "savedHomes", buildingID))
    .then(() => {
      console.log(`${buildingName} deleted from user list.`);
    })
    .catch((error: any) => {
      console.error("Error deleting document: ", error);
    });
}

export async function getNameFirestore(uid: string): Promise<string | null> {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  try {
    if (userDocSnap.exists()) {
      return userDocSnap.data().name;
    } else {
      console.log(`No user in "users" with uid ${uid}`);
    }
  } catch (error: any) {
    console.error(`Error getting data for user ${uid}:`, error);
  } finally {
    return null;
  }
}

export async function updateNameFirestore(
  uid: string | undefined,
  name: string
) {
  if (!uid) {
    return;
  }

  const userDocRef = doc(db, "users", uid);

  await updateDoc(userDocRef, {
    name: name,
    updateNameTimestamp: new Date(),
  });
}

export async function updateEmailFirestore(
  uid: string | undefined,
  email: string
) {
  if (!uid) {
    return;
  }

  const userDocRef = doc(db, "users", uid);

  await updateDoc(userDocRef, {
    email: email,
    updateEmailTimestamp: new Date(),
  });
}

export async function sendMessageFirestore(
  formFields: contactUsFormFieldsType
) {
  await addDoc(collection(db, "contactus"), {
    authorName: formFields.authorName,
    email: formFields.email,
    subject: formFields.subject,
    description: formFields.description,
    message: formFields.message,
    sentTimestamp: new Date(),
    didReply: false,
  });
}

export async function sendAdInquiryFirestore(
  formFields: adInquiryFormFieldsType
) {
  await addDoc(collection(db, "ad_inquiries"), {
    authorName: formFields.authorName,
    email: formFields.email,
    companyName: formFields.companyName,
    propertyNames: formFields.propertyNames,
    message: formFields.message,
    sentTimestamp: new Date(),
    didReply: false,
  });
}

export async function addNote(
  uid: string | undefined,
  buildingID: string,
  noteToAdd: string
) {
  if (!uid) {
    return;
  }

  const userDocRef = doc(db, "users", uid);
  const buildingDocRef = doc(userDocRef, "savedHomes", buildingID);

  await updateDoc(buildingDocRef, {
    note: noteToAdd,
    noteTimestamp: new Date(),
  });
}

export async function deleteUserFirestore(uid: string | undefined) {
  if (!uid) {
    return;
  }

  await deleteDoc(doc(db, "users", uid));
}

export async function signupFirestore(
  uid: string,
  email: string | null,
  name: string | null
) {
  await setDoc(doc(db, "users", uid), {
    uid: uid,
    email: email,
    name: name,
    signupOrBackfillTimestamp: new Date(),
    // Since Dec 8, 2023. This is to facilitate development and search in Firestore.
    recentUser: true,
  });
}

export async function getAllBuildingsRef() {
  return await getDocs(collection(db, "buildings"));
}

export async function getSavedBuildingsRef(uid: string) {
  const userDocRef = doc(db, "users", uid);
  return await getDocs(collection(userDocRef, "savedHomes"));
}
