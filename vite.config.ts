// const isCordova = import.meta.env.VITE_CORDOVA;
// module.exports = {
//   outDir: isCordova ? 'src-cordova/www/' : 'dist',
//   assetsDir: isCordova ? 'assets' : '_assets',
//   base: isCordova ? '' : '/',
//   minify: true
// }
const isCordova = true;
module.exports = {
  outDir: isCordova ? 'src-cordova/www/' : 'dist',
  assetsDir: isCordova ? 'assets' : '_assets',
  base: isCordova ? '' : '/',
  port: 3010, ///each application we run should use a diff port for auth reasons
  minify: true
}