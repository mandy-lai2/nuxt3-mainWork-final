import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
const { Modal,Collapse,Dropdown } = bootstrap;

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bootstrapModal: (element, options) => new Modal(element, options),
      bootstrapCollapse: (element, options) => new Collapse(element, options),
      bootstrapDropdown: (element, options) => new Dropdown(element, options),
    }
  };
});