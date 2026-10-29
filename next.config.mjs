/** @type {import('next').NextConfig} */
const nextConfig = {
  // The résumé opens in the browser's PDF viewer, never as a forced download
  // (2026-10-27, Jonathan), with a readable name if it's saved.
  async headers() {
    return [
      {
        source: "/jonathan-santiaguel-resume.pdf",
        headers: [{ key: "Content-Disposition", value: 'inline; filename="Jonathan-Santiaguel-Resume.pdf"' }],
      },
    ];
  },
};

export default nextConfig;
