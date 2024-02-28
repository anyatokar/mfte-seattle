import { Fragment } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export interface ISortersProps<T> {
  object: T;
  onChangeSorter: (sortProperty: keyof T, isDescending: boolean) => void;
}

type DropdownButtonKeyType = "buildingName" | "residentialTargetedArea";

const dropdownMenuKeys: DropdownButtonKeyType[] = [
  "buildingName",
  "residentialTargetedArea",
];

export default function Sorters<T>(props: ISortersProps<T>) {
  const { onChangeSorter } = props;

  return (
    <Container fluid>
      <Row className="sort-bar">
        <Col className="mt-2 mt-lg-0 p-0">
          <Form>
            <Form.Label htmlFor="sorters">
              Sort buildings by name or neighborhood:
            </Form.Label>
            <Form.Select
              id="sorters"
              onChange={(event) =>
                onChangeSorter(
                  event.target.value.split(",")[0] as any,
                  event.target.value.split(",")[1] === "true"
                )
              }
            >
              {dropdownMenuKeys.map((dropdownMenuKey) => {
                if (
                  dropdownMenuKey === "buildingName" ||
                  dropdownMenuKey === "residentialTargetedArea"
                ) {
                  const dropdownMenuUILabels = {
                    buildingName: "Building name",
                    residentialTargetedArea: "Neighborhood",
                  };
                  return (
                    <Fragment key={dropdownMenuKey}>
                      <option value={[dropdownMenuKey, "false"]}>
                        {dropdownMenuUILabels[dropdownMenuKey]} (A to Z)
                      </option>
                      <option value={[dropdownMenuKey, "true"]}>
                        {dropdownMenuUILabels[dropdownMenuKey]} (Z to A)
                      </option>
                    </Fragment>
                  );
                } else {
                  return <></>;
                }
              })}
            </Form.Select>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
