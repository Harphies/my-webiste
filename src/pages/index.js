import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/Layout-Page"
import SEO from "../components/seo"
import { Link } from "gatsby"
import profile from "../data/profile.json"
import profilePic from "../assets/profilePic.jpeg"
import { FiArrowUpRight, FiArrowRight, FiMapPin } from "react-icons/fi"
import { FaGithub, FaLinkedinIn } from "react-icons/fa"
import "../components/style/home.css"

class BlogPageHome extends React.Component {
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
    const { title, description, lang, keywords, ogUrl, ogType } = this.props
    const featured = this.props.data.featuredPost
    return (
      <Layout
        className="home-page"
        theme={this.state.theme}
        themer={this.themer}
      >
        <SEO
          title={title}
          description={description}
          lang={lang}
          keywords={keywords}
          ogUrl={ogUrl}
          ogType={ogType}
        />
        <main className="home-main" id="main-content">
          <section className="home-hero" aria-labelledby="home-title">
            <div className="home-intro">
              <p className="home-eyebrow">HPC & AI infrastructure</p>
              <h1 id="home-title">{profile.name}</h1>
              <p className="home-role">{profile.headline}</p>
              <p className="home-summary">{profile.summary}</p>
              <div className="home-actions">
                <Link className="home-primary-link" to="/blogs/">
                  Read my engineering notes <FiArrowRight aria-hidden="true" />
                </Link>
                <Link className="home-secondary-link" to="/aboutme/">
                  About my work <FiArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <nav className="home-socials" aria-label="Find me online">
                <a
                  href="https://github.com/Harphies"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub aria-hidden="true" /> GitHub
                  <span className="home-sr-only"> (opens in a new tab)</span>
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn aria-hidden="true" /> LinkedIn
                  <span className="home-sr-only"> (opens in a new tab)</span>
                </a>
              </nav>
            </div>
            <div className="home-journal">
              <div className="home-person">
                <img
                  className="home-portrait"
                  src={profilePic}
                  alt="Portrait of Taofeek Olalekan"
                  width="112"
                  height="112"
                />
                <p className="home-location">
                  <FiMapPin aria-hidden="true" />
                  <span>
                    Based in London
                    <span className="home-location-country">
                      United Kingdom
                    </span>
                  </span>
                </p>
              </div>
              <article
                className="home-feature"
                aria-labelledby="home-feature-title"
              >
                <div className="home-feature-topline">
                  <p className="home-eyebrow">From the engineering journal</p>
                  <span className="home-feature-number" aria-hidden="true">
                    01
                  </span>
                </div>
                <h2 id="home-feature-title">
                  <Link to={featured.frontmatter.path}>
                    {featured.frontmatter.title}
                  </Link>
                </h2>
                <p className="home-feature-description">
                  {featured.frontmatter.description}
                </p>
                <ul
                  className="home-feature-topics"
                  aria-label="Technologies covered"
                >
                  <li>GLM-5.3</li>
                  <li>B200</li>
                  <li>Dynamo</li>
                  <li>SGLang</li>
                </ul>
                <div className="home-feature-footer">
                  <span>{featured.timeToRead} min read</span>
                  <Link
                    to={featured.frontmatter.path}
                    aria-label={`Read the article: ${featured.frontmatter.title}`}
                  >
                    Read the article <FiArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
          </section>
          <section className="home-focus" aria-labelledby="home-focus-title">
            <div className="home-section-heading">
              <h2 id="home-focus-title">What I work on</h2>
              <p>Hardware, networking and software, working together.</p>
            </div>
            <div className="home-focus-grid">
              <div className="home-focus-item">
                <span className="home-focus-number" aria-hidden="true">
                  01 /
                </span>
                <h3>Inference systems</h3>
                <p>
                  Serving topologies, KV capacity and scheduling. Measuring
                  latency, concurrency and GPU efficiency with Dynamo and
                  SGLang.
                </p>
              </div>
              <div className="home-focus-item">
                <span className="home-focus-number" aria-hidden="true">
                  02 /
                </span>
                <h3>GPU platforms</h3>
                <p>
                  Kubernetes, GPU/NIC affinity, NUMA placement and RDMA.
                  Following the connections from the workload to the fabric.
                </p>
              </div>
              <div className="home-focus-item">
                <span className="home-focus-number" aria-hidden="true">
                  03 /
                </span>
                <h3>Production operations</h3>
                <p>
                  Reproducible deployments, observability and recovery. Working
                  through the configuration, measurements and source code.
                </p>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    )
  }
}

BlogPageHome.propTypes = {
  data: PropTypes.object,
}

export default BlogPageHome

export const query = graphql`
  query SiteTitleQuery {
    featuredPost: markdownRemark(
      frontmatter: {
        path: { eq: "/blogs/llm-serving-topologies-and-why-they-matter" }
      }
    ) {
      timeToRead
      frontmatter {
        title
        path
        description
      }
    }
    site {
      siteMetadata {
        title
        description
        keywords
        ogUrl
        ogType
      }
    }
  }
`
