import './Profile.css';

import jwtDecode from 'jwt-decode';
import React from 'react';
import Blockies from 'react-blockies';
import axios from 'axios';

import { Auth } from '../types';

interface Props {
  auth: Auth;
  onLoggedOut: () => void;
}

interface State {
  loading: boolean;
  user?: {
    id: number;
    username: string;
  };
  username: string;
  email: string;
  phone: string;
  facebook: string;
  twitter: string;
}

export class Profile extends React.Component<Props, State> {
  state: State = {
    loading: false,
    user: undefined,
    username: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: '',
  };

  CORS_PROXY = 'http://localhost:3000/';
  GOOGLE_FORM_EMAIL_ID = 'entry.1045781291';
  GOOGLE_FORM_PHONE_ID = 'entry.1166974658';
  GOOGLE_FORM_FB_ID = 'entry.1065046570';
  GOOGLE_FORM_TW_ID = 'entry.839337160';
  GOOGLE_FORM_ACTION =
    'https://docs.google.com/forms/u/0/d/e/1FAIpQLSetUoagD7eW0OSZKmQ6oxX5mcSaSzh0X5eygwO4Xl20cs7OCw/formResponse';

  componentDidMount() {
    const {
      auth: { accessToken },
    } = this.props;
    const {
      payload: { id },
    } = jwtDecode(accessToken);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((user) => this.setState({ user }))
      .catch(window.alert);
  }

  handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: value });
  };

  handleSubmit = () => {
    const {
      auth: { accessToken },
    } = this.props;
    const { user, username } = this.state;

    this.setState({ loading: true });

    if (!user) {
      window.alert(
        'The user id has not been fetched yet. Please try again in 5 seconds.'
      );
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
      body: JSON.stringify({ username }),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    })
      .then((response) => response.json())
      .then((user) => this.setState({ loading: false, user }))
      .catch((err) => {
        window.alert(err);
        this.setState({ loading: false });
      });
  };

  handleFormSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append(this.GOOGLE_FORM_EMAIL_ID, this.state.email);
    formData.append(this.GOOGLE_FORM_PHONE_ID, this.state.phone);
    formData.append(this.GOOGLE_FORM_FB_ID, this.state.facebook);
    formData.append(this.GOOGLE_FORM_TW_ID, this.state.twitter);

    axios
      .post(this.GOOGLE_FORM_ACTION, formData)
      .then(() => {
        this.setState({
          email: '',
          phone: '',
          facebook: '',
          twitter: '',
        });
        alert('Your contacts submitted successfully');
      })
      .catch((err) => {
        alert(err.message ? err.message : err);
      });
  };

  render() {
    const {
      auth: { accessToken },
      onLoggedOut,
    } = this.props;
    const {
      payload: { publicAddress },
    } = jwtDecode(accessToken);
    const { loading, user } = this.state;

    const username = user && user.username;

    return (
      <div className='Profile'>
        <p>
          Logged in as <Blockies seed={publicAddress} />
        </p>
        <div>
          My username is {username ? <pre>{username}</pre> : 'not set.'} My
          publicAddress is <pre>{publicAddress}</pre>
        </div>

        <div className='form-container'>
          <form onSubmit={this.handleFormSubmit}>
            <div className='form-group row'>
              <label htmlFor='email' className='col-sm-2 col-form-label'>
                Email:
              </label>
              <div className='col-sm-8'>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='form-control'
                  value={this.state.email}
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='message' className='col-sm-2 col-form-label'>
                Phone:
              </label>
              <div className='col-sm-8'>
                <input
                  id='phone'
                  name='phone'
                  className='form-control'
                  required
                  value={this.state.phone}
                  onChange={(e) => {
                    this.setState({ phone: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='message' className='col-sm-2 col-form-label'>
                Facebook:
              </label>
              <div className='col-sm-8'>
                <input
                  id='facebook'
                  name='facebook'
                  className='form-control'
                  required
                  value={this.state.facebook}
                  onChange={(e) => {
                    this.setState({ facebook: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='message' className='col-sm-2 col-form-label'>
                Twitter:
              </label>
              <div className='col-sm-8'>
                <input
                  id='twitter'
                  name='twitter'
                  className='form-control'
                  required
                  value={this.state.twitter}
                  onChange={(e) => {
                    this.setState({ twitter: e.target.value });
                  }}
                />
              </div>
            </div>
            <div>
              <button
                type='submit'
                className='btn btn-sm btn-default btn-action'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* <div>
          <label htmlFor='username'>Change username: </label>
          <input name='username' onChange={this.handleChange} />
          <button disabled={loading} onClick={this.handleSubmit}>
            Submit
          </button>
        </div> */}
        <p>
          <button onClick={onLoggedOut}>Logout</button>
        </p>
      </div>
    );
  }
}
