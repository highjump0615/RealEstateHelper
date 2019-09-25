import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ImageUploaderComponent} from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-property-image-uploader',
  templateUrl: './property-image-uploader.component.html',
  styleUrls: ['./property-image-uploader.component.scss']
})
export class PropertyImageUploaderComponent extends ImageUploaderComponent implements OnInit {

  @Output() imageSelected = new EventEmitter();
  @Output() removeImage = new EventEmitter();

  ngOnInit() {
  }

  onSelectedPhotos(pics) {
    this.imageSelected.emit(pics);
  }

  onRemove(event) {
    event.stopPropagation();

    this.removeImage.emit();
  }

  onButPhoto() {
    if (this.imgUrl) {
      return;
    }

    this.imageHelper.selectMultiplePhoto((imgs) => {
      this.onSelectedPhotos(imgs);
    });
  }

}
