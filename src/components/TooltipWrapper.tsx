import { Placement } from "react-bootstrap/types";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type TooltipWrapperProps = {
  label: string;
  overlay: string;
  placement: Placement;
};

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  label,
  overlay,
  placement,
}) => {
  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: 200, hide: 800 }}
      overlay={<Tooltip id="tooltip">{overlay}</Tooltip>}
    >
      <span>{label}</span>
    </OverlayTrigger>
  );
};

export default TooltipWrapper;
