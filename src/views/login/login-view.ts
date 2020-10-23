import {css, customElement, html, LitElement} from "lit-element";
import '@vaadin/vaadin-login';
import '@vaadin/vaadin-dialog';
import { SessionApp } from '../../session-app.js'
import { Router } from '@vaadin/router';

function statusResponse(response: Response) {
  //Validar que la respuesta es 200
  if (response.status === 200) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function logIn(email: string, password: string) {
  //todo hash password aqui y en signUp
  const data = {
    "email": email,
    "password": password
  };
  //const ip = 'http://techu-project-myproject.2886795277-80-kitek03.environments.katacoda.com';
  const ip = 'http://localhost:8002';
  const url = '/apitechu/v0/login';
  fetch(ip + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => statusResponse(response))
    .then(response => response.json())
    .then(response => {
      console.log('Success:', response);
      SessionApp.userToken = response.token;
      SessionApp.userName = email;
      Router.go('/');
    })
    .catch(error => console.error('Error:', error));
}

@customElement("login-view")
export class LoginView extends LitElement {
  render() {
    return html`
        <div id="logo">
            <img src="/src/images/logo.png" alt="Vank App logo" />
            <span>Vank App</span>
          </div>
      <main>
        <vaadin-login-form></vaadin-login-form>
        <!--<vaadin-login-overlay></vaadin-login-overlay>-->
      </main>
      <vaadin-dialog id="feedbackDialog">
        <template>Login is being processed...</template>
      </vaadin-dialog>
      <vaadin-dialog id="supportDialog">
        <template>Please contact support.</template>
      </vaadin-dialog>
      `;
  }
  async firstUpdated(changedProperties: any) {
    const login = this.shadowRoot?.querySelector<any>('vaadin-login-form');
    const feedbackDialog = this.shadowRoot?.querySelector<any>('#feedbackDialog');
    const supportDialog = this.shadowRoot?.querySelector<any>('#supportDialog');
    console.log(login);
    console.log(feedbackDialog);
    console.log(supportDialog);
    if(login && feedbackDialog && supportDialog) {
      login.addEventListener('login', function () {
          feedbackDialog.opened = true;

        /*setTimeout(function () {
          login.disabled = false;
          feedbackDialog.opened = false;
        }, 2000);*/

        logIn('lcastillejo@gmail.com', 'Admin1234');
      });

      login.addEventListener('forgot-password', function () {
        supportDialog.opened = true;
      });
    }

    //TODO ponerlo en español: https://vaadin.com/components/vaadin-login/html-examples/i18n-demos
    /*
    const vaadinLoginOverlay = this.shadowRoot?.querySelector<any>('vaadin-login-overlay');
    const i18n = {
      header: {
        title: 'Nome do aplicativo',
        description: 'Descrição do aplicativo'
      },
      form: {
        title: 'Acesse a sua conta',
        username: 'Correo electrónico',
        password: 'Contraseña',
        submit: 'Entrar',
        forgotPassword: 'Olvidé mi contraseña'
      },
      errorMessage: {
        title: 'Correo electrónico/Contraseña inválidos',
        message: 'Confira seu usuário e senha e tente novamente.'
      },
      additionalInformation: 'Neste exemplo, use as credenciais admin/admin para um login bem-sucedido.'
    };
    vaadinLoginOverlay.i18n = i18n;
    console.log(vaadinLoginOverlay);
     */
  }

  logIn(email: string, password: string) {

  }
  statusResponse(response: Response) {
    //Validar que la respuesta es 200
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
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
      #logo img{
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
