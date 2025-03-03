![](http://static1.squarespace.com/static/538f3fcde4b05c5fecc7a40e/t/538f48a4e4b00d94e8c253b3/1453396632576/?format=400w)

# Campus Manager
[![Stories in Ready](https://badge.waffle.io/AustinCodingAcademy/aca-campus.png?label=ready&title=Ready)](http://waffle.io/AustinCodingAcademy/aca-campus)

[![CircleCI](https://circleci.com/gh/AustinCodingAcademy/aca-campus/tree/master.svg?style=svg)](https://circleci.com/gh/AustinCodingAcademy/aca-campus/tree/master)

[![Heroku](https://heroku-badge.herokuapp.com/?app=aca-campus)](http://aca-campus.herokuapp.com)

### Development

After cloning and navigating into directory:

1. Install [Cairo](https://cairographics.org/download/)
  * With Homebrew (OSX) `brew install cairo`

1. `npm install`

1. Create `.env`
  ```bash
  MONGOLAB_URI="mongodb://localhost/aca-campus"
  DOMAIN="http://localhost:3000"
  MANDRILL_API_KEY=""
  GOOGLE_API_KEY=""
  GOOGLE_CLIENT_ID=""
  YOUTUBE_CHANNEL_ID=""
  ```

1. leave `npm run gulp` running in one terminal session

1. leave `npm run develop` running in another terminal session

1. navigate to `http://localhost:3000/register` to create a top-level client

For testing:

1. Download and Install [Java JDK 8u91](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
2. Run `npm test`

### Activity
[![Throughput Graph](https://graphs.waffle.io/AustinCodingAcademy/aca-campus/throughput.svg)](https://waffle.io/AustinCodingAcademy/aca-campus/metrics/throughput)
