import { Component } from '@angular/core';
import * as Immutable from 'immutable';

@Component({
  selector: 'dx-slideshow',
  templateUrl: './slideshow.component.html'

})
export class SlideShowComponent {

  options = Immutable.Map({
    showDots: true,         // Shows a dot navigation component
    height: 450,            // The initial slideshow height
    showThumbnails: true,   // Optionally include thumbnails a navigation option
    thumbnailWidth: 150     // Thumbnail individual width for the thumbnail navigation component
  });


  images = Immutable.List([
    {
      url: 'http://placekitten.com/800/500',
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
        'Lorem Ipsum has been the industrs standard dummy text ever since the 1500s, when an unknown printer ' +
        'took a galley of type and scrambled it to make a type specimen book.'
    },
    { url: 'http://placekitten.com/1200/500' },
    { url: 'http://placekitten.com/800/300', title: 'cat' },
    { url: 'http://placekitten.com/300/500', title: 'cat' },
    { url: 'http://placekitten.com/860/500', title: 'cat' },
    { url: 'http://placekitten.com/830/500', title: 'cat' },
    { url: 'http://placekitten.com/660/500', title: 'cat' },
    { url: 'http://placekitten.com/720/500', title: 'cat' },
    { url: 'http://placekitten.com/360/300', title: 'cat' },
    { url: 'http://placekitten.com/860/860', title: 'cat' },
    { url: 'http://placekitten.com/800/900', title: 'cat' },
    { url: 'http://placekitten.com/800/1200', title: 'cat' }
  ]);

}