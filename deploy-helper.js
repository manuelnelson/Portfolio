
async function Run() {
  const replace = require('replace-in-file');
  // var favicon = {
  //   files: './dist/index.html',
  //   from: /\/img\//g,
  //   to: `/public/img/`,
  // };
  var favicon = {
    files: './dist/index.html',
    from: /\/src\/\/assets\//g,
    to: `/public/_assets/`,
  };  
  var js = {
    files: './dist/index.html',
    from: /\/_assets\//g,
    to: `/public/_assets/`,
  };
  // var manifest = {
  //   files: './dist/index.html',
  //   from: /manifest.json/g,
  //   to: `public/manifest.json/`,
  // };
  var serviceWOrker = {
    files: './dist/_assets/*.css',
    from: /\/_assets\//g,
    to: `/public/_assets/`,
  };
  // const options = {
  //   files: './dist/public/js/*.js',
  //   from: /src:"\//g,
  //   to: `src:"/public/`,
  // };
  // const svgOptions = {
  //   files: './dist/public/js/*.js',
  //   from: /xml",data:"\//g,
  //   to: `xml",data:"/public/`,
  // };
  try {
    // var results = await replace(options)
    results = await replace(favicon)
    results = await replace(js)
    // results = await replace(manifest)
    results = await replace(serviceWOrker)
    // results = await replace(svgOptions)
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
Run();
