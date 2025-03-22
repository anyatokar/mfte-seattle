import { ProgramKeyEnum, ProgramLabelEnum } from "../types/enumTypes";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

type ProgramProps = {
  selectedProgram: ProgramKeyEnum | undefined;
  otherProgram: string | undefined;
};

const Program: React.FC<ProgramProps> = ({ selectedProgram, otherProgram }) => {
  const programValue = () => {
    if (!selectedProgram) return;

    if (selectedProgram === ProgramKeyEnum.other) {
      return otherProgram;
    } else {
      return ProgramLabelEnum[selectedProgram];
    }
  };

  return (
    <Row>
      <Col>
        <strong>Program:</strong> {programValue()}
      </Col>
    </Row>
  );
};

export default Program;
