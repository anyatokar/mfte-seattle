import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import seattle from '../assets/images/seattler.jpg';

const HomePage: React.FunctionComponent<IPage> = props => {
    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props.name])

    return (
        <img src={seattle} alt="seattle" />
    )
}
export default HomePage;