import {ActionSheetController} from '@ionic/angular';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';

export class ImageHelper {
  private static instance: ImageHelper;

  private actionSheetController: ActionSheetController;
  private camera: Camera;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ImageHelper();
    }

    return this.instance;
  }

  init(
    actionSheetController: ActionSheetController,
    camera: Camera
  ) {
    this.actionSheetController = actionSheetController;
    this.camera = camera;

    return this;
  }

  async showSelectImage(callback) {
    if (!this.actionSheetController) {
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Take Photo',
        handler: () => {
          this.onTakePhoto(callback);
        }
      }, {
        text: 'Photo Library',
        handler: () => {
          this.onImageLibrary(callback);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  async doSelectPhoto(sourceType, callback) {
    const options: CameraOptions = {
      quality: 70,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
    };

    try {
      const imageData = await this.camera.getPicture(options);
      console.log(imageData);

      callback('data:image/jpeg;base64,' + imageData);

    } catch (e) {
      console.log(e);
    }
  }

  onTakePhoto(callback) {
    this.doSelectPhoto(PictureSourceType.CAMERA, callback);
  }

  onImageLibrary(callback) {
    this.doSelectPhoto(PictureSourceType.PHOTOLIBRARY, callback);
  }
}
