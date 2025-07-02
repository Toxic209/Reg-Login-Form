import multer from "multer"
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fullPath = path.resolve("./Public/Temp");
    cb(null, fullPath)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

export const upload = multer({ storage, })