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
    const {imageSrc} = this.config;

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
class Core {
  /**
   * @return {void}
   */
  constructor() {
    new CopyBacon();
  }
}

new Core();
