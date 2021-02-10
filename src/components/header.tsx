import { Navbar, Nav, ButtonGroup, Button, Modal } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Signup from '../auth_components/Signup';

import { Component, FunctionComponent, useState } from "react";
import { render } from "react-dom";
import { useModal } from '../useModal';
import Login from "../auth_components/Login"

export const Header = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

//   const { isShown, toggle } = useModal();
  
// const onConfirm = () => toggle();
// const onCancel = () => toggle();

const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <Navbar variant="light">
        <Nav className="mr-auto">
          <LinkContainer to='/'>
            <Nav.Link><strong>MFTE Simple</strong></Nav.Link>
          </LinkContainer>
          <LinkContainer to='/buildings'>
            <Nav.Link>All Buildings</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/about-mfte'>
            <Nav.Link>About MFTE</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/about-app'>
            <Nav.Link>About this app</Nav.Link>
          </LinkContainer>
          {/* <LinkContainer to='./pages/about'>
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
          <LinkContainer to='./pages/about'>
            <Nav.Link>About</Nav.Link>
          </LinkContainer> */}
                  </Nav>
          <ButtonGroup className='ml-auto'>

          <div className="btn-group btn-group-md" role="group" aria-label="logged in user button group">
            <a className="btn btn-info btn-group-btn" href="./saved-homes" role="button">Saved Homes</a>
            <a className="btn btn-info btn-group-btn" href="./saved-searches" role="button">Saved Searches</a>
            <Button variant="btn btn-info btn-group-btn" onClick={handleShow}>Sign up or Login</Button>

            


            <>
      
      <Modal show={show} onHide={handleClose}>

          <Login />
      </Modal>
    </>

            {/* <button onClick={toggle}>Open modal</button>
            <Modal
              isShown={isShown}
              hide={toggle}
              headerText='Confirmation'
              modalContent={
                <ConfirmationModal 
                  onConfirm={onConfirm} 
                  onCancel={onCancel}
                  message='Are you sure you want to delete element?'
                />
              }
            /> */}
          </div>
          </ButtonGroup>

      </Navbar>
    </div>
  )
}