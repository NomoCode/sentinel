/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'cdn.sideforge.io' },
            { hostname: 'discord.com' },
            { hostname: 'cdn.discordapp.com'}
        ]
    }
}

export default nextConfig;
