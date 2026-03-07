const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-cpu");
const mobilenet = require("@tensorflow-models/mobilenet");
const axios = require("axios");
const sharp = require("sharp");

// Load model once when the server starts — reused for every request
let model = null;

async function loadModel() {
  if (!model) {
    model = await mobilenet.load();
    console.log("✅ MobileNet model loaded");
  }
  return model;
}

// Pre-load at startup (non-blocking)
loadModel().catch((err) => console.error("MobileNet load error:", err.message));

/**
 * Classify an image from a URL (e.g. Cloudinary URL).
 * Returns the top predictions as plain objects: [{ className, probability }]
 */
async function classifyImageFromUrl(imageUrl) {
  try {
    const net = await loadModel();

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
    });

    // Use sharp to resize to 224x224 (MobileNet input size) and get raw RGB pixels
    const { data, info } = await sharp(Buffer.from(response.data))
      .resize(224, 224)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Build a tensor from raw pixels [224, 224, 3]
    const imageTensor = tf.tensor3d(new Uint8Array(data), [info.height, info.width, info.channels]);
    const predictions = await net.classify(imageTensor);
    imageTensor.dispose();

    return predictions.map((p) => ({
      label: p.className,
      confidence: Math.round(p.probability * 100),
    }));
  } catch (error) {
    console.error("Image classification error:", error.message);
    return [];
  }
}

module.exports = { classifyImageFromUrl };
