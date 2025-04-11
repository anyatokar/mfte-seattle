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
import {
  accountTypeEnum,
  listingStatusEnum,
  ProgramKeyEnum,
} from "../types/enumTypes";
import { getMaxExpiryDate } from "./generalUtils";

import IListing, {
  AvailDataArray,
} from "../interfaces/IListing";
import {
  IManagerSignupAuthData,
  IUserSignupAuthData,
  SignupAuthDataType,
} from "../interfaces/IUser";
import { CurrentBuildingData, ITempBuilding } from "../interfaces/ITempBuilding";

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

async function setTempBuilding(
  selectedBuilding: CurrentBuildingData,
  listingID: string,
  randomTempBuildingID: string
): Promise<void> {
  const {
    buildingName,
    otherBuildingName,
    buildingID,
    address,
    contact,
    amiData,
  } = selectedBuilding;

  const tempBuilding: ITempBuilding = {
    buildingName: otherBuildingName ? otherBuildingName : buildingName,
    buildingID: buildingID || randomTempBuildingID,
    address: address,
    contact: contact,
    amiData: amiData,
    listingID: listingID,
  };

  try {
    // Temp building uses same ID as associated listing.
    const tempBuildingDocRef = listingID
      ? doc(db, "temp_buildings", listingID)
      : doc(collection(db, "temp_buildings"));

    // Overwrite all the fields
    await setDoc(tempBuildingDocRef, tempBuilding);
    return;
  } catch (error) {
    console.error("Error adding temp building:", error);
    return;
  }
}

export async function setListingFirestore(
  formFields: Partial<IListing>,
  selectedBuilding: CurrentBuildingData | null,
  uid: string,
  listingID: string | undefined
): Promise<string> {
  try {
    const listingDocRef = listingID
      ? doc(db, "listings", listingID)
      : doc(collection(db, "listings"));

    const randomTempBuildingID = doc(collection(db, "temp_buildings")).id;

    if (selectedBuilding) {
      await setTempBuilding(
        selectedBuilding,
        listingDocRef.id,
        randomTempBuildingID
      );
    }

    const listing: Partial<IListing> = {
      buildingName:
        (selectedBuilding?.otherBuildingName
          ? selectedBuilding?.otherBuildingName
          : formFields.buildingName) || "",
      buildingID: selectedBuilding?.buildingID || randomTempBuildingID,
      url: formFields.url || "",
      availDataArray: formFields.noneAvailable
        ? []
        : availDataToNum(formFields.availDataArray),
      description: formFields.description || "",
      dateCreated: Timestamp.fromDate(new Date()),
      dateUpdated: Timestamp.fromDate(new Date()),
      /** YYYY-MM-DD */
      expiryDate: formFields.expiryDate || getMaxExpiryDate(),
      listingID: listingDocRef.id,
      managerID: uid,
      feedback: formFields.feedback || "",
      noneAvailable: formFields.noneAvailable || false,
    };

    // Only change status for new listings
    if (!listingID) {
      listing.listingStatus = listingStatusEnum.IN_REVIEW;
    }

    // Set the document and include the listingID field
    await setDoc(listingDocRef, listing, { merge: true });
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

  const tempBuildingDocRef = doc(db, "temp_buildings", listingID);
  if (tempBuildingDocRef) {
    await updateDoc(tempBuildingDocRef, {wasDeleted: true})
      .then(() => {
        console.log(
          `Temp building ${buildingName} (id: ${tempBuildingDocRef.id}) marked as deleted.`
        );
      })
      .catch((error: any) => {
        console.error(
          `Error marking temp building ${buildingName} (id: ${tempBuildingDocRef.id}) as deleted:`,
          error
        );
      });
  }
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
