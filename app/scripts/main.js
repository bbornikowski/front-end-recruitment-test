/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if (
    'serviceWorker' in navigator
    && (window.location.protocol === 'https:' || isLocalhost)
  ) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function() {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                    'service worker became redundant.');

              default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
  }

  /**
   * CopyBacon class used to copy image and insert it into the DOM
   * @class
   * @constructor
   * @public
   */
  class CopyBacon {
    /**
     * @constructor
     * @return {void}
     */
    constructor() {
      if (!this.setVars()) return;

      this.setEvents();
    }

    /**
     * Init vars.
     * @return {boolean} If variables has been found
     */
    setVars() {
      this.button = document.querySelector('[data-bacon-button]');

      if (!this.button) return false;

      this.wrapper = document.querySelector('[data-bacon-wrapper]');
      this.imageWrapper = document.querySelector('[data-bacon-image]');
      this.image = this.imageWrapper.querySelector('img');
      this.config = {
        imageSrc: this.image.src,
      };

      return true;
    }

    /**
     * @return {void} Assigns events to found DOM elements
     */
    setEvents() {
      this.button.addEventListener(
        'click',
        this.copyImage.bind(this)
      );
    }

    /**
     * @return {void} Copy image wrapper and create new image into it
     */
    copyImage() {
      const container = this.imageWrapper.cloneNode();
      const image = document.createElement('img');
      const { imageSrc } = this.config;

      image.src = imageSrc;
      image.style = `
        width: 100%; height: 100%;
      `;

      container.appendChild(image);

      this.wrapper.appendChild(container);
    }
  }

  /**
   * Core class used to initialize all javascript
   * @class
   * @constructor
   * @public
   */
  class Form {
    /**
     * @constructor
     * @return {void}
     */
    constructor() {
      if (!this.setVars()) return;

      this.setEvents();
    }

    /**
     * Init vars.
     * @return {boolean} If variables has been found
     */
    setVars() {
      this.section = document.querySelector('[data-form-section]');

      if (!this.section) return false;

      this.inputs = this.section.querySelectorAll('[data-input]');

      this.regex = {
        text: /^[a-zA-Z0-9]+/i,
        email: /\S+@\S+\.\S+/g,
        code: /^[0-9]+$/g,
        card: /^[0-9]{16}$/g,
        date: /^[0-9]{4}$/g,
        phone: /^[0-9]{6,}$/g,
      };
      this.classes = {
        error: 'input--error',
        correct: 'input--correct',
      };

      return true;
    }

    /**
     * @return {void} Assigns events to found DOM elements
     */
    setEvents() {
      [...this.inputs].forEach((input) => {
        input.addEventListener(
          'input',
          this.validateInput.bind(this)
        );
      });
    }

    /**
     * @return {void} Assigns validation to input
     */
    validateInput({ target }) {
      const { error, correct } = this.classes;
      const type = target.getAttribute('data-input-type');
      let { value } = target;

      switch (type) {
      case 'card':
        target.value = this.reformatInputValue(value, type);
        value = value.replace(/\s-\s/g, '');

        break;
      case 'date':
        target.value = this.reformatInputValue(value, type);
        value = target.value.replace(/\s\/\s/g, '');

        break;
      case 'phone':
        target.value = this.reformatInputValue(value, type);
        value = value.replace(/\D/g, '');

        break;
      }

      if (value.match(this.regex[type])) {
        target.parentElement.classList.remove(error);
        target.parentElement.classList.add(correct);
      } else {
        target.parentElement.classList.remove(correct);
        target.parentElement.classList.add(error);
      }
    }

    /**
     * @param {string} value value to be changed
     * @param {string} type input type
     * @return {string} Reformats card number
     */
    reformatInputValue(value, type) {
      switch (type) {
      case 'card':
        const list = value.replace(/\s-\s/g, '').match(/.{1,4}/g);

        return list.join(' - ');

      case 'date':
        value = value.replace(/\D/g, '');
        const dateLength = value.length;

        if (!dateLength) return 'MM / YY';

        let startValue = ['M', 'M', 'Y', 'Y'];
        for (let i = 0; i < dateLength; i++) {
          startValue[i] = value[i];
        }
        startValue = startValue.join('');

        let [month, year] = startValue.replace(/\s\/\s/g, '').match(/.{1,2}/g);

        if (month > 12) {
          month = 12;
        }

        return [month, year].join(' / ');

      case 'phone':
        value = value.replace(/\D/g, '');
        if (value.length > 10) return value;

        value = value.match(/.{1,3}/g);
        const phoneLength = value instanceof Array ? value.length: null;

        switch (phoneLength) {
        case 4:
          return value[3].length === 1
            ? `(${value[0]}) ${value[1]} ${value[2].substring(0, 2)}-${value[2].substring(2, 3) + value[3]}`
            : `(${value[0]}) ${value[1]} ${value[2]}-${value[3]}`;

        case 3:
          return value[2].length === 3
            ? `(${value[0]}) ${value[1]} ${value[2].substring(0, 2)}-${value[2].substring(2, 3)}`
            : `(${value[0]}) ${value[1]} ${value[2]}`;

        case 2:
          return `(${value[0]}) ${value[1]}`;

        case 1:
          return `(${value[0]})`;
        }

        return '';
      }
    }
  }


  /**
   * Core class used to initialize all javascript
   * @class
   * @constructor
   * @public
   */
  class Core {
    /**
     * @return {void}
     */
    constructor() {
      new CopyBacon();
      new Form();
    }
  }

  new Core();
})();
