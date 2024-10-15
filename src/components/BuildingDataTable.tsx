import { Fragment } from "react";
import { tableType } from "../types/enumTypes";
import { amiPercentageType, amiDataType } from "../interfaces/IBuilding";
import { availDataType } from "../interfaces/IListing";
import Table from "react-bootstrap/Table";
import { formatDate } from "../utils/generalUtils";

interface AmiDataProps {
  type: tableType.amiData;
  data: amiDataType[];
}

interface AvailDataProps {
  type: tableType.availData;
  data: availDataType[];
  showListingForm: boolean;
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = (props) => {
  const { type, data } = props;

  const unitLabels: Record<string, string> = {
    micro: "Micro",
    studio: "Studio",
    oneBed: "One",
    twoBed: "Two",
    threePlusBed: "Three+",
  };

  const dataHeader = type === tableType.amiData ? "% of AMI" : "# Available";

  function renderPercentageList(
    percentages: amiPercentageType[]
  ): React.ReactNode {
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
      {/* {type === tableType.availData && props.showListingForm && <p>Editing</p>} */}
      <Table bordered hover size="sm" className="mt-0" responsive>
        <thead>
          <tr>
            <th>Bedrooms</th>
            <th>{dataHeader}</th>
            {type === tableType.availData && <th>Earliest Date</th>}
          </tr>
        </thead>
        <tbody>
          {type === tableType.amiData &&
            (data as amiDataType[]).map((amiData) => {
              if (!amiData) return null;

              const { unitSize, amiPercentages } = amiData;

              return (
                <tr key={unitSize}>
                  <td>{unitLabels[unitSize]}</td>
                  <td>{renderPercentageList(amiPercentages)}</td>
                </tr>
              );
            })}
          {type === tableType.availData &&
            (data as availDataType[]).map((availData) => {
              if (!availData) return null;

              const { unitSize, numAvail, dateAvail } = availData;

              return numAvail > 0 ? (
                <tr key={unitSize}>
                  <td>{unitLabels[unitSize]}</td>
                  <td>{numAvail}</td>
                  <td>{dateAvail ? formatDate(dateAvail) : "--"}</td>
                </tr>
              ) : null;
            })}
        </tbody>
      </Table>
    </>
  );
};

export default BuildingDataTable;
