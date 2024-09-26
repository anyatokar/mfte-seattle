import { Fragment } from "react";
import { tableType } from "../types/enumTypes";

import { amiPercentageType, amiDataType } from "../interfaces/IBuilding";
import { availDataType } from "../interfaces/IListing";

import Table from "react-bootstrap/Table";

interface AmiDataProps {
  type: "amiData";
  data: amiDataType[];
}

interface AvailDataProps {
  type: "availData";
  data: availDataType[];
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = ({
  type,
  data,
}) => {
  const unitLabels: Record<string, string> = {
    micro: "Micro",
    studio: "Studio",
    oneBed: "One",
    twoBed: "Two",
    threePlusBed: "Three+",
  };

  const dataHeader = type === tableType.amiData ? "% of AMI" : "# Available";

  function renderPercentageList(percentages: amiPercentageType[]): React.ReactNode {
    if (!percentages) return null;

    return percentages.map((item, index) => (
      <Fragment key={index}>
        {item}
        {index < percentages.length - 1 ? ", " : ""}
      </Fragment>
    ));
  }

  return (
    <Table bordered hover size="sm">
      <thead>
        <tr>
          <th>Bedrooms</th>
          <th>{dataHeader}</th>
          {type === tableType.availData && <th>Earliest Date</th>}
        </tr>
      </thead>
      <tbody>
        {type === tableType.amiData &&
          data.map((amiData: amiDataType) => {
            if (!amiData) return null;

            const { unitSize, amiPercentages } = amiData;

            return (
              <tr key={unitSize}>
                <td>{unitLabels[unitSize]}</td>
                <td>
                  {renderPercentageList(amiPercentages)}
                </td>
              </tr>
            );
          })}
        {type === tableType.availData &&
          data.map((availData: availDataType) => {
            if (!availData) return null;

            const { unitSize, numAvail, dateAvail } = availData;

            return numAvail > 0 ? (
              <Fragment key={unitSize}>
                <tr>
                  <td>{unitLabels[unitSize]}</td>
                  <td>{numAvail}</td>
                  <td>
                    {dateAvail ? dateAvail.toDate().toLocaleDateString() : "--"}
                  </td>
                </tr>
              </Fragment>
            ) : null;
          })}
      </tbody>
    </Table>
  );
};

export default BuildingDataTable;
