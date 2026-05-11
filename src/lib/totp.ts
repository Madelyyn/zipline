import { generateSecret, generateURI, verify } from 'otplib';
import { toDataURL } from 'qrcode';

export function generateKey() {
  return generateSecret({
    length: 16,
  });
}

export async function verifyTotpCode(code: string, secret: string) {
  return verify({
    secret,
    token: code,
    epochTolerance: 30,
  });
}

export function totpQrcode({
  issuer,
  username,
  secret,
}: {
  issuer?: string;
  username: string;
  secret: string;
}) {
  return toDataURL(
    generateURI({
      secret,
      issuer: issuer ?? 'Zipline',
      label: username,
    }),
  );
}
