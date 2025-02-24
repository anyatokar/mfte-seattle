import { Fragment, ReactNode } from "react";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  tableType,
} from "../types/enumTypes";
import Table from "react-bootstrap/Table";
import { formatCurrency, formatDate } from "../utils/generalUtils";
import { AmiData, AmiPercentage } from "../interfaces/IBuilding";
import { AvailDataArray } from "../interfaces/IListing";

interface AmiDataProps {
  type: tableType.amiData;
  data: AmiData;
}

interface AvailDataProps {
  type: tableType.availData;
  data: AvailDataArray;
  showListingForm: boolean;
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = (props) => {
  const { type, data } = props;

  const order: BedroomsKeyEnum[] = [
    BedroomsKeyEnum.MICRO,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ];

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
            {type === tableType.availData && <th>% AMI</th>}
            {/* TODO: Rent including untilities? */}
            {type === tableType.availData && <th>Rent</th>}
            {type === tableType.availData && <th>Move-in Date</th>}
            {type === tableType.availData && <th># Available</th>}
          </tr>
        </thead>
        <tbody>
          {type === tableType.amiData &&
            order.map((unit) => {
              const amiPercentages = data[unit as keyof AmiData];

              if (!amiPercentages) return null;

              return (
                <tr key={unit}>
                  <td>{unitSizeLabelEnum[unit]}</td>
                  <td>{renderPercentageList(amiPercentages)}</td>
                </tr>
              );
            })}
          {type === tableType.availData &&
            order.map((unit) => {
              const unitAvailData = data?.find((ele) => ele.unitSize === unit);

              if (!unitAvailData) return null;

              const { numAvail, dateAvailString, maxRent, percentAmi } =
                unitAvailData;

              return numAvail ? (
                <tr key={unit}>
                  <td style={{ minWidth: "65px" }}>
                    {unitSizeLabelEnum[unit]}
                  </td>
                  <td>{percentAmi ?? "--"}</td>
                  <td>{formatCurrency(maxRent)}</td>
                  <td>
                    {dateAvailString ? formatDate(dateAvailString) : "--"}
                  </td>
                  <td>{numAvail}</td>
                </tr>
              ) : null;
            })}
        </tbody>
      </Table>
    </>
  );
};

export default BuildingDataTable;
