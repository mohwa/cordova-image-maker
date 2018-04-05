# cordova-image-maker

`cordova-image-maker` is a library that generate all `icon` and `splash` image files required by the cordova project without [imageMagic](https://www.imagemagick.org/script/index.php).


## Required Images

### Icon

Should be a `1024 x 1024px` with a 5% margin

### Splash

Splash image must be `2732 x 2732 px` with a center square of about `1200 x 1200 px`(it now is the largest resolution (used by iPad Pro 12.9"))

## Set The config.xml file

> `cordova-image-maker` requires the icon and splash image size information on in the config.xml file.

https://cordova.apache.org/docs/en/latest/config_ref/images.html


## Use with node.js

Install package:

```
npm i cordova-image-maker
```

Example:
```
const CordovaImageMaker = require('cordova-image-maker');

new CordovaImageMaker({config, icon, splash}).resize();
```

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|`config`|`{String}`|`'projectRootPath/config.xml'`|`config.xml` file path
|`icon`|`{String}`|`'projectRootPath/res/icon.png'`|`Icon` image source file path
|`splash`|`{String}`|`'projectRootPath/res/splash.png'`|`Splash` image source file path
|`quiet`|`{Boolean}`|`false`| Not display message

## Use with CLI

Install package on global location:

```
npm i -g cordova-image-maker
```

Default command:

```
cordova-image-maker
```

### CLI Arguments

```
usage: cordova-image-maker [-h] [-v] [-c CONFIG] [-i ICON] [-s SPLASH]
                           [-q QUIET]


cordova-image-maker cli example

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -c CONFIG, --config CONFIG
                        config.xml file path
  -i ICON, --icon ICON  Icon image source file path
  -s SPLASH, --splash SPLASH
                        Splash image source file path
  -q QUIET, --quiet QUIET
                        Not display message
```

## ClI Example

```
# default
cordova-image-maker

# Set the config, icon, splash argument.
cordova-image-maker --config /path/to/config.xml --icon /path/to/icon.png --splash /path/to/splash.png

# Set the quiet argument.
cordova-image-maker --config /path/to/config.yaml --quiet true
```
