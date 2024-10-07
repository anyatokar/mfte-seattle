import { db } from "../db/firebase";
import { listingMaxDays } from "../config/config";
import {
  collection,
  deleteDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";

import { contactUsFormFieldsType } from "../pages/Contact";

import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";
import { ISignupAuthData } from "../contexts/AuthContext";
import { listingStatusEnum } from "../types/enumTypes";

export async function saveBuilding(
  uid: string | undefined,
  building: IBuilding
) {
  if (!uid || !building) {
    return;
  }

  const { buildingID, buildingName } = building;

  const userDocRef = doc(db, "users", uid);
  const buildingDocRef = doc(userDocRef, "savedHomes", buildingID);

  await setDoc(buildingDocRef, { ...building, savedTimestamp: new Date() })
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

export async function addListingFirestore(
  formFields: Partial<IListing>,
  buildingID: string,
  uid: string
) {
  const listing: IListing = {
    buildingName: formFields.buildingName || "",
    url: formFields.url || "",
    availData: formFields.availData || [],
    message: formFields.message || "",
    listingStatus: listingStatusEnum.IN_REVIEW,
    buildingID: buildingID || "",
    dateCreated: Timestamp.fromDate(new Date()),
    dateUpdated: Timestamp.fromDate(new Date()),
    expiryDate:
      formFields.expiryDate ||
      Timestamp.fromDate(
        new Date(Date.now() + listingMaxDays * 24 * 60 * 60 * 1000)
      ),
    listingID: "",
  };

  // Create a new document reference with an auto-generated ID
  const listingDocRef = doc(collection(db, "listingsTEST"));
  // Set the document and include the listingID field
  await setDoc(listingDocRef, {
    ...listing,
    listingID: listingDocRef.id,
  });

  // Add the new listingID to the rep's listingIDs array
  const companyRepRef = doc(db, "companyReps", uid);
  await updateDoc(companyRepRef, {
    listingIDs: arrayUnion(listingDocRef.id),
  });
}

export async function updateListingFirestore(
  fieldsToUpdate: Partial<IListing>,
  listingID: string
) {
  const listingDocRef = doc(db, "listingsTEST", listingID);
  await updateDoc(listingDocRef, {
    ...fieldsToUpdate,
    dateUpdated: Timestamp.fromDate(new Date()),
  });
}

export async function deleteListingFirestore(
  listingID: string,
  buildingName: string
) {
  const listingDocRef = doc(db, "listingsTEST", listingID);
  await deleteDoc(listingDocRef)
    .then(() => {
      console.log(
        `Listing for ${buildingName} deleted. ListingID was ${listingID}`
      );
    })
    .catch((error: any) => {
      console.error(
        `Error deleting listing for" ${buildingName}, listingID ${listingID}:`,
        error
      );
    });

  // TODO: need to remove from listingIDs array as well.
}

export async function getRepsListingIDsFirestore(
  uid: string
): Promise<string[] | null> {
  const companyRepDocRef = doc(db, "companyReps", uid);
  const companyRepDocSnap = await getDoc(companyRepDocRef);

  try {
    if (companyRepDocSnap.exists()) {
      return companyRepDocSnap.data().listingIDs;
    } else {
      console.log(`No company ref in "companyRefs" with uid ${uid}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting data for company ref ${uid}:`, error);
    return null;
  }
}

export async function getUserFirestore(uid: string): Promise<string | null> {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  try {
    if (userDocSnap.exists()) {
      return userDocSnap.data().name;
    } else {
      console.log(`No user in "users" with uid ${uid}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting data for user ${uid}:`, error);
    return null;
  }
}

export async function getNameFirestore(uid: string): Promise<string | null> {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  try {
    if (userDocSnap.exists()) {
      return userDocSnap.data().name;
    } else {
      console.log(`No user in "users" with uid ${uid}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting data for user ${uid}:`, error);
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

export async function signupFirestore(signupAuthData: ISignupAuthData) {
  const { email, name, isCompany, companyName, jobTitle, uid } = signupAuthData;

  if (!uid) return;

  const userDocRef = doc(db, "users", uid);
  const companyRepDocRef = doc(db, "companyReps", uid);

  if (isCompany) {
    await setDoc(companyRepDocRef, {
      uid: uid,
      email: email,
      name: name,
      signupTimestamp: new Date(),
      companyName: companyName,
      jobTitle: jobTitle,
    });
  } else {
    await setDoc(userDocRef, {
      uid: uid,
      email: email,
      name: name,
      signupOrBackfillTimestamp: new Date(),
      // Since Dec 8, 2023. This is to facilitate development and search in Firestore.
      recentUser: true,
    });
  }
}
