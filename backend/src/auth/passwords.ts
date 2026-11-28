import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const legacy = promisify(scrypt);
const derive = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return (
    "scrypt-v2:" + salt + ":" + (await derive(password, salt)).toString("hex")
  );
}

export async function verifyPassword(password: string, stored?: string) {
  const match = /^(scrypt|scrypt-v2):([0-9a-f]{32}):([0-9a-f]{128})$/.exec(
    stored ?? "",
  );
  const salt = match?.[2] ?? "fbb08d7398cc7af89759316cc40f1dc1";
  const actual =
    match?.[1] === "scrypt"
      ? ((await legacy(password, salt, 64)) as Buffer)
      : await derive(password, salt);
  return !!match && timingSafeEqual(actual, Buffer.from(match[3], "hex"));
}
