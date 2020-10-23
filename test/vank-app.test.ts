import { html, fixture, expect } from '@open-wc/testing';

import {VankApp} from '../src/views/main/vank-app.js';
import '../src/vank-app.js';

describe('VankApp', () => {
  let element: VankApp;
  beforeEach(async () => {
    element = await fixture(html`
      <vank-app></vank-app>
    `);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
