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
    this.$message = document.querySelector(".message");
    this.$progressBar = document.querySelector(".progress-bar");
    this.$progressTrack = document.querySelector(".progress-track");


    this.$appTitle.innerText = settings.humanReadableName;
    this.$appVersion.innerText = `v${settings.version || "1.0"}`;

    this.$appName = Array.prototype.forEach.call(document.querySelectorAll(".app-name"), (function(el){
      el.innerText = settings.humanReadableName;
    }));

  }

  /**
   * Update the installer text
   */
  set message(value) {
    this.$message.innerText = value;
  }

  /**
   * Begins installing the extension
   */
  installExtension() {
    this.message = `Installing ${this.settings["human-readable"]}`;

    const that = this;
    const promise = installer.install();

    promise.then(that.postInstall, that.failed);

    return promise;
  }

  uninstallExtension() {
    throw new Error("Not Implemented");
  }

  postInstall() {
    this.message = "Success!";
  }

  failed(error) {
    this.message = error;
  }

  stopProgressAnimation() {
    this.$progressTrack.style.animationIterationCount = 1;
    this.$progressTrack.style.width = "100%";
  }

  closeApp() {
    var window = remote.getCurrentWindow();
    window.close();
  }

}