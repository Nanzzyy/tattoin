import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | undefined;

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} belum dikonfigurasi.`);
  return value;
}

function getClient() {
  if (!client) {
    const accountId = required("R2_ACCOUNT_ID");
    client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT ?? `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: required("R2_ACCESS_KEY_ID"),
        secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
      },
    });
  }

  return client;
}

function bucketName() {
  return required("R2_BUCKET_NAME");
}

export function publicObjectUrl(key: string) {
  const configuredUrl = required("R2_PUBLIC_URL").trim().replace(/\/$/, "");
  const baseUrl = /^https?:\/\//i.test(configuredUrl) ? configuredUrl : `https://${configuredUrl}`;
  return `${baseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function putObject(key: string, body: Buffer) {
  await getClient().send(new PutObjectCommand({
    Bucket: bucketName(),
    Key: key,
    Body: body,
    ContentType: "image/webp",
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

export async function deleteObject(key: string) {
  await getClient().send(new DeleteObjectCommand({ Bucket: bucketName(), Key: key }));
}
