import { Navbar, Nav } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export const Header = () => {
  return (
    <div className="navbar">
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
                  <div className="nav-buttons">
          {/* <a className="btn btn-info btn-md" href="./buildings" role="button">Saved Homes</a>
          <a className="btn btn-info btn-md" href="./about-mfte" role="button">Saved Searches</a>
          <a className="btn btn-info btn-md pull-right" href="./about-mfte" role="button">Sign up or Login</a> */}
        </div>
        </Nav>
      </Navbar>
    </div>
  )
}