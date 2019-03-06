"use strict";

/** View
 * Controls are visual state
 * Note all top level scripts are added to the global scope
 */
class View {
  
  constructor(settings) {
    this.settings = settings;
    this.zxpPath = __dirname + settings.zxpPath;

    // ui
    this.$appTitle = document.querySelector(".title");
    this.$appVersion = document.querySelector(".version");

    this.$progressBar = document.querySelector(".progress-bar");
    this.$progressTrack = document.querySelector(".progress-track");

    this.$installBtn = document.querySelector(".install");
    this.$exitBtn = document.querySelector(".exit");
    // this.$cancelBtn = document.querySelector(".cancel");

    this.$appTitle.innerText = settings.humanReadableName;
    this.$appVersion.innerText = `v${settings.version || "1.0"}`;

    this.$appName = Array.prototype.forEach.call(document.querySelectorAll(".app-name"), (function(el){
      el.innerText = settings.humanReadableName;
    }));

    this.$installBtn.addEventListener("click", this.installClicked.bind(this));
    this.$exitBtn.addEventListener("click", this.cancelClicked.bind(this));
    // this.$cancelBtn.addEventListener("click", this.cancelClicked.bind(this));
    
    this.$installBtn.attributes.removeNamedItem("disabled");
    this.$exitBtn.attributes.removeNamedItem("disabled");

    this.$carousel = document.querySelector(".carousel");

    this.views = {
      $actions:     document.querySelector(".view.view--actions"),
      $installing:  document.querySelector(".view.view--installing"),
      $error:       document.querySelector(".view.view--errors"),
      $complete:    document.querySelector(".view.view--complete")
    }

    this.activeClassName = "view--active";
    this.$activeView = document.querySelector(`.${this.activeClassName}`);
    console.log(this);
  }

  changeView($ref) {
    this.$activeView.classList.remove(this.activeClassName);
    $ref.classList.add(this.activeClassName);
    this.$activeView = $ref;
  }

  /**
   * Begins installing the extension
   */
  installExtension() {

    const that = this;
    const promise = installer.install();

    promise.then(that.postInstall, that.failed);

    return promise;
  }

  uninstallExtension() {
    throw new Error("Not Implemented");
  }

  postInstall() {
    console.log("success");
  }

  failed(error) {
    console.log(error);
  }

  closeApp() {
    var window = remote.getCurrentWindow();
    window.close();
  }

  cancelClicked() {
    this.closeApp();
  }

  installClicked() {
    console.log("hey");
    this.changeView(this.views.$installing);
    this.$carousel.style.display = null;
    // this.$cancelBtn.attributes.removeNamedItem("disabled");
  }

}