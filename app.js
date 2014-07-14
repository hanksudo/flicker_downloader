var Flickr = require('flickrapi');
var fs = require('fs');
var request = require('request');

flickrOptions = {
    api_key: "",
    secret: "",
    access_token: "",
    access_token_secret: ""
};

count = 0;
Flickr.authenticate(flickrOptions, function(error, flickr) {
    // console.log(error);
    // console.log(flickr);
    flickr.photosets.getPhotos({
        photoset_id: ""
    }, function(err, list) {
        list.photoset.photo.forEach(function(photo) {
            flickr.photos.getSizes({
                photo_id: photo.id
            }, function(err, data) {
                data.sizes.size.forEach(function(src) {
                    if (src.label === 'Original') {
                        var filename = src.source.split('/')[src.source.split('/').length - 1];
                        var picStream = fs.createWriteStream(filename);
                        picStream.on('close', function() {
                            count++;
                            console.log('file done, ', count);
                        });
                        request(src.source).pipe(picStream);
                    }
                });
            });
        });
    });
});