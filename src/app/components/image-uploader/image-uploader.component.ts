import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Utils} from '../../helpers/utils';
import {ActionSheetController, Platform} from '@ionic/angular';
import {ImageHelper} from '../../helpers/image-helper';
import {Camera} from '@ionic-native/camera/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  @Input() picture;
  @Input() desc = '';
  @Input() preservePicture = true;

  @Input() imgUrl = '';

  @ViewChild('file') inputFile: ElementRef;

  @Output() SelectPhoto = new EventEmitter();

  imageHelper: ImageHelper;

  constructor(
    public plt: Platform,
    // camera
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
  ) {
    this.imageHelper = new ImageHelper().init(
      actionSheetController,
      camera,
      imagePicker,
    );
  }

  ngOnInit() {
  }

  onSelectedPhoto(pic) {
    if (this.preservePicture) {
      this.picture = pic;
    }
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {

        this.onSelectedPhoto(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }

  onButPhoto() {
    // browser
    if (Utils.isPlatformWeb(this.plt)) {
      this.inputFile.nativeElement.click();
      return;
    }

    // native
    this.imageHelper.showSelectImage((img) => {
      this.onSelectedPhoto(img);
    });
  }
}
