import { Fragment, ReactNode } from "react";
import {
  // BedroomLabelEnum,
  // BedroomsKeyEnum,
  tableType,
} from "../types/enumTypes";
import { AvailData } from "../interfaces/IListing";
import Table from "react-bootstrap/Table";
import { formatCurrency, formatDate } from "../utils/generalUtils";
import { AmiData, AmiPercentage } from "../interfaces/IBuilding";

interface AmiDataProps {
  type: tableType.amiData;
  data: AmiData;
}

interface AvailDataProps {
  type: tableType.availData;
  data: AvailData[];
  showListingForm: boolean;
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = (props) => {
  const { type, data } = props;

  const order = ["micro", "studio", "oneBed", "twoBed", "threePlusBed"];

  const unitLabels: Record<string, string> = {
    micro: "Micro",
    studio: "Studio",
    oneBed: "One",
    twoBed: "Two",
    threePlusBed: "Three+",
  };

  const dataHeader = type === tableType.amiData ? "% of AMI" : "#";

  function renderPercentageList(percentages: AmiPercentage[]): ReactNode {
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
            <th>Size</th>
            <th>{dataHeader}</th>
            {type === tableType.availData && <th>Date</th>}
            {/* {type === tableType.availData && <th>% AMI</th>} */}
            {type === tableType.availData && <th>Max Rent</th>}
          </tr>
        </thead>
        <tbody>
          {type === tableType.amiData &&
            order.map((unit) => {
              const amiPercentages = data[unit as keyof AmiData];

              if (!amiPercentages) return null;

              return (
                <tr key={unit}>
                  <td>{unitLabels[unit]}</td>
                  <td>{renderPercentageList(amiPercentages)}</td>
                </tr>
              );
            })}
          {type === tableType.availData &&
            // order.map((unit) => {
            //   const availData = data[unit as keyof AvailData];

            //   if (!availData) return null;

            //   const {
            //     numAvail,
            //     dateAvailString,
            //     maxRent,
            //     // percentAmi,
            //   } = availData;

            //   return numAvail ? (
            //     <tr key={unit}>
            //       <td>{unitLabels[unit]}</td>
            //       <td>{numAvail}</td>
            //       <td>
            //         {dateAvailString ? formatDate(dateAvailString) : "--"}
            //       </td>
            //       {/* <td>{percentAmi ?? "--"}</td> */}
            //       <td>{formatCurrency(maxRent)}</td>
            //     </tr>
            //   ) : null;
            // }
            // )

            (data as AvailData[])?.map((availData) => {
              if (!availData) return null;

              const {
                unitSize,
                numAvail,
                dateAvailString,
                maxRent,
                // percentAmi,
              } = availData;

              return numAvail ? (
                <tr key={unitSize}>
                  <td>{unitLabels[unitSize]}</td>
                  <td>{numAvail}</td>
                  <td>
                    {dateAvailString ? formatDate(dateAvailString) : "--"}
                  </td>
                  {/* <td>{percentAmi ?? "--"}</td> */}
                  <td>{formatCurrency(maxRent)}</td>
                </tr>
              ) : null;
            })}
        </tbody>
      </Table>
    </>
  );
};

export default BuildingDataTable;
