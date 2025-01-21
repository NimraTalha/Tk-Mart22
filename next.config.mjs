/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:["images.unsplash.com", "cdn.sanity.io"]
    },
    env: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-07-07",
      },
};

export default nextConfig;
