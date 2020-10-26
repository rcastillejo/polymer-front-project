import {
  LitElement,
  html,
  css,
  property,
  customElement,
  internalProperty,
} from 'lit-element';
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

@customElement('add-movement-others-view')
export class AddMovementOthersView extends LitElement {
  @property() from = '';
  @property() to = '';
  @property({ type: Number }) amount = 0;

  @property() toMySelf = false;

  @internalProperty() accounts = [
    { balance: 3000, alias: 'A', account: '01' },
    { balance: 200, alias: 'B', account: '02' },
  ];

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);

    customElements.whenDefined('vaadin-select').then(() => {
      const url2 = '/apitechu/v0/accounts';
      fetch(ConstantsApp.IP + url2, {
        headers: {
          Authorization: 'Bearer ' + SessionApp.userToken,
        },
      })
        .then(res => res.json())
        .then(json => {
          this.accounts = json;
          this.init();
        })
        .catch(e =>
          console.log('Can’t access ' + url2 + ' response. info: ' + e)
        );
    });
  }

  init() {
    this.from = this.accounts[0].account;
    console.log(this.from);
    console.log(this.accounts);
    const selectFrom = this.shadowRoot?.querySelector<any>('#accountFrom');
    selectFrom.renderer = (root: any) => {
      if (root.firstChild) {
        return;
      }
      const listBox = window.document.createElement('vaadin-list-box');
      this.accounts.forEach(account => {
        const vaadinItem = this.shadowRoot?.ownerDocument?.createElement(
          'vaadin-item'
        );
        if (vaadinItem) {
          vaadinItem.textContent = account.alias + ' - S/.' + account.balance;
          vaadinItem.setAttribute('value', account.account);
          listBox.appendChild(vaadinItem);
        }
      });
      root.appendChild(listBox);
      selectFrom.setAttribute('value', this.accounts[0].account);
    };

    selectFrom.addEventListener('change', (e: any) => {
      this.updateFrom(e);
    });
    if (this.toMySelf) {
      this.to = this.accounts[1].account;
      const selectTo = this.shadowRoot?.querySelector<any>('#accountTo');
      selectTo.renderer = (root: any) => {
        if (root.firstChild) {
          return;
        }
        const listBox = window.document.createElement('vaadin-list-box');
        this.accounts.forEach(account => {
          const vaadinItem = this.shadowRoot?.ownerDocument?.createElement(
            'vaadin-item'
          );
          if (vaadinItem) {
            vaadinItem.textContent = account.alias + ' - S/.' + account.balance;
            vaadinItem.setAttribute('value', account.account);
            listBox.appendChild(vaadinItem);
          }
        });
        root.appendChild(listBox);
        selectTo.setAttribute('value', this.accounts[1].account);
      };
      selectTo.addEventListener('change', (e: any) => {
        this.updateTo(e);
      });
    }
  }

  render() {
    return html`
      <vaadin-dialog no-close-on-outside-click aria-label="simple">
        <template>Transfiriendo...</template>
      </vaadin-dialog>
      <vaadin-form-layout>
        <vaadin-custom-field label="Mi cuenta" required>
          <vaadin-horizontal-layout theme="spacing">
            <vaadin-select id="accountFrom" style="flex-grow: 1; width: 100px;"></vaadin-select>
        </vaadin-custom-field>

         ${
           this.toMySelf
             ? html`
            <vaadin-custom-field label="Cuenta destino" required>
                <vaadin-horizontal-layout theme="spacing">
                <vaadin-select id="accountTo" style="flex-grow: 1; width: 100px;"></vaadin-select>
            </vaadin-custom-field>
         `
             : html` <vaadin-text-field
                 @input=${this.updateTo}
                 error-message="Por favor ingrese una cuenta válida"
                 label="Cuenta destino"
                 placeholder="5f7cedfd1f6e4f5765fedd62"
                 pattern="[A-Za-z0-9]+"
                 prevent-invalid-input
                 required
               ></vaadin-text-field>`
         }

        </vaadin-text-field>
        <!--<vaadin-number-field value="1" min="1" max="10" has-controls></vaadin-number-field>-->
        <vaadin-number-field
            clear-button-visible
            required
            placeholder="0.00"
            min="1.0"
            label="Monto"
            @input=${this.updateAmount}
          ><div slot="prefix">S/</div></vaadin-number-field>
      </vaadin-form-layout>
      <vaadin-horizontal-layout class="button-layout" theme="spacing">
        <vaadin-button style="margin: auto;" theme="primary large" @click=${
          this.trasnfer
        }>
        <iron-icon icon="lumo:arrow-right" slot="suffix"></iron-icon>
        Confirmar
        </vaadin-button>
      </vaadin-horizontal-layout>
    `;
  }

  updateFrom(e: { target: HTMLInputElement }) {
    this.from = e.target.value;
  }

  updateTo(e: { target: HTMLInputElement }) {
    this.to = e.target.value;
  }

  updateAmount(e: { target: HTMLInputElement }) {
    const amount = Number(e.target.value);
    if (Number.isNaN(amount) || this.checkInvalidAmount(amount, this.from)) {
      e.target.value = this.amount.toString();
      return;
    }
    this.amount = amount;
    console.log(amount);
  }

  checkInvalidAmount(amount: number, accountId: string) {
    return (
      amount >
      this.accounts.filter(account => account.account === accountId)[0].balance
    );
  }

  trasnfer() {
    if (!this.to || !this.amount || this.amount <= 0 || this.to === this.from) {
      return;
    }
    const dialog = this.shadowRoot?.querySelector('vaadin-dialog');
    if (dialog) {
      dialog.opened = true;
    }
    const data = {
      to: this.to,
      amount: this.amount,
    };
    const url = '/apitechu/v0/accounts/' + this.from + '/movements';
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
