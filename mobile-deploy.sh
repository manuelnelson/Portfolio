#update env to mobile
node ./mobile-deploy-helper.js
yarn build
node ./post-mobile-deploy-helper.js
cd src-cordova
cordova build android
cordova run android --device