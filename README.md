# ProGen
Progen is a desktop application built to allow users create and maintain end to end testing scripts for the angular testing framework protractor. This tool will aimed to provide the necessary quality assurance assests for angular development.

## About ProGen
ProGen is a node webkit application, designed to be useable on mac, windows, and linux machines. The application itself is written in TypeScript.

## Development
This project is currently under development, follow the installation guide

## Installation
Must have node and npm installed.

For linux distribution you must have fpm. If you're not using a windows machine you will need wine. For the windows installer you need to have the makensis in your command path.

If using OS X do the following:
* `sudeo gem install fpm`
* `brew install wine`
* `brew install makesis`

Now clone the app and 
* `cd ProGen/`
* `npm install -g gulp`
* `npm install`

## Building
Run the build task for the following platforms.
* OS X 64: `gulp build:osx64`
* Linux 32: `gulp build:linux32`
* Linux 64: `gulp build:linux64`
* Win 32: `gulp build:win32`

## Packaging and upload
Run the following task for packing and upload.
* OS X 64: `gulp pack:osx64`
* Linux 32: `gulp pack:linux32`
* Linux 64: `gulp pack:linux64`
* Win 32: `gulp pack:win32`

## Updates
This app will check for updates to our github code base. It does this by retreive the manifestUrl from package. The app will download the specified build and compare versions. The user will be prompted if he would want to accept the build.
