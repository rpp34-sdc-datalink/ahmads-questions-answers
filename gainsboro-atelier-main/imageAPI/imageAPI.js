const cloudinary = require("cloudinary");
const {cloudinaryInfo} = require("../config.js");

const {cloud_name, api_key, api_secret} = cloudinaryInfo;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

const uploadImages = (files) => {
  const urlArr = files.map(file => {
    return cloudinary.uploader.upload(file.path)
    .then(data => {
      var url = data.secure_url;
      return url;
    })
    .catch(err => {throw err})
  })
  return Promise.all(urlArr)
}

module.exports = uploadImages;