import { LitElement, html, css, property, customElement } from 'lit-element';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-email-field';
import '@vaadin/vaadin-text-field/vaadin-password-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import { SessionApp } from '../../session-app.js';
import { ConstantsApp } from '../../constants-app.js';

@customElement('signup-view')
export class AddMovementView extends LitElement {
  @property() firstname = '';
  @property() lastname = '';
  @property() sex = '';
  @property() username = '';
  @property() password = '';
  @property() accountAlias = '';

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
  }

  render() {
    return html`
      <div id="logo">
        <img src="/src/images/logo.png" alt="Vank App logo" />
        <span>Vank App</span>
      </div>
      <vaadin-dialog no-close-on-outside-click aria-label="simple">
        <template>Creando cuenta...</template>
      </vaadin-dialog>
      <vaadin-form-layout>
        <vaadin-text-field
          clear-button-visible
          required
          placeholder="Renzo Ricardo"
          label="Nombres"
          @input=${this.updateFirstName}
        ></vaadin-text-field>
        <vaadin-text-field
          clear-button-visible
          required
          placeholder="Villavisencio Castillejo"
          label="Apellidos"
          @input=${this.updateLastname}
        ></vaadin-text-field>
        <vaadin-radio-group label="Sexo" style="text-align: center;" required>
          <vaadin-radio-button @change=${this.updateSexFemale}>
            <img
              style="width: 21px; border-radius: 50%; vertical-align: bottom;"
              src="/src/images/user_female.png"
            />
            Femenino
          </vaadin-radio-button>
          <vaadin-radio-button @change=${this.updateSexMale}>
            <img
              style="width: 21px; border-radius: 50%; vertical-align: bottom;"
              src="/src/images/user_male.png"
            />
            Masculino
          </vaadin-radio-button>
        </vaadin-radio-group>
        <vaadin-text-field
          label="Nombre de tu cuenta Vancaria"
          placeholder="Ahorros"
          required
          clear-button-visible
          @input=${this.updateAccountAlias}
        ></vaadin-text-field>
        <vaadin-email-field
          error-message="Por favor ingrese un correo válido"
          label="Correo electrónico"
          placeholder="renzof@gmail.com"
          required
          clear-button-visible
          @input=${this.updateUsername}
        ></vaadin-email-field>
        <vaadin-password-field
          label="Contraseña"
          prevent-invalid-input
          required
          clear-button-visible
          @input=${this.updatePassword}
        ></vaadin-password-field>
        <vaadin-button
          theme="primary large"
          style="margin: auto; margin-top: 30px;"
          @click=${this.signUp}
        >
          <iron-icon icon="lumo:user" slot="suffix"></iron-icon>
          Crear cuenta
        </vaadin-button>
      </vaadin-form-layout>
      <vaadin-horizontal-layout
        class="button-layout"
        theme="spacing"
        style="display: grid;"
      >
        <br />
        <vaadin-button
          theme="secondary"
          style="margin: auto;"
          @click=${this.goLogin}
        >
          <iron-icon icon="lumo:arrow-left" slot="suffix"></iron-icon>
          Iniciar sesión
        </vaadin-button>
      </vaadin-horizontal-layout>
    `;
  }

  goLogin() {
    Router.go('/login');
  }

  updateUsername(e: { target: HTMLInputElement }) {
    this.username = e.target.value;
  }

  updatePassword(e: { target: HTMLInputElement }) {
    this.password = e.target.value;
  }

  updateFirstName(e: { target: HTMLInputElement }) {
    this.firstname = e.target.value;
  }

  updateLastname(e: { target: HTMLInputElement }) {
    this.lastname = e.target.value;
  }
  updateSexFemale(e: { target: HTMLInputElement }) {
    this.sex = 'F';
  }
  updateSexMale(e: { target: HTMLInputElement }) {
    this.sex = 'M';
  }
  updateAccountAlias(e: { target: HTMLInputElement }) {
    this.accountAlias = e.target.value;
  }

  signUp() {
    if (
      !this.firstname ||
      !this.lastname ||
      !this.username ||
      !this.sex ||
      !this.password ||
      !this.accountAlias
    ) {
      return;
    }

    const dialog = this.shadowRoot?.querySelector('vaadin-dialog');
    if (dialog) {
      dialog.opened = true;
    }

    const data = {
      firstname: this.firstname,
      lastname: this.lastname,
      gender: this.sex,
      email: this.username,
      password: this.password,
    };
    const url = '/apitechu/v0/users/';
    fetch(ConstantsApp.IP + url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => this.statusResponse(response))
      .then(response => response.json())
      .then(response => {
        console.log('Success:', response);
        SessionApp.userToken = response.token;
        SessionApp.userName = data.email;
        this.logIn(data.email, data.password, this.accountAlias);
        SessionApp.fullName = data.firstname + ' ' + data.lastname;
        SessionApp.sex = data.gender;
      })
      .catch(error => {
        console.error('Error:', error);
        Router.go('/signup');
      });
  }
  logIn(username: string, password: string, accountAlias: string) {
    const data = {
      email: username,
      password: password,
    };
    const url = '/apitechu/v0/login';
    fetch(ConstantsApp.IP + url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => this.statusResponseLogin(response))
      .then(response => response.json())
      .then(response => {
        console.log('Success:', response);
        SessionApp.userToken = response.token;
        SessionApp.userName = data.email;
        this.createAccount(accountAlias);
      })
      .catch(error => {
        console.error(error);
        Router.go('/signup');
      });
  }
  createAccount(accountAlias: string) {
    const data = {
      alias: this.accountAlias,
      balance: 100,
    };
    const url = '/apitechu/v0/accounts/';
    fetch(ConstantsApp.IP + url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + SessionApp.userToken,
      },
    })
      .then(response => this.statusResponse(response))
      .then(response => response.json())
      .then(response => {
        console.log('Success:', response);
        this.posSignup();
      })
      .catch(error => {
        console.error('Error:', error);
        Router.go('/signup');
      });
  }
  posSignup() {
    Router.go('/');
  }
  statusResponse(response: Response) {
    //Validar que la respuesta es 201
    if (response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
  statusResponseLogin(response: Response) {
    //Validar que la respuesta es 200
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 0 auto;
        max-width: 1024px;
        padding: 0 var(--lumo-space-l);
      }
      #logo {
        margin: auto;
        align-items: center;
        box-sizing: border-box;
        display: grid;
        padding: var(--lumo-space-s) var(--lumo-space-m);
      }
      #logo img {
        margin: auto;
      }
      #logo span {
        text-align: center;
        font-size: var(--lumo-font-size-xl);
        font-weight: 600;
        margin: 0 var(--lumo-space-s);
      }
    `;
  }
}
