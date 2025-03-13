import { Fragment, ReactNode, useState } from "react";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  tableType,
  ProgramKeyEnum,
  ProgramLabelEnum,
} from "../types/enumTypes";
import { formatCurrency, formatDate } from "../utils/generalUtils";
import { AmiData, PercentAmi } from "../interfaces/IBuilding";
import { AvailDataArray } from "../interfaces/IListing";
import { p6maxIncomeData } from "../config/P6-income-limits";
import { p345maxIncomeData } from "../config/P345-income-limits";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

interface AmiDataProps {
  type: tableType.amiData;
  data: AmiData;
  isMarker: boolean;
}

interface AvailDataProps {
  type: tableType.availData;
  data: AvailDataArray;
  program: ProgramKeyEnum | undefined;
  isMarker: boolean;
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = (props) => {
  const { type, data, isMarker } = props;

  const [showModal, setShowModal] = useState(false);
  const [percentAmi, setPercentAmi] = useState<PercentAmi | null>(null);

  const handleClose = () => {
    setShowModal(false);
    setPercentAmi(null);
  };

  const handleShowModal = (percentAmi: PercentAmi) => {
    setPercentAmi(percentAmi);
    setShowModal(true);
  };

  function getModalSentence(): string | undefined {
    if (type === tableType.availData) {
      if (props.program === ProgramKeyEnum.P345) {
        return ProgramLabelEnum[ProgramKeyEnum.P345];
      } else if (props.program === ProgramKeyEnum.P6) {
        return ProgramLabelEnum[ProgramKeyEnum.P6];
      } else {
        // TODO: Remove when there is no more unknown program types in listings.
        return "Unknown therefore both annual income limits are listed.";
      }
    }
  }

  function getModalData(
    percentAmi: PercentAmi
  ): [number[], number[]?] | undefined {
    if (type === tableType.availData) {
      if (props.program === ProgramKeyEnum.P345) {
        return [p345maxIncomeData[percentAmi]];
      } else if (props.program === ProgramKeyEnum.P6) {
        return [p6maxIncomeData[percentAmi]];
      } else {
        // TODO: Remove when there is no more unknown program types in listings.
        return [p345maxIncomeData[percentAmi], p6maxIncomeData[percentAmi]];
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

  function renderPercentageList(percentages: PercentAmi[]): ReactNode {
    if (!percentages) return null;

    return percentages.map((item, index) => (
      <Fragment key={index}>
        {item}
        {index < percentages.length - 1 ? ", " : ""}
      </Fragment>
    ));
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
            {type === tableType.availData && (
              <th style={{ whiteSpace: "nowrap" }}>Income</th>
            )}
            {/* TODO: Rent including utilities? */}
            {type === tableType.availData && <th>Rent</th>}
            {type === tableType.availData && (
              <th style={{ whiteSpace: "nowrap" }}>Apt #</th>
            )}
            {type === tableType.availData && (
              <th style={{ whiteSpace: "nowrap" }}>Move-in Date</th>
            )}
          </tr>
        </thead>
        <tbody>
          {type === tableType.amiData &&
            order.map((unit) => {
              const percentAmis = data[unit as keyof AmiData];

              if (!percentAmis) return null;

              return (
                <tr key={unit}>
                  <td>{unitSizeLabelEnum[unit]}</td>
                  <td>{renderPercentageList(percentAmis)}</td>
                </tr>
              );
            })}
          {type === tableType.availData &&
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
                        onClick={() => handleShowModal(percentAmi)}
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

      {percentAmi && type === tableType.availData && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Income Limits</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Determined by percent area median income (% AMI), household size,
              and program type.
              <br />
              <strong>% AMI: </strong>
              {percentAmi}
              <br />
              <strong>Program: </strong>
              {getModalSentence()}
            </p>

            <Table bordered hover size="sm" className="my-0" responsive>
              <thead>
                <tr>
                  <th>Household Size</th>
                  <th>{props.program ? "Max Annual Income" : "MFTE P6"}</th>
                  {!props.program && (
                    <th>
                      Other developer agreements (includes MFTE P3-5, IZ, MHA,
                      MPC-YT)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {props.program &&
                  getModalData(percentAmi)?.[0].map((percentData, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatCurrency(percentData)}</td>
                    </tr>
                  ))}

                {/* TODO: Delete when every listing has program data. */}
                {!props.program && getModalData(percentAmi)?.[0]
                  ? getModalData(percentAmi)?.[0].map((percentData, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {formatCurrency(
                            getModalData(percentAmi)?.[1]?.[index] ?? 0
                          )}
                        </td>
                        <td>{formatCurrency(percentData ?? 0)}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
            <div className="pt-2 text-muted">
              % AMI and program provided by building management. Max annual
              income limit data sourced from{" "}
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
