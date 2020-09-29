import React from 'react';
import axios from 'axios';

import './styles.css';

interface State {
  loading: boolean;
  inputs: {
    email: { id: number; value: string };
    phone: { id: number; value: string };
    facebook: { id: number; value: string };
    twitter: { id: number; value: string };
    instagram: { id: number; value: string };
  };
}

const config = {
  cors: 'https://cors-anywhere.herokuapp.com/',
  formUrl:
    'https://docs.google.com/forms/u/0/d/e/1FAIpQLSetUoagD7eW0OSZKmQ6oxX5mcSaSzh0X5eygwO4Xl20cs7OCw/formResponse',
};

const Input = ({ name, label, doChange, type = 'text' }: any) => {
  return (
    <label htmlFor={name} className='form-label'>
      {label}
      <input type={type} id={name} name={name} onChange={doChange} />
    </label>
  );
};

export class ContactForm extends React.Component<{}, State> {
  state: State = {
    loading: false,
    inputs: {
      email: { id: 1045781291, value: '' },
      phone: { id: 1166974658, value: '' },
      facebook: { id: 1065046570, value: '' },
      twitter: { id: 839337160, value: '' },
      instagram: { id: 2131126462, value: '' },
    },
  };

  doSubmit = async (e: any) => {
    e.preventDefault();

    const { inputs }: any = this.state;
    const formData = new FormData();

    Object.keys(inputs).map((key: any) => {
      formData.append(`entry.${inputs[key].id}`, inputs[key].value);
    });

    await axios({
      url: `${config.cors}${config.formUrl}`,
      method: 'post',
      data: formData,
      responseType: 'json',
    })
      .then((response) => {
        console.log('response', response);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  handleChange = (e: any) => {
    const { value, name } = e.target;
    const { inputs }: any = this.state;

    inputs[name].value = value;

    this.setState({
      inputs,
    });
  };

  render() {
    return (
      <div className='main'>
        <form name='contact-form' onSubmit={this.doSubmit}>
          <fieldset>
            <legend>Stay in touch</legend>

            <Input
              name='email'
              label='Email'
              doChange={this.handleChange}
              type='email'
            />
            <Input
              name='phone'
              label='Phone number'
              doChange={this.handleChange}
            />
            <Input
              name='facebook'
              label='Facebook'
              doChange={this.handleChange}
            />
            <Input
              name='twitter'
              label='Twitter'
              doChange={this.handleChange}
            />
            <Input
              name='instagram'
              label='Instagram'
              doChange={this.handleChange}
            />
            <p>
              <button className='btn'>Submit</button>
            </p>
          </fieldset>
        </form>
      </div>
    );
  }
}
