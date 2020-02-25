# HEP Unit Calculator

## Introduction

This is the calculator that allows unit transformation in the style conventional in the High Energy Physics.

See it in action at https://fedxa.github.io/HepUnitCalc/

Get the current (more or less) Android package from [Releases page](https://github.com/fedxa/HepUnitCalc/releases)

## Usage

### In your browser

Just go to https://fedxa.github.io/HepUnitCalc/

### On Android phone

Download .apk file for the latest release [Releases page](https://github.com/fedxa/HepUnitCalc/releases).

It may take some fiddling to persuade your phone to install the file. First, just download the file to your device (you Android would probably refuse to install it out of the box). Then, try to open it in your file browser and install. If Android complains about allowing the app (your file browser) being unable to install the apk -- you probably should allow this.  Then **important** if "Play Protect" complaints, click "install anywhay" (if you click OK at this step, you'll have hard time to reverse it).


## Compilation instructions

### To compile this for android

First download the [Cordova](https://cordova.apache.org/)

    $ npm install cordova

make sure that you have other reqirements installed
([Instructions from Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#installing-the-requirements))

    $ cordova requirements android

In particular, you need Android SDK [SDK r26.1.1](https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip). Install as

    $ mkdir /opt/android-sdk-r26.1.1
	$ cd /opt/android-sdk-r26.1.1
	$ unzip ~/Downloads/sdk-tools-linux-4333796.zip
    $ tools/bin/sdkmanager platform-tools "platforms;android-28" "build-tools;28.0.3"
    $ #tools/bin/sdkmanager 'system-images;android-28;google_apis;x86_64'

Export the root of the installation as

    $ # export ANDROID_HOME=/opt/android-sdk-r26.1.1
    $ export ANDROID_SDK_ROOT=/opt/android-sdk-r26.1.1

Gradle build system

    $ dnf install gradle
	
Java

    $ dnf install java-1.8.0-openjdk
	
Then, configure to compile for android

    $ cordova platform add android

And compile

    $ cordova build

The resulting apk file is in 
`platforms/android/app/build/outputs/apk/debug/app-debug.apk`

### Browser version


Then, configure to compile for browser (note, that buy default all configured platforms are generated upon further build).

    $ cordova platform add android
    $ cordova build

Then open the file `platforms/browser/www/index.html`


## Acknowledgements

The expression parser is based on the excellent [Math.js](https://mathjs.org/) library.
