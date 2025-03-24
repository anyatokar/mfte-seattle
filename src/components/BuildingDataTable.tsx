import { Fragment, ReactNode, useState } from "react";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  TableTypeEnum,
  ProgramKeyEnum,
  ProgramLabelEnum,
} from "../types/enumTypes";
import { formatCurrency, formatDate } from "../utils/generalUtils";
import { AmiData, PercentAmi } from "../interfaces/IBuilding";
import { AvailDataArray, UnitAvailData } from "../interfaces/IListing";
import { p6maxIncomeData } from "../config/P6-income-limits";
import { p345maxIncomeData } from "../config/P345-income-limits";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

interface AmiDataProps {
  type: TableTypeEnum.amiData;
  data: AmiData;
  isMarker?: boolean;
  onClickCallback?: (
    ami: PercentAmi,
    unit: BedroomsKeyEnum,
    isChecked: boolean
  ) => void;
  tableFields?: AmiData;
  //TODO: data and tableFields seems redundant
}

interface AvailDataProps {
  type: TableTypeEnum.availData;
  data: AvailDataArray;
  isMarker?: boolean;
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = (props) => {
  const { type, data, isMarker = false } = props;

  const [showModal, setShowModal] = useState(false);
  const [unitAvailData, setUnitAvailData] = useState<UnitAvailData | null>(
    null
  );

  const handleClose = () => {
    setShowModal(false);
    setUnitAvailData(null);
  };

  const handleShowModal = (unitAvailData: UnitAvailData) => {
    setUnitAvailData(unitAvailData);
    setShowModal(true);
  };

  function getModalSentence(): string | undefined {
    if (unitAvailData && type === TableTypeEnum.availData) {
      if (unitAvailData.selectedProgram === ProgramKeyEnum.P345) {
        return ProgramLabelEnum[ProgramKeyEnum.P345];
      } else if (unitAvailData.selectedProgram === ProgramKeyEnum.P6) {
        return ProgramLabelEnum[ProgramKeyEnum.P6];
      } else {
        // TODO: Remove when there is no more unknown program types in listings.
        return "Unknown therefore both annual income limits are listed.";
      }
    }
  }

  function getModalData(
    unitAvailData: UnitAvailData
  ): [number[], number[]?] | undefined {
    if (unitAvailData.percentAmi && type === TableTypeEnum.availData) {
      if (unitAvailData.selectedProgram === ProgramKeyEnum.P345) {
        return [p345maxIncomeData[unitAvailData.percentAmi]];
      } else if (unitAvailData.selectedProgram === ProgramKeyEnum.P6) {
        return [p6maxIncomeData[unitAvailData.percentAmi]];
      } else {
        // TODO: Remove when there is no more unknown program types in listings.
        return [
          p345maxIncomeData[unitAvailData.percentAmi],
          p6maxIncomeData[unitAvailData.percentAmi],
        ];
      }
    }
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

  return (
    <>
      <Table bordered hover size="sm" className="my-0" responsive>
        <thead>
          <tr>
            <th style={isMarker ? { minWidth: "50px" } : { minWidth: "65px" }}>
              Size
            </th>
            <th style={{ whiteSpace: "nowrap" }}>% AMI</th>
            {type === TableTypeEnum.availData && (
              <th style={{ whiteSpace: "nowrap" }}>Income</th>
            )}
            {/* TODO: Rent including utilities? */}
            {type === TableTypeEnum.availData && <th>Rent</th>}
            {type === TableTypeEnum.availData && (
              <th style={{ whiteSpace: "nowrap" }}>Apt #</th>
            )}
            {type === TableTypeEnum.availData && (
              <th style={{ whiteSpace: "nowrap" }}>Move-in Date</th>
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
              } = unitAvailData;

              return rowId && unitSize ? (
                <tr key={rowId}>
                  <td>{unitSizeLabelEnum[unitSize]}</td>
                  <td>{percentAmi ?? "--"}</td>
                  <td className={percentAmi ? "py-0" : ""}>
                    {percentAmi ? (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => handleShowModal(unitAvailData)}
                      >
                        Max
                      </Button>
                    ) : (
                      "--"
                    )}
                  </td>
                  <td>{formatCurrency(maxRent)}</td>
                  <td>{aptNum ? aptNum : "--"}</td>
                  <td>
                    {dateAvailString ? formatDate(dateAvailString) : "--"}
                  </td>
                </tr>
              ) : null;
            })}
        </tbody>
      </Table>

      {unitAvailData && type === TableTypeEnum.availData && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Income Limits</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Determined by percent area median income (% AMI), household size,
              and program type.
              <br />
              <strong>AMI: </strong>
              {unitAvailData.percentAmi}%
              <br />
              <strong>Program:</strong> {getModalSentence()}
            </p>

            <Table bordered hover size="sm" className="my-0" responsive>
              <thead>
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Household Size</th>
                  <th style={{ whiteSpace: "nowrap" }}>
                    {unitAvailData.selectedProgram
                      ? "Max Annual Income"
                      : ProgramLabelEnum.P6}
                  </th>
                  {!unitAvailData.selectedProgram && (
                    <th>{ProgramLabelEnum.P345}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {unitAvailData.selectedProgram &&
                  getModalData(unitAvailData)?.[0].map((percentData, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatCurrency(percentData)}</td>
                    </tr>
                  ))}

                {/* TODO: Delete when every listing has program data. */}
                {!unitAvailData.selectedProgram &&
                getModalData(unitAvailData)?.[0]
                  ? getModalData(unitAvailData)?.[0].map(
                      (percentData, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {formatCurrency(
                              getModalData(unitAvailData)?.[1]?.[index] ?? 0
                            )}
                          </td>
                          <td>{formatCurrency(percentData ?? 0)}</td>
                        </tr>
                      )
                    )
                  : null}
              </tbody>
            </Table>
            <div className="pt-2 text-muted">
              Program and % AMI for the specific unit provided by building
              management. Max annual income limit data sourced from{" "}
              <a
                id="income-and-rent-limits"
                href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2024/2024_RentIncomeLimits_5.28.24.pdf"
                title="Income and Rent Limits (FY 2024)"
                target="_blank"
                rel="noreferrer"
              >
                Seattle Office of Housing Income and Rent Limits
              </a>
              .
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default BuildingDataTable;
