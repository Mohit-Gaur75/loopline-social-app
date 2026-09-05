import client from "./client";

export const signup = (data) => client.post("/auth/signup", data).then((res) => res.data);
export const login = (data) => client.post("/auth/login", data).then((res) => res.data);
export const getMe = () => client.get("/auth/me").then((res) => res.data);
