import React, { FunctionComponent } from 'react';
import {
	ConfirmationButtons,
	Message,
	YesButton,
	NoButton,
	Wrapper,
} from './confirmation-modal.style';

interface ConfirmationModalProps {
	onConfirm: () => void;
	onCancel: () => void;
  message: string;
}

export const ConfirmationModal: FunctionComponent<
	ConfirmationModalProps
> = props => {
	return (
		<React.Fragment>
      <Message>{props.message}</Message>
      <ConfirmationButtons>
        <YesButton onClick={props.onConfirm}>Yes</YesButton>
        <NoButton onClick={props.onCancel}>No</NoButton>
      </ConfirmationButtons>
		</React.Fragment>
	);
};