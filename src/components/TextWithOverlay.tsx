import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type TextWithOverlayProps = {
  text: string;
  overlay: string;
};

const TextWithOverlay: React.FC<TextWithOverlayProps> = ({ text, overlay }) => {
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 200, hide: 800 }}
      overlay={<Tooltip id="button-tooltip">{overlay}</Tooltip>}
    >
      <span>{text}</span>
    </OverlayTrigger>
  );
};

export default TextWithOverlay;
