import styled from 'styled-components';

export const Wrapper = styled.div`
    width 80%;
    @media(min-width: 768px) {
    width: 60%;
    }
    @media(min-width: 1024px) {
    width: 40%;
    }
`;

export const ConfirmationButtons = styled.div`
	display: flex;
	justify-content: center;
`;

export const Message = styled.div`
	font-size: 0.9rem;
	margin-bottom: 10px;
	text-align: center;
`;

export const YesButton = styled.button`
	width: 6rem;
`;

export const NoButton = styled.button`
	width: 3rem;
  margin-left: 10px;
`;