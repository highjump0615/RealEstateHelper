import {AlertController, LoadingController} from '@ionic/angular';

export class BasePage {
  loadingView: any;

  constructor(
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController
  ) {
  }

  async showLoadingView(show = true, desc?: string) {
    if (show) {
      // show showLoading view
      this.loadingView = await this.loadingCtrl.create({
        message: desc
      });

      await this.loadingView.present();
    } else {
      if (this.loadingView) {
        // hide
        await this.loadingView.dismiss();
      }
    }
  }

  async presentAlert(title, msg, onOk?: (any?) => void) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: [{
        text: 'OK',
        handler: () => {
          if (onOk) {
            onOk();
          }
        }
      }]
    });

    await alert.present();
  }

  onError(err) {

  }
}
