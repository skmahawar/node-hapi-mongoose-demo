(function() {
    'use strict';

    /**
     * Expose
     */

    module.exports = {
        variants: {
            user: {
                resize: {
                    detail: 'x440'
                },
                crop: {
                    //thumb: '100x100'
                },
                resizeAndCrop: {
                    mini: {
                        resize: '63504@',
                        crop: '252x210'
                    }
                }
            },

            article: {
                //keepNames: true,
                resize: {
                    original: '100%'
                },
                thumbnail: {
                    t: "300x300 Center"
                }
            },

            gallery: {
                crop: {
                    thumb: '100x100'
                }
            }
        },

        storage: {
            Local: {
                path: '/tmp',
                mode: 0777
            },
            Rackspace: {
                username: 'USERNAME',
                apiKey: 'API_KEY',
                // authUrl: "https://lon.auth.api.rackspacecloud.com",
                container: 'CONTAINER'
            },
            S3: {
                key: process.env.IMAGER_S3_KEY,
                secret: process.env.IMAGER_S3_SECRET,
                bucket: process.env.IMAGER_S3_BUCKET,
                storageClass: 'REDUCED_REDUNDANCY', // (optional)
                secure: false // set `secure: false` if you want to use buckets with characters like '.' (dot)
            },
            uploadDirectory: 'photos/'
        }
        debug: true
    }

}());
