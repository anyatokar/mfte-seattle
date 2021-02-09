import { Navbar, Nav, ButtonGroup } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export const Header = () => {
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
            <a className="btn btn-info btn-group-btn" href="./about-mfte" role="button">Sign up or Login</a>

          </div>
          </ButtonGroup>

      </Navbar>
    </div>
  )
}