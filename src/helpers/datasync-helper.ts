import tagService from "../services/tag-service";
import beanService from "../services/bean-service";
import noteService from "../services/note-service";

const syncData = async() => {
  console.log("Uploading tags....");
  let result = await tagService.sync();
  if(result) {
    console.log("Uploading activeBeans....")
    result = await beanService.sync();
  }
  if(result) {
    console.log("Uploading notes....")
    await noteService.sync();
  }
}

export {syncData}
