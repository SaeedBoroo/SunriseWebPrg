import { custom } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";
import { TranslateService } from "../services/TranslateService";
import { DemisInjector } from "./Injector";
import { Injectable } from "@angular/core";



export class ConfirmResult {
  _executor: (okay: () => void, cancel: () => void, finall: () => void) => void;
  constructor(executor: (okay: () => void, cancel: () => void, finall: () => void) => void) {
    this._executor = executor;
    setTimeout(() => {
      this._executor(this.okayAction, this.cancelAction, this.finalAction);
    }, 200);
  }


  private okayAction: () => void;
  private cancelAction: () => void;
  private finalAction: () => void;

  okay(action: () => void): ConfirmResult {
    this.okayAction = action;
    return this;
  }
  cancel(action: () => void): ConfirmResult {
    this.cancelAction = action;

    return this;
  }
  final(action: () => void) {
    this.finalAction = action;
  }
}

export class DeleteResult {
  _executor: (done: () => void, cancel: () => void, finall: () => void) => void;
  constructor(executor: (done: () => void, cancel: () => void, finall: () => void) => void) {
    this._executor = executor;
    setTimeout(() => {
      this._executor(this.doneAction, this.cancelAction, this.finalAction);
    }, 200);
  }


  private doneAction: () => void;
  private cancelAction: () => void;
  private finalAction: () => void;

  done(action: () => void): DeleteResult {
    this.doneAction = action;
    return this;
  }
  cancel(action: () => void): DeleteResult {
    this.cancelAction = action;
    return this;
  }
  final(action: () => void) {
    this.finalAction = action;
  }
}

export class Dialog {


  static alert(
    title: string = "PUB_ALERT",
    message: string
  ): ConfirmResult {
    let translate = DemisInjector.injector.get(TranslateService);
    let options =
    {
      title: translate.instant(title),
      message: translate.instant(message),
      buttons: [
        {
          text: translate.instant("PUB_CONFIRM"),
          name: "Okay",
          icon: "check",
          type: "success",
          useSubmitBehavior: true,
          onClick: function () {
            return true;
          }
        }
      ]
    };

    let result = custom(options);
    return new ConfirmResult((okay, cancel, final) => {
      result.show().then(dialogResult => {
        if (dialogResult) {
          if (okay)
            okay();
        } else {
          if (cancel)
            cancel();
        }
        if (final)
          final();
      });
    });
  }

  static confirm(
    title: string = "PUB_CONFIRM",
    message: string = "PUB_CONFIRM_QUESTION"
  ): ConfirmResult {
    let translate = DemisInjector.injector.get(TranslateService);
    let options =
    {
      title: translate.instant(title),
      message: translate.instant(message),
      buttons: [
        {
          text: translate.instant("PUB_CONFIRM"),
          name: "Okay",
          icon: "check",
          type: "success",
          useSubmitBehavior: true,
          onClick: function () {
            return true;
          }
        },
        {
          text: translate.instant("PUB_CANCEL"),
          name: "Cancel",
          type: "normal",
          onClick: function () {
            return false;
          }
        }
      ]
    };

    let result = custom(options);
    return new ConfirmResult((okay, cancel, final) => {
      result.show().then(dialogResult => {
        if (dialogResult) {
          if (okay)
            okay();
        } else {
          if (cancel)
            cancel();
        }
        if (final)
          final();
      });
    });

  }

  static delete(
    message: string = "PUB_CONFIRM_DELETE",
  ): DeleteResult {
    let translate = DemisInjector.injector.get(TranslateService);
    let options =
    {
      title: translate.instant("PUB_DELETE"),
      message: translate.instant(message),
      buttons: [
        {
          text: translate.instant("PUB_DELETE"),
          name: "Delete",
          icon: "trash",
          type: "danger",
          useSubmitBehavior: true,
          onClick: function () {
            return true;
          }
        },
        {
          text: translate.instant("PUB_CANCEL"),
          name: "Cancel",
          type: "normal",
          onClick: function () {
            return false;
          }
        }
      ]
    };
    let result = custom(options);
    return new DeleteResult((done, cancel, final) => {
      result.show().then(dialogResult => {
        if (dialogResult) {
          if (done)
            done();
        } else {
          if (cancel)
            cancel();
        }
        if (final)
          final();
      });
    });
  }
}

export class Notify {
  private static WIDTH: number = 400;
  private static TIME: number = 10000;


  static error(message: string) {

    let translate = DemisInjector.injector.get(TranslateService);
    notify({
      message: translate.instant(message),
      type: "error",
      width: Notify.WIDTH,
      displayTime: 10000,
      closeOnClick: true,
      closeOnOutsideClick: true
    });
  }

  static success(message: string = "PUB_SUCCESS_SAVE") {
    let translate = DemisInjector.injector.get(TranslateService);
    notify({
      message: translate.instant(message),
      type: "success",
      width: Notify.WIDTH,
      displayTime: 3000,
      closeOnClick: true,
      closeOnOutsideClick: true
    });
  }

  static info(message: string) {
    let translate = DemisInjector.injector.get(TranslateService);
    notify({
      message: translate.instant(message),
      type: "info",
      width: Notify.WIDTH,
      displayTime: Notify.TIME,
      closeOnClick: true,
      closeOnOutsideClick: true
    });
  }

  static warning(message: string) {
    let translate = DemisInjector.injector.get(TranslateService);
    notify({
      message: translate.instant(message),
      type: "info",
      width: Notify.WIDTH,
      displayTime: Notify.TIME,
      closeOnClick: true,
      closeOnOutsideClick: true
    });
  }
}



@Injectable()
export class DialogService {
  alert(title: string, message: string) {
    return Dialog.alert(title, message);
  }
  confirm(message: string = "PUB_CONFIRM_QUESTION") {
    return Dialog.confirm("PUB_CONFIRM", message);
  }
  delete(message: string) {
    return Dialog.delete(message);
  }
}

@Injectable()
export class NotifyService {
  error(message: string) {
    return Notify.error(message);
  }
  warning(message: string) {
    return Notify.warning(message);
  }
  info(message: string) {
    return Notify.info(message);
  }
  success(message: string = "PUB_SUCCESS_SAVE") {
    return Notify.success(message);
  }
}
