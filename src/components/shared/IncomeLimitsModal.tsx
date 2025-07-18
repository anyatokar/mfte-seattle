import { useUnitAvailData } from "../../contexts/UnitAvailDataContext";
import { incomeTables } from "./BuildingDataTable";
import {
  TableTypeEnum,
  ProgramKeyEnum,
  ProgramLabelEnum,
} from "../../types/enumTypes";
import { formatCurrency } from "../../utils/generalUtils";
import { UnitAvailData } from "../../interfaces/IListing";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

type IncomeLimitsModalProps = {
  type: TableTypeEnum.availData;
};

const IncomeLimitsModal: React.FC<IncomeLimitsModalProps> = ({ type }) => {
  const { unitAvailDataContext } = useUnitAvailData();
  if (!unitAvailDataContext) return;

  /** When household size is not selected */
  function getModalData(
    unitAvailData: UnitAvailData
  ): [number[], number[]?] | undefined {
    const { percentAmi, selectedProgram } = unitAvailData;

    if (
      !percentAmi ||
      !selectedProgram ||
      selectedProgram === ProgramKeyEnum.other ||
      type !== TableTypeEnum.availData
    )
      return;

    const incomeTable = incomeTables[selectedProgram];
    return [incomeTable?.[percentAmi] || []];
  }

  function getModalSentence(): string | undefined {
    if (
      type === TableTypeEnum.availData &&
      unitAvailDataContext?.selectedProgram &&
      unitAvailDataContext?.selectedProgram !== ProgramKeyEnum.other
    ) {
      return ProgramLabelEnum[unitAvailDataContext.selectedProgram];
    }
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Income Limits</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Determined by percent Area Median Income (% AMI), household size, and
          program type.
          <br />
          <span style={{ fontWeight: "bold" }}>AMI: </span>
          {unitAvailDataContext.percentAmi}%
          <br />
          <span style={{ fontWeight: "bold" }}>Program: </span>{" "}
          {getModalSentence()}
        </p>

        <Table bordered hover size="sm" className="my-0" responsive>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>Household Size</th>
              <th style={{ whiteSpace: "nowrap" }}>
                {unitAvailDataContext.selectedProgram
                  ? "Max Annual Income"
                  : ProgramLabelEnum.P6}
              </th>
              {!unitAvailDataContext.selectedProgram && (
                <th>{ProgramLabelEnum.P345}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {unitAvailDataContext.selectedProgram &&
              getModalData(unitAvailDataContext)?.[0].map(
                (percentData, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatCurrency(percentData)}</td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
        <div className="pt-2 text-muted">
          Program and % AMI for the specific unit provided by building
          management. Max annual income limit data sourced from{" "}
          <a
            id="income-and-rent-limits"
            href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2025/2025_Rental_IncomeLimitsModal.pdf"
            title="Income and Rent Limits (FY 2025)"
            target="_blank"
            rel="noreferrer"
          >
            Seattle Office of Housing Income and Rent Limits
          </a>
          .
        </div>
      </Modal.Body>
    </>
  );
};

export default IncomeLimitsModal;
