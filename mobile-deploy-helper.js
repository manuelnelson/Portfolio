
async function Run() {
  const replace = require('replace-in-file');
  var viteConfig = {
    files: './vite.config.ts',
    from: 'isCordova = false',
    to: 'isCordova = true',
  };  
  var env = {
    files: './.env',
    from: `VITE_CORDOVA=false`,
    to: `VITE_CORDOVA=true`,
  };

  try {
    // var results = await replace(options)
    results = await replace(viteConfig)
    results = await replace(env)
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
Run();
