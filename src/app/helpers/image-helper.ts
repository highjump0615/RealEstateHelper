import {ActionSheetController} from '@ionic/angular';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import {ImagePicker, OutputType} from '@ionic-native/image-picker/ngx';

export class ImageHelper {
  private static instance: ImageHelper;

  private actionSheetController: ActionSheetController;
  private camera: Camera;
  private imagePicker: ImagePicker;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ImageHelper();
    }

    return this.instance;
  }

  init(
    actionSheetController: ActionSheetController,
    camera: Camera,
    imagePicker: ImagePicker,
  ) {
    this.actionSheetController = actionSheetController;
    this.camera = camera;
    this.imagePicker = imagePicker;

    return this;
  }

  async showSelectImage(callback, multiple = false) {
    if (!this.actionSheetController) {
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Take Photo',
        handler: () => {
          this.onTakePhoto(callback, multiple);
        }
      }, {
        text: 'Photo Library',
        handler: () => {
          this.onImageLibrary(callback, multiple);
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

  private async doSelectPhoto(sourceType, callback, multiple) {
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

      const imgData = 'data:image/jpeg;base64,' + imageData;
      if (multiple) {
        // return data as an array
        callback([imgData]);
      }
      else {
        callback(imgData);
      }

    } catch (e) {
      console.log(e);
    }
  }

  onTakePhoto(callback, multiple) {
    this.doSelectPhoto(PictureSourceType.CAMERA, callback, multiple);
  }

  onImageLibrary(callback, multiple) {
    if (multiple) {
      // multiple image picker
      this.selectMultiplePhoto(callback);
    }
    else {
      this.doSelectPhoto(PictureSourceType.PHOTOLIBRARY, callback, multiple);
    }
  }

  async selectMultiplePhoto(callback) {
    const options = {
      width: 800,
      height: 800,
      // quality of resized image, defaults to 100
      quality: 70,
      outputType: OutputType.DATA_URL
    };

    try {
      const images = await this.imagePicker.getPictures(options);

      const imgBase64s = [];
      for (const img of images) {
        const imgBase64 = 'data:image/jpeg;base64,' + img;
        imgBase64s.push(imgBase64);
      }

      if (imgBase64s.length > 0) {
        callback(imgBase64s);
      }

    } catch (e) {
      console.log(e);
    }
  }
}
