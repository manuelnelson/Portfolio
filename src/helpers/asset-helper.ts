export const getAssetPath = (relPath:string) => {
  if(import.meta.env.VITE_CORDOVA === "true") {
    return `assets/${relPath}`
  }
  return import.meta.env.MODE === "development" ? `/src/assets/${relPath}` : `/public/${relPath}` 
}

export const getPublicPath = (relPath:string) => {
  if(import.meta.env.VITE_CORDOVA === "true") {
    return `${relPath}`
  }
  return import.meta.env.MODE === "development" ? `${relPath}` : `/${relPath}` 
}
