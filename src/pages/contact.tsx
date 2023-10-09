import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Form, Button } from "react-bootstrap"
import firebase from "../db/firebase";

const ContactPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  type formFieldsType = {
    authorName: string,
    email: string,
    subject: string,
    message: string,
  }

  function sendMessageToDb(formFields:formFieldsType): void {
    firebase.firestore().collection("contactus").doc()
    .set({
      authorName: formFields.authorName,
      email: formFields.email,
      subject: formFields.subject,
      message: formFields.message,
      timestamp: new Date().toUTCString()
    })
    .then(() => {
      console.log('Message successfully submitted!');
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
    });
  };

  const [formFields, setformFields] = useState({
    authorName: '',
    email: '',
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

  const onformSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    sendMessageToDb(formFields)

    setformFields({
      authorName: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-5">Contact us</h1>
        <hr className="my-4"></hr>
        <p className="lead">
          We are always looking to improve this resource — your feedback is welcome and appreciated.
        </p>
        <Form onSubmit={onformSubmit}>
          <Form.Group className="form-row">
            <Form.Group className="form-group col-md-6">
            <Form.Control
              required
              name="authorName"
              id="authorName"
              onChange={onInputChange}
              value={formFields.authorName}
              placeholder="Name"
              />
            </Form.Group>
            <Form.Group className="form-group col-md-6">
              <Form.Control
                required
                name="email"
                id="email"
                onChange={onInputChange}
                value={formFields.email}
                placeholder="Email"
                />
            </Form.Group>
          </Form.Group>
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
              <option>Kind words</option>
              <option>Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="form-group col-mb-3">
            <Form.Control
              required
              as="textarea"
              name="message"
              id="message"
              rows={5}
              onChange={onInputChange}
              value={formFields.message}
              placeholder="Message"
            />
          </Form.Group>
          <Button type="submit" variant="info" className="btn-md standalone-btn">Send</Button>
        </Form>
      </div>
    </div>
  )
}

export default withRouter(ContactPage);
