import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "shoplab_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export const creaToken = async (user) => {
    return new SignJWT({ userId: user.id, email: user.email, scope: "session" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
};

export const verificaToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.scope !== "session") return null;
        return payload;
    } catch {
        return null;
    }
};

// token a vita breve usato solo per il link di reimpostazione password:
// scope diverso da "session" cosi' non puo' essere riusato come cookie di sessione
export const creaTokenReset = async (user) => {
    return new SignJWT({ userId: user.id, scope: "reset-password" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(secret);
};

export const verificaTokenReset = async (token) => {
    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.scope !== "reset-password") return null;
        return payload;
    } catch {
        return null;
    }
};

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

export const getUtenteCorrente = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verificaToken(token);
};

