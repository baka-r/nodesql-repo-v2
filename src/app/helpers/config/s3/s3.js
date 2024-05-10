const { s3 } = require("../../../config/aws/config");
const fs = require('fs')
const aws = require('aws-sdk');

exports.ensureFolderExists = async (bucketName, folderName) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: folderName + '/'
        };

        await s3.putObject(params).promise();
        return true;
    } catch (err) {
        console.error('Error checking or creating folder:', err);
        return false;
    }
}

exports.uploadToS3 = async (file, bucketName, folderName, filename) => {
    try {
        const key = `${filename}`;

        // Check if the file already exists in the bucket
        const existsParams = {
            Bucket: bucketName,
            Key: key,
        };
        const objectInfo = await s3.headObject(existsParams).promise().catch(() => {
            console.log("Image on s3 Not found so it is goona be uploaded")
        });

        // If file exists, construct and return the URL
        if (objectInfo) {
            let Location = s3.getSignedUrl('getObject', existsParams)
            if (!Location) {
                Location = `https://broadsign.sfo3.digitaloceanspaces.com/${filename}`
            }
            console.log("File already exists in S3. URL:", Location);
            return { Location };
        }

        // File doesn't exist, proceed with upload
        const uploadParams = {
            Body: fs.createReadStream(file),
            Bucket: bucketName,
            Key: key,
            ACL: 'public-read',
            PartSize: 10 * 1024 * 1024
        };

        const response = await s3.upload(uploadParams).promise();
        return response;
    } catch (error) {
        console.error("Error in uploadToS3()", error);
        return false;
    }
}