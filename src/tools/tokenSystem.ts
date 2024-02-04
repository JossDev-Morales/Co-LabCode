import { UUID } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import uuid from "./getUUID";

export interface authenticationPayload {
  credentialsId: UUID | string;
  userId?: UUID | string;
  colabname?: string;
  jti?:UUID
  role: "USER" | "ADMIN" | "MANAGER";
}

export class TokenSpreed {
  #key: string;
  constructor(key: string) {
    this.#key = key;
  }
  public auth({credentialsId,role,colabname,jti,userId}: authenticationPayload) {
    const id = jti??uuid();
    const acces = jwt.sign({ acces: true,credentialsId,role,colabname,userId}, this.#key, {
      expiresIn: "24h",
      algorithm: "HS256",
      issuer: "AUTH",
      jwtid: id,
    });
    const refresh = jwt.sign({ refresh: true,credentialsId,role,colabname,userId}, this.#key, {
      expiresIn: "3 days",
      algorithm: "HS256",
      issuer: "AUTH",
      jwtid: id,
    });
    return { acces, refresh };
  }
  public verification(ID: UUID) {
    const token = jwt.sign({ identifier: ID }, this.#key, {
      algorithm: "HS256",
      expiresIn: "7 days",
      issuer: "VERIFICATION",
    });
    return token;
  }
  public recovery(ID: UUID) {
    const token = jwt.sign({ identifier: ID }, this.#key, {
      algorithm: "HS256",
      expiresIn: "24h",
      issuer: "RECOVERY",
    });
  }
  public undo(ID: UUID) {
    const token = jwt.sign({ identifier: ID }, this.#key, {
      algorithm: "HS256",
      expiresIn: "7 days",
      issuer: "UNDO",
    });
  }
}
export class TokenDecoder {
  #key: string;
  constructor(key: string) {
    this.#key = key;
  }
  public refresh(refreshToken: string) {
    try {
      const { colabname, credentialsId, role, userId, jti} = this.decode(
        refreshToken
      ) as authenticationPayload 

      const accesTokens = new TokenSpreed(this.#key).auth({
        colabname,
        credentialsId,
        role,
        userId,
        jti
      });
      return accesTokens;
    } catch (error) {
      throw error;
    }
  }
  public decode(token: string): object | JwtPayload {
    try {
      const payload = jwt.verify(token, this.#key);
      return payload as object | JwtPayload;
    } catch (error) {
      throw error;
    }
  }
  public static isExpired(token: string) {
    try {
      const { exp } = jwt.decode(token) as JwtPayload;

      return Date.now() > Number(exp) * 1000;
    } catch (error) {
      throw error;
    }
  }
  public static timestamp(token: string) {
    try {
      const { iat } = jwt.decode(token) as JwtPayload;
      return new Date(Number(iat) * 1000);
    } catch (error) {
      throw error;
    }
  }
}
