import { db } from "../db/firebase";
import {
  collection,
  deleteDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

import { contactUsFormFieldsType } from "../pages/Contact";
import { accountTypeEnum, listingStatusEnum } from "../types/enumTypes";
import { getMaxExpiryDate } from "./generalUtils";

import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";
import {
  IManagerSignupAuthData,
  IUserSignupAuthData,
  SignupAuthDataType,
} from "../interfaces/IUser";

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
  buildingName: string,
  formFields: Partial<IListing>,
  buildingID: string,
  uid: string
) {
  const listing: IListing = {
    buildingName: buildingName || "",
    url: formFields.url || "",
    availData: formFields.availData || [],
    message: formFields.message || "",
    listingStatus: listingStatusEnum.IN_REVIEW,
    buildingID: buildingID || "",
    dateCreated: Timestamp.fromDate(new Date()),
    dateUpdated: Timestamp.fromDate(new Date()),
    expiryDate: formFields.expiryDate || getMaxExpiryDate(),
    listingID: "",
    managerID: uid,
  };
  try {
    // Create a new document reference with an auto-generated ID
    const listingDocRef = doc(collection(db, "listingsTEST"));

    // Set the document and include the listingID field
    await setDoc(listingDocRef, {
      ...listing,
      listingID: listingDocRef.id,
    });

    return true;
  } catch (error) {
    console.error("Error adding listing or updating company rep:", error);
    return false;
  }
}
export async function updateListingFirestore(
  fieldsToUpdate: Partial<IListing>,
  listingID: string
) {
  try {
    const listingDocRef = doc(db, "listingsTEST", listingID);
    await updateDoc(listingDocRef, {
      ...fieldsToUpdate,
      dateUpdated: Timestamp.fromDate(new Date()),
      expiryDate: fieldsToUpdate.expiryDate || getMaxExpiryDate(),
    });
    return true;
  } catch (error) {
    console.error("Error updating listing:", error);
    return false;
  }
}

export async function deleteListingFirestore(
  listingID: string,
  buildingName: string,
  uid: string
) {
  const listingDocRef = doc(db, "listingsTEST", listingID);
  await deleteDoc(listingDocRef)
    .then(() => {
      console.log(
        `Listing for ${buildingName} deleted from Listings. ListingID was ${listingID}`
      );
    })
    .catch((error: any) => {
      console.error(
        `Error deleting listing for ${buildingName}, listingID ${listingID}:`,
        error
      );
    });
}

export async function getManagerProfileFirestore(
  uid: string
): Promise<DocumentData | null> {
  const userDocRef = doc(db, "managers", uid);
  const userDocSnap = await getDoc(userDocRef);

  try {
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.log(`No user in "managers" with uid ${uid}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting data for user ${uid}:`, error);
    return null;
  }
}

export async function getAccountTypeFirestore(
  uid: string
): Promise<accountTypeEnum | null> {
  const userDocRef = doc(db, "users", uid);
  const managerDocRef = doc(db, "managers", uid);

  try {
    const userDocSnap = await getDoc(userDocRef);
    const companyUserDocSnap = await getDoc(managerDocRef);

    if (userDocSnap.exists()) {
      return accountTypeEnum.RENTER;
    } else if (companyUserDocSnap.exists()) {
      return accountTypeEnum.MANAGER;
    } else {
      console.log("User doesn't exist in either collection");
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting user account data for user ${uid}:`, error);
    return null;
  }
}

export type UpdateData = {
  uid: string | undefined;
  accountType: accountTypeEnum | null;
  key: keyof IManagerSignupAuthData | keyof IUserSignupAuthData;
  value: string;
};

export async function updateProfileFirestore(updateData: UpdateData) {
  const { uid, accountType, key, value } = updateData;

  if (!uid) {
    return;
  }

  const userDocRef = doc(db, "users", uid);
  const managerDocRef = doc(db, "managers", uid);

  if (accountType === accountTypeEnum.RENTER) {
    await updateDoc(userDocRef, {
      [key]: value,
      updateNameTimestamp: new Date(),
    });
  } else if (accountType === accountTypeEnum.MANAGER) {
    await updateDoc(managerDocRef, {
      [key]: value,
      updateNameTimestamp: new Date(),
    });
  }
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

export async function deleteUserFirestore(
  uid: string | undefined,
  accountType: accountTypeEnum | null
) {
  if (!uid) {
    return;
  }

  if (accountType === accountTypeEnum.MANAGER) {
    await deleteDoc(doc(db, "managers", uid));
  } else if (accountType === accountTypeEnum.RENTER) {
    await deleteDoc(doc(db, "users", uid));
  }
}

export async function signupFirestore(signupAuthData: SignupAuthDataType) {
  const { uid, accountType } = signupAuthData;

  if (!uid) return;

  if (accountType === accountTypeEnum.MANAGER) {
    const { email, name, uid, companyName, jobTitle } = signupAuthData;
    const managerDocRef = doc(db, "managers", uid);
    await setDoc(managerDocRef, {
      accountType: accountType,
      uid: uid,
      email: email,
      name: name,
      signupTimestamp: new Date(),
      companyName: companyName,
      jobTitle: jobTitle,
    } as Omit<IManagerSignupAuthData, "password">);
  } else if (accountType === accountTypeEnum.RENTER) {
    const { email, name, uid } = signupAuthData;
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      accountType: accountType,
      uid: uid,
      email: email,
      name: name,
      signupOrBackfillTimestamp: new Date(),
      // Since Dec 8, 2023. This is to facilitate development and search in Firestore.
      recentUser: true,
    } as Omit<IUserSignupAuthData, "password">);
  }
}
