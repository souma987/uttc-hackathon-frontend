import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST ?? "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHost,
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
