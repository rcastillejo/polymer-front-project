import { LitElement, html, css, property, customElement } from 'lit-element';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-select/vaadin-select';
import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-custom-field/vaadin-custom-field';
import '@vaadin/vaadin-dialog';
import { SessionApp } from '../../session-app.js';
import { ConstantsApp } from '../../constants-app.js';

@customElement('add-account-view')
export class AddAccountView extends LitElement {
  @property() alias = '';

  render() {
    return html`
      <vaadin-dialog no-close-on-outside-click aria-label="simple">
        <template>Creando...</template>
      </vaadin-dialog>
      <vaadin-form-layout>
        <vaadin-text-field
          @input=${this.updateAlias}
          label="Nombre de la nueva cuenta Vancaria"
          placeholder="Viajes"
          required
        >
        </vaadin-text-field>
      </vaadin-form-layout>
      <vaadin-horizontal-layout class="button-layout" theme="spacing">
        <vaadin-button
          style="margin: auto;"
          theme="primary large"
          @click=${this.createAccount}
        >
          <iron-icon icon="lumo:angle-right" slot="suffix"></iron-icon>
          Crear cuenta
        </vaadin-button>
      </vaadin-horizontal-layout>
    `;
  }

  updateAlias(e: { target: HTMLInputElement }) {
    this.alias = e.target.value;
  }

  createAccount() {
    if (!this.alias) {
      return;
    }
    const dialog = this.shadowRoot?.querySelector('vaadin-dialog');
    if (dialog) {
      dialog.opened = true;
    }
    const data = {
      alias: this.alias,
    };
    const url = '/apitechu/v0/accounts';
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
        Router.go('/');
      })
      .catch(error => console.error('Error:', error));
  }
  statusResponse(response: Response) {
    //Validar que la respuesta es 201
    if (response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 0 auto;
          max-width: 1024px;
          padding: 0 var(--lumo-space-l);
        }
        .button-layout {
          margin-bottom: var(--lumo-space-l);
          margin-top: var(--lumo-space-m);
        }
        vaadin-button theme='primary' {
          font-weight: bold;
        }
      `,
    ];
  }
}
