# HEP Unit Calcultor

## Introduction

This is the calculator that allows unit transformation in the style conventional in the High Energy Physics.

See it in action at https://fedxa.github.io/HepUnitCalc/www/

Get the current (more or less) Android package from:
http://www.hep.manchester.ac.uk/u/bezrukov/misc/app-debug.apk
or http://www.hep.manchester.ac.uk/u/bezrukov/misc/unitcalc.zip

## Usage

### To compile this for android

First download the [Cordova](https://cordova.apache.org/)

    $ npm install cordova

make sure that you have other reqirements installed

    $ cordova requirements android

In particular, you need Android SDK https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip

Gradle build system

    $ dnf install gradle
	
Java

    $ dnf install java-1.8.0-openjdk
	
Then, configure to compile for android

    $ cordova platform add android

And compile

    $ cordova build

The resulting apk file is in 
`latforms/android/app/build/outputs/apk/debug/app-debug.apk`

### Desktop

In your browser, open the file:

    /www/index.html

## Acknowledgements

The expression parser is based on the excellent [Math.js](https://mathjs.org/) library.
