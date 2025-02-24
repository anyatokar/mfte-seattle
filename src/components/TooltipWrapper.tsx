import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type TooltipWrapperProps = {
  text: string;
  overlay: string;
};

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ text, overlay }) => {
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 200, hide: 800 }}
      overlay={<Tooltip id="tooltip">{overlay}</Tooltip>}
    >
      <span>{text}</span>
    </OverlayTrigger>
  );
};

export default TooltipWrapper;
