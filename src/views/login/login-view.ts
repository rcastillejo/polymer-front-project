import { css, customElement, html, property, LitElement } from 'lit-element';
import '@vaadin/vaadin-login';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import { SessionApp } from '../../session-app.js';
import { ConstantsApp } from '../../constants-app.js';
import { Router } from '@vaadin/router';

@customElement('login-view')
export class LoginView extends LitElement {
  @property({ type: String }) message = '';

  render() {
    return html`
      <div id="logo">
        <img src="/src/images/logo.png" alt="Vank App logo" />
        <span>Vank App</span>
        <div style="text-align: center; color: red">
          <label>${this.message}</label>
        </div>
      </div>
      <div style="margin: auto; align-items: center; display: grid;">
        <vaadin-button
          style="margin: auto;"
          theme="success secondary medium"
          @click=${this.goSignup}
        >
          <iron-icon icon="lumo:user" slot="suffix"></iron-icon>
          Soy nuevo
        </vaadin-button>
      </div>
      <main>
        <vaadin-login-form></vaadin-login-form>
        <!--<vaadin-login-overlay></vaadin-login-overlay>-->
      </main>
      <vaadin-dialog no-close-on-outside-click id="feedbackDialog">
        <template>Iniciando sesión...</template>
      </vaadin-dialog>
      <vaadin-dialog id="supportDialog">
        <template>Por favor ir al Vanco.</template>
      </vaadin-dialog>
    `;
  }

  logIn(
    email: string,
    password: string,
    loginElement: any,
    feedbackDialog: any,
    p: LoginView
  ) {
    const data = {
      email: email,
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
      .then(response => this.statusResponse(response))
      .then(response => response.json())
      .then(response => {
        console.log('Success:', response);
        SessionApp.userToken = response.token;
        SessionApp.userName = data.email;
        this.getUser(data.email);
      })
      .catch(error => {
        p.message = 'Creedenciales erróneas, inténtelo de nuevo.';
        console.error(error);
      })
      .finally(() => {
        loginElement.disabled = false;
        feedbackDialog.opened = false;
      });
  }

  getUser(username: string) {
    const url = '/apitechu/v0/users?email=' + username;
    fetch(ConstantsApp.IP + url, {
      headers: {
        Authorization: 'Bearer ' + SessionApp.userToken,
      },
    })
      .then(response => this.statusResponse(response))
      .then(response => response.json())
      .then(response => {
        console.log('Success:', response);
        SessionApp.fullName =
          response[0].firstname + ' ' + response[0].lastname;
        SessionApp.sex = response[0].gender;
        Router.go('/');
      })
      .catch(error => {
        console.error(error);
      });
  }

  statusResponse(response: Response) {
    //Validar que la respuesta es 200
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  async firstUpdated(changedProperties: any) {
    const loginElement = this.shadowRoot?.querySelector<any>(
      'vaadin-login-form'
    );
    const feedbackDialog = this.shadowRoot?.querySelector<any>(
      '#feedbackDialog'
    );
    const supportDialog = this.shadowRoot?.querySelector<any>('#supportDialog');
    if (loginElement && feedbackDialog && supportDialog) {
      const i18n = {
        header: {
          title: 'Vank App',
          description: 'El mejor Vanco',
        },
        form: {
          title: 'Iniciar sesión',
          username: 'Correo electrónico',
          password: 'Contraseña',
          submit: 'Entrar',
          forgotPassword: 'Olvidé mi contraseña',
        },
        errorMessage: {
          title: 'Correo electrónico/Contraseña inválidos',
          message: 'Intentelo nuevamente',
        },
        additionalInformation: 'Powered by Renzo and Ricardo',
      };
      loginElement.i18n = i18n;

      loginElement.addEventListener('login', (e: any) => {
        this.message = '';
        feedbackDialog.opened = true;
        const username = e.detail.username;
        const password = e.detail.password;
        this.logIn(username, password, loginElement, feedbackDialog, this);
      });
      loginElement.addEventListener('forgot-password', function () {
        supportDialog.opened = true;
      });
    }
  }
  goSignup() {
    Router.go('/signUp');
  }

  static get styles() {
    return css`
      main {
        display: flex;
        justify-content: center;
        background: var(--main-background);
        padding: var(--main-padding);
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
