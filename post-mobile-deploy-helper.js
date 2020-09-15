
async function Run() {
  const replace = require('replace-in-file');
  var js = {
    files: './src-cordova/www/index.html',
    from: '</body>',
    to: `<script src="cordova.js"></script></body>`,
  };

  try {
    results = await replace(js)
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
Run();
