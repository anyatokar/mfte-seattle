import { ProgramKeyEnum, ProgramLabelEnum } from "../types/enumTypes";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

type ProgramProps = {
  selectedProgram: ProgramKeyEnum | undefined;
  otherProgram: string | undefined;
  onProgramInputChange?: (e: any) => void;
};

const Program: React.FC<ProgramProps> = ({
  selectedProgram,
  otherProgram,
  onProgramInputChange,
}) => {
  const programOptionsArray: ProgramKeyEnum[] = [
    ProgramKeyEnum.P6,
    ProgramKeyEnum.P345,
    ProgramKeyEnum.other,
  ];

  const programValue = () => {
    if (!selectedProgram) return;

    if (selectedProgram === ProgramKeyEnum.other) {
      return otherProgram;
    } else {
      return ProgramLabelEnum[selectedProgram];
    }
  };

  return onProgramInputChange ? (
    <>
      <Row>
        <Col>
          <Form.Label className="mb-0 fw-bold">Program</Form.Label>
          {programOptionsArray.map((program) => (
            <Form.Check
              required
              key={program}
              type="radio"
              label={ProgramLabelEnum[program]}
              name="program"
              id={program}
              value={program}
              checked={selectedProgram === program}
              onChange={(e) => onProgramInputChange(e)}
            />
          ))}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          {selectedProgram === ProgramKeyEnum.other && (
            <Form.Control
              required
              name="otherProgram"
              onChange={(e) => onProgramInputChange(e)}
              value={otherProgram}
            />
          )}
        </Col>
      </Row>
    </>
  ) : (
    <Row>
      <Col>
        <strong>Program:</strong> {programValue()}
      </Col>
    </Row>
  );
};

export default Program;
