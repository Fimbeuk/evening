import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const tenantId = process.env.AZURE_AD_TENANT_ID!;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    {
      ...MicrosoftEntraID({
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
        authorization: {
          url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
          params: {
            scope: "openid profile email User.Read",
          },
        },
        token: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      }),
      id: "azure-ad",
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
