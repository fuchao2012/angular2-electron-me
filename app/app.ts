import {bootstrap} from '@angular/platform-browser-dynamic';
import {Component, Pipe, PipeTransform} from '@angular/core';
import {NgFor} from '@angular/common';

@Pipe({ name: 'byteFormat'})
class ByteFormatPipe implements PipeTransform {
  // Credit: http://stackoverflow.com/a/18650828
  transform(bytes, args) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  }
}

@Component({
  selector: 'app',
  pipes: [ByteFormatPipe],
  template: `

    <h1>总共: {{ imageStats().count }}</h1>
    <h1>大小: {{ imageStats().size | byteFormat}}</h1>

    <div
      (dragover)="false"
      (dragend)="false"
      (drop)="handleDrop($event)"
      style="height: 100px; border: 5px dotted #ccc;">
      <p style="margin: 10px; text-align: center">
        <strong>把图片拖进来看看效果</strong>
      </p>
    </div>

    <div class="media" *ngFor="let image of images">
      <div class="media-left">
        <a href="#">
          <img class="media-object" src="{{image.path}}" style="max-width:200px">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{image.name}}</h4>
        <p>{{image.size | byteFormat}}</p>
      </div>
    </div>
  `
})

export class App {

  images:Array<Object> = [];

  constructor() {}

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.images.push(files[key]);
      }
      else {
        alert("File must be a PNG or JPEG!");
      }
    });
    console.log(e);
    return false;
  }

  imageStats() {

    let sizes:Array<number> = [];
    let totalSize:number = 0;

    this
      .images
      .forEach((image:File) => sizes.push(image.size));

    sizes
      .forEach((size:number) => totalSize += size);

    return {
      size: totalSize,
      count: this.images.length
    }

  }

}

bootstrap(App);