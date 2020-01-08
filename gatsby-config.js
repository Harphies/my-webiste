module.exports = {
  siteMetadata: {
    title: `Harphies Journal `,
    description: `Harphies Journal | harphies`,
    author: `Harphies`,
    keywords: [
      "harphies",
      "harphies dev",
      "dev harphies",
      "harphies blog",
      "react blogs",
      "frontend blogs",
    ],
    ogType: "website",
    ogUrl: "https://harphies.tech/",
    lang: "en",
    image:
      "https://raw.githubusercontent.com/harphies/webapp-samples/master/images/website/profilePic.jpeg",
  },
  pathPrefix: "/profle",
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `harphies Journey`,
        short_name: `harphies Journey`,
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
          "gatsby-remark-copy-images",
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
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
