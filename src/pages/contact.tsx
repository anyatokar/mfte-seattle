import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Form, Button } from "react-bootstrap"
import firebase from "../db/firebase";

const ContactPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  type formFieldsType = {
    authorName: string,
    email: string,
    description: string,
    subject: string,
    message: string,
  }

  function sendMessageToDb(formFields:formFieldsType): void {
    firebase.firestore().collection("contactus").doc()
    .set({
      authorName: formFields.authorName,
      email: formFields.email,
      subject: formFields.subject,
      description: formFields.description,
      message: formFields.message,
      timestamp: new Date().toUTCString()
    })
    .then(() => {
      console.log('Message successfully submitted!');
      clearFields()
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
    });
  };

  function clearFields(): void {
    setformFields({
      authorName: '',
      email: '',
      description: '',
      subject: '',
      message: '',
    });
  }

  const [formFields, setformFields] = useState({
    authorName: '',
    email: '',
    description: '',
    subject: '',
    message: '',
  });

  // event handlers
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event): void => {
    const newformFields = {
      ...formFields,
    }
    newformFields[event.target.name as keyof formFieldsType] = event.target.value;
    setformFields(newformFields);
  }

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    sendMessageToDb(formFields)
  };

  return (
    <Container className="all-pages diy-jumbotron">
      <h1 className="display-5">Contact us</h1>
      <hr className="my-4"></hr>
      <p className="lead">
        We are always looking to improve this resource — your feedback is welcome and appreciated.
      </p>
      <ul>
        <li>
          Please contact the&nbsp;
          <a id="seattle-housing-website"
            href="https://seattle.gov/housing"
            title="Seattle Office of Housing government website"
            target="_blank"
            rel="noreferrer">
            Seattle Office of Housing
          </a>&nbsp;with general questions about the MFTE program.
        </li>
        <li>
          Contact properties directly with building-specific questions including apartment availability, details on tenant eligibility, and the application process.
        </li>
      </ul>
      <p>All fields are required</p>
      <Form onSubmit={handleFormSubmit}>

        <Form.Group className="form-row">
          <Form.Group className="form-group col-md-6">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              name="authorName"
              id="authorName"
              onChange={onInputChange}
              value={formFields.authorName}
            />
          </Form.Group>
          <Form.Group className="form-group col-md-6">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              id="email"
              onChange={onInputChange}
              value={formFields.email}
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            as="select"
            name="description"
            id="description"
            onChange={onInputChange}
            value={formFields.description}
          >
            <option key='blankChoice' hidden></option>
            <option>Prospective renter</option>
            <option>Company representative</option>
            <option>Government representative</option>
            <option>None of the above</option>
          </Form.Control>
        </Form.Group>

        <hr className="my-4 break-line heavy-break-line"></hr>

        <Form.Group className="form-group">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            required
            as="select"
            name="subject"
            id="subject"
            onChange={onInputChange}
            value={formFields.subject}
          >
            <option key = 'blankChoice' hidden></option>
            <option>Feature suggestion</option>
            <option>Incorrect building data</option>
            <option>Website bug report</option>
            <option>Help with using this website</option>
            <option>Kind words</option>
            <option>Other</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="form-group col-mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            required
            as="textarea"
            name="message"
            id="message"
            rows={5}
            onChange={onInputChange}
            value={formFields.message}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="info"
          className="btn-lg">
          Send message
        </Button>
      </Form>
    </Container>
  )
}

export default withRouter(ContactPage);
