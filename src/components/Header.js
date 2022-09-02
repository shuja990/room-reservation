import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>RESERVE ROOMS</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {userInfo ? (
                <>
                  <LinkContainer to="/">
                    <Nav.Link>Rooms</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/events">
                    <Nav.Link>Events</Nav.Link>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <>
                      <LinkContainer to="/admin/events">
                        <Nav.Link>Events Admin</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/admin/block-dates">
                        <Nav.Link>Block Dates</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/admin/add-room">
                        <Nav.Link>Add Room</Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
