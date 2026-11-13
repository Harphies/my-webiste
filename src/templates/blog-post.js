import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout-Page"
import BlogFooter from "../components/BlogFooter"
import EndOfBlogOptions from "../components/EndOfBlogOptions"
import SEO from "../components/seo"
import PostContents from "../components/PostContents"
import { preparePost } from "../utils/preparePost"
import "../components/style/post.css"
export default class Template extends React.Component {
  constructor(props) {
    super(props)
    this.themer = this.themer.bind(this)
    this.getPrevTheme = this.getPrevTheme.bind(this)
    this.state = {
      theme: null,
    }
  }

  componentDidMount() {
    const theme = this.getPrevTheme()
    this.setState({ theme })
  }

  getPrevTheme() {
    return window.__dkBlogTheme
  }

  themer() {
    /* All other calls to themer */
    const oldTheme = this.state.theme
    const newTheme = oldTheme === "dark" ? "light" : "dark"
    if (typeof window !== "undefined") {
      this.setState({ theme: newTheme })
      document.body.className = newTheme
      window.__dkBlogTheme = newTheme
      window.localStorage.setItem("dkBlogTheme", newTheme)
    }
  }

  render() {
    const post = this.props.data.markdownRemark
    const otherPosts = this.props.data.allMarkdownRemark.edges
    const prepared = preparePost(post.html, post.headings)
    const blogEndData = {
      title: post.frontmatter.title,
      path: post.frontmatter.path,
    }
    const { theme } = this.state
    const { title, description, path, ogimage, date } = post.frontmatter
    const ogimagePath =
      ogimage && ogimage.childImageSharp && ogimage.childImageSharp.resize
        ? ogimage.childImageSharp.resize.src
        : ""
    return (
      <Layout theme={theme} themer={this.themer}>
        <SEO
          title={title + " | " + post.frontmatter.author}
          description={description}
          ogType="article"
          ogUrl={new URL(path, "https://harphies.tech").href}
          image={ogimagePath}
        />
        <div className="blogText post-page">
          <main className="post-layout">
            <article className="post-article" aria-labelledby="post-title">
              <header className="post-header">
                <p className="post-eyebrow">Engineering journal</p>
                <h1 id="post-title">{title}</h1>
                <p className="post-meta">
                  <span>{post.frontmatter.author}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={post.frontmatter.publishedAt}>{date}</time>
                  <span aria-hidden="true"> · </span>
                  <span>{post.timeToRead} min read</span>
                </p>
              </header>
              <PostContents sections={prepared.sections} />
              <div
                className="post-prose"
                dangerouslySetInnerHTML={{ __html: prepared.html }}
              />
            </article>
          </main>
          <EndOfBlogOptions data={blogEndData} />
          <BlogFooter posts={otherPosts} />
        </div>
      </Layout>
    )
  }
}

export const postQuery = graphql`
  query BlogPostByPath($slug: String!) {
    markdownRemark(frontmatter: { path: { eq: $slug } }) {
      html
      timeToRead
      headings {
        depth
        value
      }
      frontmatter {
        path
        title
        author
        description
        date(formatString: "MMM DD, YYYY")
        publishedAt: date(formatString: "YYYY-MM-DD")
        ogimage {
          childImageSharp {
            resize(width: 1200) {
              src
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 3
      filter: { frontmatter: { path: { ne: $slug } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMM DD, YYYY")
            description
            timeToRead
            path
          }
        }
      }
    }
  }
`
