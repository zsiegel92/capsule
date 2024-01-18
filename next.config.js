/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    swcMinify: true,
    // headers: () => [
    //   {
    //     source: "/:path*",
    //     headers: [
    //       {
    //         key: "Cache-Control",
    //         value: "no-store",
    //       },
    //     ],
    //   },
    // ],
    rewrites: async () => {
        return [
            {
                source: '/api/py/:path*',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/api/:path*'
                        : '/api/',
            },
            {
                source: '/docs',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/docs'
                        : '/api/docs',
            },
            {
                source: '/openapi.json',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/openapi.json'
                        : '/api/openapi.json',
            },
        ];
    },
};

module.exports = nextConfig;
