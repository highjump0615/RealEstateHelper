import {Component, Input, OnInit} from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  onSelectedPhoto(pic) {
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        if (this.preservePicture) {
          this.picture = reader.result;
        }

        this.onSelectedPhoto(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }

}
