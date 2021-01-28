import { Navbar, Nav, NavLink, Form, FormControl, Button, Image, Table } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export const Header = () => {
  return (
  <div>

          <Navbar bg="light" variant="light">
              <Nav className="mr-auto">
                  <LinkContainer to='/'>
                      <Nav.Link><strong>MFTE Simple</strong></Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/about'>
                      <Nav.Link>Properties</Nav.Link>
                  </LinkContainer>
                  {/* <LinkContainer to='./pages/about'>
                      <Nav.Link>About</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='./pages/about'>
                      <Nav.Link>About</Nav.Link>
                  </LinkContainer> */}
              </Nav>
              <Button>Saved Homes</Button>
              <Button>Saved Searches</Button>
              <Button>Sign up or Log in</Button>
              
          </Navbar>
  </div>
  )
}