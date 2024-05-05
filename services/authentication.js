import JWT from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.JWT_SECRET;

export function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

export function validateToken(token) {
  const payload = JWT.verify(token, secret); // ? returns the user payload passed earlier if the token is verified and throws an error if the user is not verified
  return payload;
}
