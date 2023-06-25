import AWS, { AWSError, S3 } from 'aws-sdk';
import { EncryptedText } from './types/encryption';
import { deserialize, serialize } from './utils';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || 'ap-northeast-1',
});

const bucket = process.env.S3_BUCKET || 'your-s3-bucket';

const handleAWSError = (error: AWSError, action: string) => {
  console.error(`Failed to ${action} file from S3:`, error);
  throw error;
};

const getCredentialPath = (holderAddress: string, credentialName: string) => {
  return `credentials/${holderAddress}/${credentialName}.json`;
};

export const uploadToS3 = async (
  holderAddress: string,
  credentianName: string,
  encryptedData: EncryptedText,
): Promise<void> => {
  const uploadParams: S3.PutObjectRequest = {
    Bucket: bucket,
    Key: getCredentialPath(holderAddress, credentianName),
    Body: await serialize(encryptedData),
    ContentType: 'application/json',
    ACL: 'public-read',
  };

  await s3
    .upload(uploadParams)
    .promise()
    .catch((error) => {
      handleAWSError(error, 'upload');
    });
};

export const downloadFromS3 = async (
  holderAddress: string,
  credentianName: string,
): Promise<EncryptedText> => {
  const downloadParams: S3.GetObjectRequest = {
    Bucket: bucket,
    Key: getCredentialPath(holderAddress, credentianName),
  };

  const result = await s3
    .getObject(downloadParams)
    .promise()
    .catch((error) => {
      handleAWSError(error, 'download');
    });
  if (!result) {
    throw new Error('Data not found');
  }
  const content: EncryptedText = await deserialize(result.Body as string);
  return content;
};
