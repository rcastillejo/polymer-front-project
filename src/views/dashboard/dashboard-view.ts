import {
  LitElement,
  html,
  css,
  property,
  query,
  internalProperty,
  customElement,
} from 'lit-element';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import { SessionApp } from '../../session-app.js';
import { ConstantsApp } from '../../constants-app.js';

@customElement('dashboard-view')
export class DashboardView extends LitElement {
  @property({ type: String }) page = 'dashboard';

  @property({ type: String }) title = 'Dashboard';

  @property({ type: Number }) totalAmount = 100;

  @internalProperty() movements = [];

  @internalProperty() accounts = [{ balance: 3000, alias: '01' }];

  @query('#grid-movements') private gridMovements: any;
  @query('#grid-accounts') private gridAccounts: any;

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);

    const url = '/apitechu/v0/movements';
    fetch(ConstantsApp.IP + url, {
      headers: {
        Authorization: 'Bearer ' + SessionApp.userToken,
      },
    })
      .then(response => this.statusResponse(response))
      .then(res => res.json())
      .then(json => {
        this.movements = json;
        this.gridMovements.items = json;
        this.gridMovements.cellClassNameGenerator = function (
          column: { path: string },
          rowData: { item: { amount: number } }
        ) {
          if (column.path === 'amount') {
            return rowData.item.amount < 0 ? 'negative' : 'positive';
          }
        };
      })
      .catch(e => {
        console.log('Can’t access ' + url + ' response. info: ' + e);
        this.gridMovements.remove();
      });

    const url2 = '/apitechu/v0/accounts';
    fetch(ConstantsApp.IP + url2, {
      headers: {
        Authorization: 'Bearer ' + SessionApp.userToken,
      },
    })
      .then(response => this.statusResponse(response))
      .then(res => res.json())
      .then(json => {
        this.accounts = json;
        this.totalAmount = 0;
        this.accounts.forEach(account => (this.totalAmount += account.balance));
        this.gridAccounts.items = json;
      })
      .catch(e =>
        console.log('Can’t access ' + url2 + ' response. info: ' + e)
      );
  }
  statusResponse(response: Response) {
    //Validar que la respuesta es 200
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  render() {
    return html`
      <div>
        <h3 style="text-align: center;">Mis Movimientos</h3>
        <!-- <h2>Saldo: ${this.totalAmount}</h2> -->
        <!-- <button class="add">+</button>-->
        <!-- <vaadin-button class="add" @click=${this
          .addMovement}>+</vaadin-button>-->
        <vaadin-grid id="grid-movements" style="text-align: center;">
          <vaadin-grid-column
            header="Monto"
            width="15em"
            path="amount"
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Cuenta"
            width="5em"
            path="alias"
          ></vaadin-grid-column>
        </vaadin-grid>
        ${this.movements.length > 0
          ? html``
          : html`<h4 style="text-align: center; color: cornflowerblue;">
              No tienes movimientos
            </h4>`}

        <h3 style="text-align: center;">Mis Cuentas Vancarias</h3>
        <h4 style="text-align: center;">
          Saldo total: S/.<label style="color: dodgerblue; font-size: large;"
            >${this.totalAmount}</label
          >
        </h4>
        <vaadin-grid
          id="grid-accounts"
          style="text-align: center;"
          theme="row-stripes"
        >
          <vaadin-grid-column
            header="Cuenta"
            width="6em"
            path="alias"
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Saldo"
            width="2em"
            path="balance"
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Nº"
            width="10em"
            path="account"
          ></vaadin-grid-column>
        </vaadin-grid>
      </div>
      <!--<div style="width: 100%; background-color: white;">
          <table style="margin: 0 auto;">
          <tr style="margin-right: 20px;">${this.accounts.map(
        account => html`<th>${account.alias}</th>`
      )}</tr>
          <tr>${this.accounts.map(
        account => html`<td>${account.balance}</td>`
      )}</tr>
          </table>
        </div>-->
    `;
  }

  addMovement() {
    Router.go('/movement');
  }

  static get styles() {
    return css`
      vaadin-button.add {
        background-color: #2483f0;
        color: #ffffff;
        width: 30%;
        margin-left: 15px;
        height: 28px;
        font-weight: bold;
      }
      vaadin-grid-cell-content {
        text-align: center;
        font-size: large;
      }
      .hidden {
        visibility: hidden;
        height: auto;
      }
    `;
  }
}
