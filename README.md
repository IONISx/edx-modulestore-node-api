edX Modulestore API
===================

API for easy browsing of Open edX modulestores.

#How to Install and Run
```
$ sudo npm install -g grunt-cli
$ git clone REPO_URL
$ cd edx-modulestore-api
$ npm install
$ nano config.json  # Configure it, paste the following lines

    {
      "host": "localhost",
      "port": 6500,
      "url": "http://localhost:6500",
      "modulestore": {
        "mongo": {
          "uri": "localhost/edxapp"
        },
        "settings": {
          "lmsUrl": "http://localhost:8000",
          "studioUrl": "http://localhost:8001",
          "aboutFields": [
            "short_description",
            "overview"
          ]
        },
        "retryInterval": 500
      }
    }
    
$ nodejs index.js  # Run it
```

#Production Settings
To be done. One thing to know, this app uses [flatiron/nconf](https://github.com/flatiron/nconf) for configurations.

#Run Tests
```
$ grunt test
```
