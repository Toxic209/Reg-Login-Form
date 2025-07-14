import multer from "multer"
import path from "path";
import fs from "fs"
import os from "os"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const fullPath = path.resolve("./Public/Temp");        //Use this in regular environments!.
    const fullPath = path.join(os.tmpdir(), "my-uploads");;   //This is a workaround due to system permission issues!

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log("📁 Created missing temp folder:", fullPath);
    }

    cb(null, fullPath)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

export const upload = multer({ storage })