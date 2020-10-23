import { LitElement, html, css, property } from 'lit-element';

export class Movement extends LitElement {

  @property({type: Number}) amount = -120.0;

  @property({type: String}) account = "A";

  render() {
    return html`
      <ol class="${this.amount < 0 ? 'negative' : 'positive'}">
          ${this.amount} | Acc: ${this.account}
      </ol>
    `;
  }

  static get styles() {
    return css`
      :host {
        color: blue;
      }
      ol{
        padding: inherit;
      }
      .negative {
        background-color: #f27878;
      }
      .positive {
        background-color: #b0ed9b;
      }
    `;
  }
}
