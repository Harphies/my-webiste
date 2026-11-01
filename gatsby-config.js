const profile = require("./src/data/profile.json")

module.exports = {
  siteMetadata: {
    title: `${profile.name} | ${profile.headline}`,
    description: profile.description,
    author: profile.name,
    keywords: ["HPC", "AI infrastructure", "LLM inference", "GPU", "Kubernetes", "NVIDIA Dynamo", "SGLang", "RDMA", "sovereign AI cloud"],
    ogType: "website",
    ogUrl: "https://harphies.tech/",
    lang: "en",
    image:
      "https://raw.githubusercontent.com/harphies/webapp-samples/master/images/website/profilePic.jpeg",
  },
  // Set PATH_PREFIX only when publishing below a subpath (for example GitHub Pages).
  pathPrefix: process.env.PATH_PREFIX || "",
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `${profile.name} — Engineering Journal`,
        short_name: `${profile.name} — Engineering Journal`,
        start_url: `/`,
        background_color: `#1f1f1f`,
        theme_color: `#235bc1`,
        display: `minimal-ui`,
        icon: `src/assets/profilePic.jpeg`,
        theme_color_in_head: false,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1440,
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              inlineCodeMarker: "÷",
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
            },
          },
        ],
      },
    },
  ],
}
