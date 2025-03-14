import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (userId: string) => {
  const EXPIRES_IN = process.env["JWT_EXPIRATION"] as string;

  const token = jwt.sign({ id: userId }, process.env["JWT_SECRET"] as string, {
    expiresIn: parseInt(EXPIRES_IN) ?? "30d",
  });

  return token;
};

export type DecodedToken = JwtPayload & { id: string };

const decodeToken = (token: string): Promise<DecodedToken> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env["JWT_SECRET"] as string, (err, decoded) => {
      if (err || !decoded) return reject(err);
      resolve(decoded as DecodedToken);
    });
  });
export { createToken, decodeToken };
