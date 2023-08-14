/** @type {import('next').NextConfig} */


module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img-cdn.2game.vn',
                port: '',
                pathname: '/my-bucket/**',
            },
        ],
    },
}
