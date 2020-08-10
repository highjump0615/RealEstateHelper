import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ImageUploaderComponent} from '../image-uploader/image-uploader.component';
import {ModalService} from '../../services/modal/modal.service';
import {ActionSheetController, Platform} from '@ionic/angular';
import {Camera} from '@ionic-native/camera/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Utils} from '../../helpers/utils';

@Component({
  selector: 'app-property-image-uploader',
  templateUrl: './property-image-uploader.component.html',
  styleUrls: ['./property-image-uploader.component.scss']
})
export class PropertyImageUploaderComponent extends ImageUploaderComponent implements OnInit {

  @Output() imageSelected = new EventEmitter();
  @Output() removeImage = new EventEmitter();

  constructor(
    public plt: Platform,
    // camera
    public actionSheetController: ActionSheetController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public modalService: ModalService,
  ) {
    super(plt, actionSheetController, camera, imagePicker, modalService);
  }

  ngOnInit() {
  }

  onSelectedPhotos(pics) {
    this.imageSelected.emit(pics);
  }

  onRemove(event) {
    event.stopPropagation();

    this.removeImage.emit();
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {

        this.onSelectedPhotos([reader.result]);
      };

      reader.readAsDataURL(file);
    }
  }

  onButPhoto() {
    if (this.imgUrl) {
      this.modalService.viewImage(
        this.imgUrl
      );

      return;
    }

    // browser
    if (Utils.isPlatformWeb(this.plt)) {
      this.inputFile.nativeElement.click();
      return;
    }

    // native
    this.imageHelper.showSelectImage(
      (imgs) => {
        this.onSelectedPhotos(imgs);
      },
      true
    );
  }

}
