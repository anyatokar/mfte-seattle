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
}

type BuildingDataTableProps = AmiDataProps | AvailDataProps;

const BuildingDataTable: React.FC<BuildingDataTableProps> = ({
  type,
  data,
}) => {
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
            <th>% AMI</th>
            {/* TODO: Rent including utilities? */}
            {type === tableType.availData && <th>Rent</th>}
            {type === tableType.availData && <th>Move-in Date</th>}
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
            data.map((unitAvailData) => {
              const {
                dateAvailString,
                maxRent,
                percentAmi,
                rowIndex,
                unitSize,
              } = unitAvailData;

              return unitSize && percentAmi ? (
                <tr key={rowIndex}>
                  <td style={{ minWidth: "65px" }}>
                    {unitSizeLabelEnum[unitSize]}
                  </td>
                  <td style={{ minWidth: "60px" }}>{percentAmi ?? "--"}</td>
                  <td>{formatCurrency(maxRent)}</td>
                  <td>
                    {dateAvailString ? formatDate(dateAvailString) : "--"}
                  </td>
                </tr>
              ) : null;
            })}
        </tbody>
      </Table>
    </>
  );
};

export default BuildingDataTable;
