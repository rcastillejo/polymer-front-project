import {LitElement, html, css, property, customElement} from 'lit-element';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import { SessionApp } from '../../session-app.js'


@customElement("add-movement-view")
export class AddMovementView extends LitElement {

  @property() from = "5f7cedf15d0e65146b2a00da";
  @property() to = "5f7cedfd1f6e4f5765fedd62";
  @property({type: Number}) amount = 50;

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
  }

  render() {
    return html`
        <div style="margin: 50px">
          <div>
            <div>
            <label>De: </label>
              <vaadin-text-field value=${this.from} @input=${this.updateFrom}></vaadin-text-field>
              </div>
            <div>
            <label>A: </label>
              <vaadin-text-field value=${this.to} @input=${this.updateTo}></vaadin-text-field>
              </div>
            <div>
              <label>Monto: </label>
              <vaadin-text-field value=${this.amount} @input=${this.updateAmount}></vaadin-text-field>
            </div>
          </div>
          <div>
            <vaadin-button class="confirm" @click=${this.add}>Confirmar</vaadin-button>
          </div>
        </div>
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
    if (Number.isNaN(amount)) {
      e.target.value = this.amount.toString();
      return;
    }
    this.amount = amount;
  }

  add() {
    console.log("adding");
    console.log("added " + this.amount + ", from " + this.from + " to " + this.to);

    const data = {
      "to": "-",
      "amount": 1.123
    };
    data.to = this.to;
    data.amount = this.amount;
    //const ip = 'http://techu-project-myproject.2886795277-80-kitek03.environments.katacoda.com';
    const ip = 'http://localhost:8002';
    const url = '/apitechu/v0/accounts/' + this.from +'/movements';
    fetch(ip + url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SessionApp.userToken
      }
    }).then(response => this.statusResponse(response))
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
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  static get styles() {
    return css`
      vaadin-button.confirm {
        background-color: #2483f0;
        color: #ffffff;
        font-weight: bold;
      }
    `;
  }

}
