import { useState } from "react";
import { setListingFirestore } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import { useAllBuildingsContext } from "../../contexts/AllBuildingsContext";
import { useTempBuildingsContext } from "../../contexts/TempBuildingsContext";
import EditListingForm from "./EditListingForm";
import EditListingFormBuildingSelect from "./EditListingFormBuildingSelect";
import {
  createBlankAvailRow,
  createEmptyFormFields,
  emptyCurrentBuildingData,
} from "../../constants/listingDefaults";
import { OptionalUrlsKeyEnum } from "../../types/enumTypes";
import IBuilding from "../../interfaces/IBuilding";
import IListing from "../../interfaces/IListing";
import {
  CurrentBuildingData,
  ITempBuilding,
} from "../../interfaces/ITempBuilding";
import Form from "react-bootstrap/Form";

type EditListingFormProps = {
  listing: IListing | null;
  building: IBuilding | ITempBuilding | null;
  onClose: () => void;
};

const EditListingFormWrapper: React.FC<EditListingFormProps> = ({
  listing: originalListing,
  building: buildingProp,
  onClose,
}) => {
  const [allBuildings] = useAllBuildingsContext();
  const [tempBuildings] = useTempBuildingsContext();

  let originalFormFields;
  if (originalListing) {
    const {
      buildingName,
      buildingID,
      availDataArray,
      url,
      expiryDate,
      description,
      feedback,
      noneAvailable,
    } = originalListing;

    originalFormFields = {
      buildingName: buildingName,
      buildingID: buildingID,
      availDataArray:
        availDataArray.length > 0 ? availDataArray : [createBlankAvailRow()],
      url: url,
      expiryDate: expiryDate,
      description: description,
      feedback: feedback,
      noneAvailable: noneAvailable,
    };
  } else {
    originalFormFields = createEmptyFormFields();
  }

  const [formFields, setFormFields] = useState(originalFormFields);
  const [currentBuildingData, setCurrentBuildingData] =
    useState<CurrentBuildingData | null>(buildingProp);
  const [alert, setAlert] = useState<string>("");

  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    rowId?: string,
    buildingID?: string
  ) => {
    const { name, value } = event.target;

    setFormFields((prev) => {
      if (rowId !== undefined) {
        const newAvailData = [...prev.availDataArray];
        const rowIndex = newAvailData.findIndex((row) => row.rowId === rowId);

        if (
          Object.values(OptionalUrlsKeyEnum).includes(
            name as OptionalUrlsKeyEnum
          )
        ) {
          newAvailData[rowIndex] = {
            ...newAvailData[rowIndex],
            optionalUrls: {
              ...newAvailData[rowIndex].optionalUrls,
              [name]: value,
            },
          };
        } else {
          newAvailData[rowIndex] = { ...newAvailData[rowIndex], [name]: value };

          if (name === "unitSize") {
            newAvailData[rowIndex] = {
              ...newAvailData[rowIndex],
              // Clear out percentAmi when unit size changes
              percentAmi: undefined,
            };
          }

          if (name === "selectedProgram") {
            newAvailData[rowIndex] = {
              ...newAvailData[rowIndex],
            };

            delete newAvailData[rowIndex].otherProgram;
          }
        }

        return {
          ...prev,
          availDataArray: newAvailData,
        };
      }

      if (name === "buildingName") {
        if (value === "Not Listed") {
          setCurrentBuildingData({
            ...emptyCurrentBuildingData,
            buildingName: "Not Listed",
          });
        } else {
          setCurrentBuildingData(
            buildingID
              ? tempBuildings.find(
                  (building) => buildingID === building.listingID
                ) ||
                  allBuildings.find(
                    (building) => buildingID === building.buildingID
                  ) ||
                  null
              : null
          );
        }
      }

      if (name === "otherBuildingName" && currentBuildingData) {
        setCurrentBuildingData({ ...currentBuildingData, buildingName: value });
      }

      if (
        name === "noneAvailable" &&
        event.target instanceof HTMLInputElement
      ) {
        return {
          ...prev,
          [name]: event.target.checked,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!formFields || !currentBuildingData) return;

    if (Object.values(currentBuildingData.amiData).flat().length === 0) {
      setAlert(
        `Please select at least one % AMI in the "All rent-reduced units" table.`
      );
      return;
    }

    setAlert("");

    const listingID = await setListingFirestore(
      formFields,
      currentBuildingData,
      currentUser.uid,
      originalListing?.listingID
    );

    if (listingID) {
      console.log(
        `Successfully set listing for building: ${currentBuildingData?.buildingName}. ListingID: ${listingID}`
      );

      onClose();
    } else {
      setAlert(
        "There was a problem submitting your data. Please contact mfte.seattle@gmail.com if the issue persists."
      );
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <EditListingFormBuildingSelect
        currentBuildingData={currentBuildingData}
        onInputChange={handleInputChange}
        originalListing={originalListing}
        allBuildings={allBuildings}
      />

      <EditListingForm
        alert={alert}
        currentBuildingData={currentBuildingData}
        onInputChange={handleInputChange}
        formFields={formFields}
        setFormFields={setFormFields}
        setCurrentBuildingData={setCurrentBuildingData}
      />
    </Form>
  );
};

export default EditListingFormWrapper;
