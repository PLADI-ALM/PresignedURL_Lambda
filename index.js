const {
        getSignedUrl
      } = require("@aws-sdk/s3-request-presigner"),
      {
        PutObjectCommand,
        S3
      } = require("@aws-sdk/client-s3");

const s3Client = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

exports.handler = async (event, context, callback) => {
  const { ext, dir } = event;
  const imageDir = getImageDir(dir);

  let today = new Date();
  let randomStr = Math.random().toString(36).substring(2, 8);
  let imageKey = today.getTime() + randomStr;

  const params = {
    Bucket: process.env.IMAGE_BUCKET,
    Key: `${imageDir}${imageKey}.${ext}`,
    Expires: 60 * 60,
  };

  // id: params.Key,
  // presignedUrl: presignedUrl,

  const presignedUrl = await getSignedUrl(s3Client, new PutObjectCommand(params), {
    expiresIn: "/* add value from 'Expires' from v2 call if present, else remove */"
  });
  callback(null, {
    imageKey: imageKey + "." + ext,
    presignedUrl: presignedUrl,
  });
};

function getImageDir(imageDir) {
  if (imageDir === "photo") return "photo/";
  else if (imageDir === "video") return "video/";
  else if (imageDir === "car") return "car/";
  else if (imageDir === "resource") return "resource/";
  else if (imageDir === "logo") return "logo/";
  else if (imageDir === "office") return "office/"
}
