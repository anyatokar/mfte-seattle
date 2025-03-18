import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { ProgramKeyEnum, ProgramLabelEnum } from "../types/enumTypes";
import Form from "react-bootstrap/esm/Form";

type ProgramProps = {
  selectedProgram: ProgramKeyEnum | undefined;
  onProgramInputChange?: (e: any) => void;
};

const Program: React.FC<ProgramProps> = ({
  selectedProgram,
  onProgramInputChange,
}) => {
  const programOptionsArray: ProgramKeyEnum[] = [
    ProgramKeyEnum.P6,
    ProgramKeyEnum.P345,
    ProgramKeyEnum.other,
  ];

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
              // onChange={(e) => handleInputChange(e)}
            />
          ))}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          {selectedProgram === ProgramKeyEnum.other && (
            <Form.Control required />
          )}
        </Col>
      </Row>
    </>
  ) : (
    <Row>
      <Col>
        <strong>Program:</strong>{" "}
        {selectedProgram ? ProgramLabelEnum[selectedProgram] : ""}
      </Col>
    </Row>
  );
};

export default Program;
