import { tableType } from "../types/enumTypes";
import { AMIPercentage, amiDataType } from "../interfaces/IBuilding";
import { availDataType } from "../interfaces/IListing";

import Table from "react-bootstrap/Table";
import { Fragment } from "react";

interface BuildingDataTableProps {
  type: tableType;
  data: amiDataType | availDataType;
}

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

  const dataHeader =
    type === tableType.amiData ? "% of AMI" : "Available Units";

  function renderPercentageList(percentages: AMIPercentage[]): React.ReactNode {
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
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, value]) => {
          if (!value) return null;
          return (
            <tr key={key}>
              <td>{unitLabels[key]}</td>
              <td>
                {type === tableType.amiData
                  ? renderPercentageList(value)
                  : value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default BuildingDataTable;
