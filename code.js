// Library Code
//At this point only mp4 video is created.
var aws = require('aws-sdk');
var elastictranscoder = new aws.ElasticTranscoder();

// return basename without extension
function basename(path) {
  return path.split('/').reverse()[0].split('.')[0];
}

// return output file name with timestamp and extension
function outputKey(name, ext) {
  return name + '.' + ext + ':trans';
}

exports.handler = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  var key = event.Records[0].s3.object.key;
  var params = {
    Input: {
      Key: key
    },
    PipelineId: '1479569182711-766cpt', /* test-web-transcoder */
   // OutputKeyPrefix: 'transecoded/',
    OutputKeyPrefix: 'videos/',
    Outputs: [
      {
        Key: outputKey(basename(key),'mp4'),
        PresetId: '1351620000001-100070', // System preset: Web (Facebook Youtube)
      }
    // ,
    //  {
     //   Key: outputKey(basename(key) ,'webm'),
      //  PresetId: '1351620000001-100250', // System preset: Webm VP9 720p
    //  }
    ]
  };

  elastictranscoder.createJob(params, function(err, data) {
    console.log('Converting the video is done by Kosar!');
    if (err){
      console.log(err, err.stack); // an error occurred
      context.fail();
      return;
    }
    context.succeed();
  });
};
