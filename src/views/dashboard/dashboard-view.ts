import {LitElement, html, css, property, query, internalProperty, customElement} from 'lit-element';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import { SessionApp } from '../../session-app.js'


@customElement("dashboard-view")
export class DashboardView extends LitElement {

  @property({type: String}) page = 'dashboard';

  @property({type: String}) title = 'Dashboard';

  @property({type: Number}) totalAmount = 523.76;

  @internalProperty() movements = [{amount: 120}, {amount: -70}, {amount: 25}, {amount: 30}];

  @internalProperty() accounts = [{balance: 3000, alias: "01"}];

  @query('#grid-movements') private gridMovements: any;

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);

    //this.movements = [];
    //const ip = 'http://techu-project-myproject.2886795277-80-kitek03.environments.katacoda.com';
    const ip = 'http://localhost:8002';
    const url = '/apitechu/v0/movements';
    fetch(ip + url, {
      headers: {
        'Authorization': 'Bearer ' + SessionApp.userToken
      }
    })
      .then(res => res.json())
      .then(json => {this.gridMovements.items = json; console.log(json);})
      .catch((e) => console.log("Can’t access " + url + " response. info: " + e))

    const url2 = '/apitechu/v0/accounts';
    fetch(ip + url2, {
      headers: {
        'Authorization': 'Bearer ' + SessionApp.userToken
      }
    })
      .then(res => res.json())
      .then(json => this.accounts = json)
      .catch((e) => console.log("Can’t access " + url2 + " response. info: " + e))

    //this.gridMovements.items = this.movements;

    this.gridMovements.cellClassNameGenerator = function (column: { path: string }, rowData: { item: { amount: number } }) {
      if (column.path === 'amount') {
        return rowData.item.amount < 0 ? 'negative' : 'positive';
      }
    };
  }

  render() {
    if (this.movements.length > 0) {
      return html`
        <div>
          <!-- <h2>Saldo: ${this.totalAmount}</h2> -->
           <!-- <button class="add">+</button>-->
          <vaadin-button class="add" @click=${this.addMovement}>+</vaadin-button>
          <vaadin-grid id="grid-movements" >
            <vaadin-grid-column header="Movimiento" path="amount"></vaadin-grid-column>
            <vaadin-grid-column header="" path="alias"></vaadin-grid-column>
          </vaadin-grid>
          <!--
          <ul class="movements">${this.movements.map(item => html`<move-ment amount="${item.amount}">${item}</move-ment>`)}</ul>
          -->
        </div>
        <div style="width: 100%; height: 100%; background-color: white;">
          <table style="margin: 0 auto;">
          <tr>${this.accounts.map(account => html`<th>${account.alias} </th>`)}</tr>
          <tr>${this.accounts.map(account => html`<td>${account.balance} </td>`)}</tr>
          </table>
        </div>
      `;
    } else {
      return html`
        <div>
          <h3>No tienes movimientos</h3>
        </div>
      `;
    }
  }

  addMovement() {
    console.log("adding movement");
    window.scrollTo(0, document.body.scrollHeight);
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
    `;
  }

}
