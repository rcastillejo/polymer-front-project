import {LitElement, html, css, property, customElement} from 'lit-element';
import { SessionApp } from '../../session-app.js'
import { RouterLocation, PreventAndRedirectCommands } from '@vaadin/router';
import { router } from "../../index.js";
import '@vaadin/vaadin-app-layout/theme/lumo/vaadin-app-layout';
import { AppLayoutElement } from '@vaadin/vaadin-app-layout/src/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tab';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs';
import { Router } from '@vaadin/router';

//customElements.define('session-app', SessionApp);

const footer = html` <p class="app-footer">Made by ®enzo & ®icardo</p>`;

interface MenuTab {
  route: string;
  name: string;
}
@customElement("vank-app")
export class VankApp extends LitElement {

  onBeforeEnter(
    location: RouterLocation,
    commands: PreventAndRedirectCommands) {
    //return commands.prevent();
    console.log(SessionApp.userToken);
    if (!SessionApp.userToken) {
      console.log('no permitido')
      return commands.redirect('/login');
    }
  }

  @property({ type: Object }) location = router.location;

  @property({ type: Array }) menuTabs: MenuTab[] = [
    {route: '', name: 'Inicio'},
    {route: 'movement', name: 'Transferir'}
  ];

  @property({ type: String }) projectName = 'Vank';

  static get styles() {
    return [
      /*CSSModule('lumo-typography'),
      CSSModule('lumo-color'),
      CSSModule('app-layout'),*/
      css`
        :host {
          display: block;
          height: 100%;
        }

        header {
          align-items: center;
          box-shadow: var(--lumo-box-shadow-s);
          display: flex;
          height: var(--lumo-size-xl);
          width: 100%;
        }

        header h1 {
          font-size: var(--lumo-font-size-l);
          margin: 0;
        }

        header img {
          border-radius: 50%;
          height: var(--lumo-size-s);
          margin-left: auto;
          margin-right: var(--lumo-space-m);
          overflow: hidden;
          background-color: var(--lumo-contrast);
        }

        vaadin-app-layout[dir='rtl'] header img {
          margin-left: var(--lumo-space-m);
          margin-right: auto;
        }

        #logo {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          padding: var(--lumo-space-s) var(--lumo-space-m);
        }

        #logo img {
          height: calc(var(--lumo-size-l) * 1.5);
        }

        #logo span {
          font-size: var(--lumo-font-size-xl);
          font-weight: 600;
          margin: 0 var(--lumo-space-s);
        }

        vaadin-tab {
          font-size: var(--lumo-font-size-s);
          height: var(--lumo-size-l);
          font-weight: 600;
          color: var(--lumo-body-text-color);
        }

        vaadin-tab:hover {
          background-color: var(--lumo-contrast-5pct);
          text-decoration: none;
        }

        vaadin-tab[selected] {
          background-color: var(--lumo-primary-color-10pct);
          color: var(--lumo-primary-text-color);
        }

        hr {
          margin: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <vaadin-app-layout primary-section="drawer">
        <header slot="navbar" theme="dark">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1>${this.getSelectedTabName(this.menuTabs)}</h1>
          <img src="/src/images/user_male.png" alt="Avatar" />
          <vaadin-button class="confirm" @click=${this.logOut}>LogOut</vaadin-button>
        </header>

        <div slot="drawer">
          <div id="logo">
            <img src="/src/images/logo.png" alt="${this.projectName} logo" />
            <span>${this.projectName}</span>
          </div>
          <hr />
          <vaadin-tabs orientation="vertical" theme="minimal" id="tabs" .selected="${this.getIndexOfSelectedTab()}">
            ${this.menuTabs.map(
      (menuTab) => html`
                <vaadin-tab>
                  <a href="${router.urlForPath(menuTab.route)}" tabindex="-1">${menuTab.name}</a>
                </vaadin-tab>
              `
    )}
          </vaadin-tabs>
        </div>
        <slot></slot>
      </vaadin-app-layout>

      ${footer}
    `;
  }

  private _routerLocationChanged() {
    AppLayoutElement.dispatchCloseOverlayDrawerEvent();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('vaadin-router-location-changed', this._routerLocationChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('vaadin-router-location-changed', this._routerLocationChanged);
  }

  private isCurrentLocation(route: string): boolean {
    return router.urlForPath(route) === this.location.getUrl();
  }

  private getIndexOfSelectedTab(): number {
    const index = this.menuTabs.findIndex((menuTab) => this.isCurrentLocation(menuTab.route));

    // Select first tab if there is no tab for home in the menu
    if (index === -1 && this.isCurrentLocation('')) {
      return 0;
    }

    return index;
  }

  private getSelectedTabName(menuTabs: MenuTab[]): string {
    const currentTab = menuTabs.find((menuTab) => this.isCurrentLocation(menuTab.route));
    let tabName = '';
    if (currentTab) {
      tabName = currentTab.name;
    } else {
      tabName = 'Hello World';
    }
    return tabName;
  }

  logOut() {
    const data = {
      "email": SessionApp.userName,
    };
    //const ip = 'http://techu-project-myproject.2886795277-80-kitek03.environments.katacoda.com';
    const ip = 'http://localhost:8002';
    const url = '/apitechu/v0/logout';
    fetch(ip + url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer<' + SessionApp.userToken + '>'
      }
    }).then(response => this.statusResponse(response))
      .then(response => response.json())
      .then(response => {
        console.log('Success:', response);
        SessionApp.clearUser();
        Router.go('/login');
      })
      .catch(error => console.error('Error:', error));
  }
  statusResponse(response: Response) {
    //Validar que la respuesta es 200
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

/*

   render() {

    return html`
      <main>
      <h2>Vank App</h2>
        <div class="logo">${openWcLogo}</div>
        <!--<session-view></session-view>-->
        <dashboard-view></dashboard-view>
        <addmovement-view></addmovement-view>
      </main>

      ${footer}
    `;
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 360px;
      margin: 0 auto;
      text-align: center;
    }
    main {
      flex-grow: 1;
      background-color: #fffbf3;
      width:100%;
    }
    h2, h3 {
      margin: 8px;
    }

    .logo > svg {
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }

    .movements{
      margin-left: -36px;
    }
  `;
*/

}
