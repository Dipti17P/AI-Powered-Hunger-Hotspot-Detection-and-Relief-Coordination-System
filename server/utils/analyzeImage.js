const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const axios = require("axios");

async function analyzeImage(imageUrl) {

  const model = await mobilenet.load();

  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer"
  });

  const imageBuffer = Buffer.from(response.data);

  const tensor = tf.node.decodeImage(imageBuffer);

  const predictions = await model.classify(tensor);

  // simple severity logic
  let severity = "low";

  const labels = predictions.map(p => p.className);

  if(labels.includes("person") || labels.includes("homeless")) {
    severity = "medium";
  }

  if(labels.includes("refugee") || labels.includes("crowd")) {
    severity = "high";
  }

  return {
    predictions,
    severity
  };
}

module.exports = analyzeImage;