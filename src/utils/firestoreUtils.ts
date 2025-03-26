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
  getDocs,
} from "firebase/firestore";

import { contactUsFormFieldsType } from "../pages/Contact";
import {
  accountTypeEnum,
  listingStatusEnum,
  ProgramKeyEnum,
} from "../types/enumTypes";
import { getMaxExpiryDate } from "./generalUtils";

import IListing, {
  AvailDataArray,
  SelectedBuilding,
} from "../interfaces/IListing";
import {
  IManagerSignupAuthData,
  IUserSignupAuthData,
  SignupAuthDataType,
} from "../interfaces/IUser";
import IBuilding from "../interfaces/IBuilding";

export async function saveBuilding(
  uid: string | undefined,
  buildingID: string,
  buildingName: string
) {
  if (!uid || !buildingID) {
    return;
  }

  const userDocRef = doc(db, "users", uid);
  const buildingDocRef = doc(userDocRef, "savedHomes", buildingID);

  await setDoc(buildingDocRef, {
    buildingID,
    buildingName,
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

function availDataToNum(
  availDataArray: AvailDataArray | undefined
): AvailDataArray {
  if (!availDataArray) return [];

  for (const ele of availDataArray) {
    // The check is for TS and because form fields and listing in db share IListing.
    // Type will always be string when incoming from the form.
    if (typeof ele.maxRent === "string") {
      ele.maxRent = parseFloat(ele.maxRent);
    }
  }

  return availDataArray;
}

async function addTempBuilding(
  selectedBuilding: SelectedBuilding
): Promise<string> {
  const tempBuilding = {} as SelectedBuilding;

  if (selectedBuilding.buildingNameWritein) {
    tempBuilding["buildingNameWritein"] = selectedBuilding.buildingNameWritein;
  }

  if (selectedBuilding.amiData) {
    tempBuilding["amiData"] = selectedBuilding.amiData;
  }

  if (selectedBuilding.address) {
    tempBuilding["address"] = selectedBuilding.address;
  }

  if (selectedBuilding.contact) {
    tempBuilding["contact"] = selectedBuilding.contact;
  }

  try {
    const buildingDocRef = selectedBuilding.buildingID
      ? doc(db, "temp_buildings", selectedBuilding.buildingID)
      : doc(collection(db, "temp_buildings"));

    // Set the document and include the listingID field
    await setDoc(buildingDocRef, {
      ...tempBuilding,
      buildingID: buildingDocRef.id,
    });

    return buildingDocRef.id;
  } catch (error) {
    console.error("Error adding new building:", error);
    return "";
  }
}

export async function setListingFirestore(
  formFields: Partial<IListing>,
  selectedBuilding: SelectedBuilding | undefined,
  uid: string,
  listingID: string | undefined
): Promise<string> {
  try {
    const tempBuildingID = selectedBuilding
      ? await addTempBuilding(selectedBuilding)
      : "";

    const listing: IListing = {
      buildingName:
        (selectedBuilding?.buildingNameWritein
          ? selectedBuilding?.buildingNameWritein
          : formFields.buildingName) || "",
      buildingID: selectedBuilding?.buildingID || tempBuildingID,
      url: formFields.url || "",
      availDataArray: availDataToNum(formFields.availDataArray),
      description: formFields.description || "",
      listingStatus: listingStatusEnum.IN_REVIEW,
      dateCreated: Timestamp.fromDate(new Date()),
      dateUpdated: Timestamp.fromDate(new Date()),
      /** YYYY-MM-DD */
      expiryDate: formFields.expiryDate || getMaxExpiryDate(),
      listingID: listingID || "",
      managerID: uid,
      feedback: formFields.feedback || "",
    };

    // Get existing doc ref or create a new doc ref with an auto-generated ID
    const listingDocRef = listingID
      ? doc(db, "listings", listingID)
      : doc(collection(db, "listings"));

    // Set the document and include the listingID field
    await setDoc(
      listingDocRef,
      {
        ...listing,
        listingID: listingDocRef.id,
      },
      { merge: true }
    );
    return listingDocRef.id;
  } catch (error) {
    console.error("Error adding listing or updating company rep:", error);
    return "";
  }
}

export async function updateListingFirestore(
  fieldsToUpdate: Partial<IListing>,
  listingID: string
) {
  if (fieldsToUpdate.availDataArray) {
    fieldsToUpdate.availDataArray = availDataToNum(
      fieldsToUpdate.availDataArray
    );
  }

  try {
    const listingDocRef = doc(db, "listings", listingID);

    const updatedAvailDataArray = fieldsToUpdate.availDataArray?.map((row) => {
      if (row.selectedProgram !== ProgramKeyEnum.other && row.otherProgram) {
        const updatedRow = { ...row };
        delete updatedRow.otherProgram;
        return updatedRow;
      }
      return row;
    });

    await updateDoc(listingDocRef, {
      ...fieldsToUpdate,
      availDataArray: updatedAvailDataArray,
      dateUpdated: Timestamp.fromDate(new Date()),
      expiryDate: fieldsToUpdate.expiryDate || getMaxExpiryDate(),
    });
    return true;
  } catch (error) {
    console.error("Error updating listing:", error);
    return false;
  }
}

export async function getAllTempBuildings(): Promise<IBuilding[]> {
  const tempBuildings: IBuilding[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "temp_buildings"));

    querySnapshot.forEach((doc) => {
      tempBuildings.push(doc.data() as IBuilding);
    });
    return tempBuildings;
  } catch (error: any) {
    console.error(`Error getting temp_buildings collection:`, error);
    return [];
  }
}

export async function deleteListingFirestore(
  listingID: string,
  buildingName: string
) {
  const listingDocRef = doc(db, "listings", listingID);
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
      return accountTypeEnum.GHOST;
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
    } as Omit<IUserSignupAuthData, "password">);
  }
}
