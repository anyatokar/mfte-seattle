import { Fragment, ReactNode, useState } from "react";
import IncomeLimitsModal from "./IncomeLimitsModal";
import { formatCurrency, formatDate } from "../../utils/generalUtils";
import { useHousehold } from "../../contexts/HouseholdContext";
import { useUnitAvailData } from "../../contexts/UnitAvailDataContext";
import { p6maxIncomeData } from "../../dataTables/P6-income-limits";
import { p345maxIncomeData } from "../../dataTables/P345-income-limits";
import { archIncomeData } from "../../dataTables/ARCH-income-limits";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  TableTypeEnum,
  ProgramKeyEnum,
  TableParentEnum,
  OptionalUrlsKeyEnum,
  OptionalUrlsLabelEnum,
} from "../../types/enumTypes";
import { AmiData, PercentAmi } from "../../interfaces/IBuilding";
import { AvailDataArray, UnitAvailData } from "../../interfaces/IListing";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

interface AmiDataProps {
  type: TableTypeEnum.amiData;
  data: AmiData;
  tableParent: TableParentEnum;
  onClickCallback?: (
    ami: PercentAmi,
    unit: BedroomsKeyEnum,
    isChecked: boolean
  ) => void;
  tableFields?: AmiData;
  // TODO: data and tableFields seems redundant
}

interface AvailDataProps {
  type: TableTypeEnum.availData;
  data: AvailDataArray;
  tableParent: TableParentEnum;
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

export const incomeTables = {
  [ProgramKeyEnum.P345]: p345maxIncomeData,
  [ProgramKeyEnum.P6]: p6maxIncomeData,
  [ProgramKeyEnum.ARCH_OLD]: archIncomeData,
  [ProgramKeyEnum.ARCH_NEW]: archIncomeData,
};

const BuildingDataTable: React.FC<BuildingDataTableProps> = (props) => {
  const { type, data, tableParent } = props;

  const [showModal, setShowModal] = useState(false);
  const { setUnitAvailDataContext } = useUnitAvailData();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = (unitAvailData: UnitAvailData) => {
    setUnitAvailDataContext(unitAvailData);
    setShowModal(true);
  };

  /** When household size is selected */
  function getMaxForHousehold(unitAvailData: UnitAvailData): string {
    const index = Number(selectedHousehold) - 1;
    const { percentAmi, selectedProgram } = unitAvailData;

    if (
      !percentAmi ||
      !selectedProgram ||
      selectedProgram === ProgramKeyEnum.other ||
      type !== TableTypeEnum.availData
    ) {
      return "--";
    }

    const incomeTable = incomeTables[selectedProgram];
    const value = incomeTable?.[percentAmi]?.[index];

    return formatCurrency(value || "");
  }

  const order: BedroomsKeyEnum[] = [
    BedroomsKeyEnum.MICRO,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ];

  const allAmi: PercentAmi[] = [
    "30",
    "40",
    "50",
    "60",
    "65",
    "70",
    "75",
    "80",
    "85",
    "90",
  ];

  function renderPercentageList(
    percentages: PercentAmi[],
    unit: BedroomsKeyEnum
  ): ReactNode {
    if (percentages === undefined || type === TableTypeEnum.availData) return;
    if (percentages.length === 0) {
      return (
        <>
          {[...allAmi].sort().map((ami) => {
            const isChecked = props.tableFields?.[unit]?.includes(ami) ?? false;

            if (props.type === TableTypeEnum.amiData && props.onClickCallback) {
              return (
                <Form.Check
                  inline
                  key={ami}
                  type="checkbox"
                  label={ami}
                  value={ami}
                  checked={isChecked}
                  onChange={() => props.onClickCallback!(ami, unit, isChecked)}
                />
              );
            }
          })}
        </>
      );
    } else {
      return percentages.map((item, index) => (
        <Fragment key={index}>
          {item}
          {index < percentages.length - 1 ? ", " : ""}
        </Fragment>
      ));
    }
  }

  function getUrlColumns(): OptionalUrlsKeyEnum[] {
    if (type !== TableTypeEnum.availData) return [];

    const columnsToShow = new Set<OptionalUrlsKeyEnum>();

    // Check if any row has a field for the column
    for (const unitAvailData of data) {
      for (const key in unitAvailData.optionalUrls) {
        if (unitAvailData.optionalUrls[key as OptionalUrlsKeyEnum]) {
          columnsToShow.add(key as OptionalUrlsKeyEnum);
        }
      }
    }

    const order = [
      OptionalUrlsKeyEnum.listingPageUrl,
      OptionalUrlsKeyEnum.walkTourUrl,
      OptionalUrlsKeyEnum.floorPlanUrl,
      OptionalUrlsKeyEnum.otherUrl1,
      OptionalUrlsKeyEnum.otherUrl2,
      OptionalUrlsKeyEnum.otherUrl3,
    ];

    return order.filter((column) => columnsToShow.has(column));
  }

  const { selectedHousehold } = useHousehold();

  return (
    <div
      style={
        tableParent === TableParentEnum.BUILDING_CARD
          ? { maxHeight: "250px", overflowY: "auto" }
          : undefined
      }
    >
      <Table bordered hover size="sm" className="my-0" responsive>
        <thead>
          <tr>
            <th
              style={{
                minWidth:
                  tableParent === TableParentEnum.MARKER ? "50px" : "65px",
              }}
            >
              Size
            </th>
            <th style={{ whiteSpace: "nowrap" }}>% AMI</th>
            {type === TableTypeEnum.availData && (
              <>
                <th style={{ whiteSpace: "nowrap" }}>Max Income</th>
                <th>Rent</th>
                <th style={{ whiteSpace: "nowrap" }}>Apt #</th>
                <th style={{ whiteSpace: "nowrap" }}>Move-in Date</th>

                {getUrlColumns().map((key) => (
                  <th key={key} style={{ whiteSpace: "nowrap" }}>
                    {OptionalUrlsLabelEnum[key]}
                  </th>
                ))}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {type === TableTypeEnum.amiData &&
            order.map((unit) => {
              const percentAmis = data[unit as keyof AmiData];

              if (!percentAmis) return null;

              return (
                <tr key={unit}>
                  <td>{unitSizeLabelEnum[unit]}</td>
                  <td>{renderPercentageList(percentAmis, unit)}</td>
                </tr>
              );
            })}
          {type === TableTypeEnum.availData &&
            data.map((unitAvailData) => {
              const {
                dateAvailString,
                maxRent,
                percentAmi,
                rowId,
                unitSize,
                aptNum,
                otherProgram,
              } = unitAvailData;

              return rowId && unitSize ? (
                <tr key={rowId}>
                  <td>{unitSizeLabelEnum[unitSize]}</td>
                  <td>{percentAmi ?? "--"}</td>
                  <td className={percentAmi ? "py-0" : ""}>
                    {percentAmi && !otherProgram ? (
                      !selectedHousehold ? (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 m-0"
                          onClick={() => handleShowModal(unitAvailData)}
                        >
                          View
                        </Button>
                      ) : (
                        <>{getMaxForHousehold(unitAvailData)}</>
                      )
                    ) : (
                      "--"
                    )}
                  </td>
                  <td>{formatCurrency(maxRent)}</td>
                  <td>{aptNum ? aptNum : "--"}</td>
                  <td>
                    {dateAvailString ? formatDate(dateAvailString) : "--"}
                  </td>
                  {getUrlColumns().map((key) => (
                    <td key={key}>
                      {unitAvailData.optionalUrls?.[key] ? (
                        <a
                          href={unitAvailData.optionalUrls[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {unitAvailData.optionalUrls[key]}
                        </a>
                      ) : (
                        "--"
                      )}
                    </td>
                  ))}
                </tr>
              ) : null;
            })}
        </tbody>
      </Table>

      {type === TableTypeEnum.availData && (
        <Modal show={showModal} onHide={handleClose}>
          <IncomeLimitsModal type={type} />

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default BuildingDataTable;
