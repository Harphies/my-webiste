import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"
import Layout from "../components/Layout-Page"
import { portfolioDetails } from "../components/constants"
import FadeIn from "../components/FadeIn"
import { FaExternalLinkAlt } from "react-icons/fa"
import SEO from "../components/seo"
import profile from "../data/profile.json"

class BlogPageHome extends React.Component {
  constructor(props) {
    super(props)
    this.themer = this.themer.bind(this)
    this.getPrevTheme = this.getPrevTheme.bind(this)
    this.state = {
      theme: null,
      show: false,
    }
  }

  componentDidMount() {
    const theme = this.getPrevTheme()
    this.setState({ theme })
    setTimeout(() => {
      this.setState({ show: true })
    }, 900)
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
    return (
      <Layout theme={this.state.theme} themer={this.themer}>
        <SEO title={`Selected work | ${profile.name}`} description="AI infrastructure, long-context LLM serving, performance evaluation and earlier engineering projects." ogUrl="https://harphies.tech/portfolio/" />
        <div className="">
          <div className=" width100 textcenter oh">
            <FadeIn className="fs35 padT20 inline lh2em">
              Engineering{" "}
            </FadeIn>
          </div>
          <div className="mB25  width100 textcenter oh">
            <FadeIn className="fs35 inline " style={{ animationDelay: "0.5s" }}>
              {"in practice"}
            </FadeIn>
          </div>
        </div>
        {!this.state.show && (
          <div className="mw960 ">
            <div className="sideFill" />
            <div className="sideFill" style={{ animationDelay: "0.2s" }} />
            <div className="sideFill" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
        {this.state.show && (
          <div className="mw960 pad10">
            <div className="themeColorBackground pad10">
              <div
                className="op0 opAnimator"
                style={{ animationDelay: "0.3s" }}
              >
                {Object.keys(portfolioDetails).map(projectType => (
                  <div key={projectType}>
                    <div className="white ico25 pad10 fb marginTB10 lh2em">
                      {projectType +
                        (portfolioDetails[projectType].date
                          ? " (" + portfolioDetails[projectType].date + ")"
                          : "")}
                    </div>
                    <div className="projectContainer">
                      {portfolioDetails[projectType].details.map(project => (
                        <div className="projectCard" key={project[0]}>
                          <div className="headingTxtColor textcenter fb padB10">
                            <span>{project[0]}</span>
                            {project[1] && (
                              <span className=" posAbs scaleOnHover fr">
                                {" "}
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="padLR20"
                                  href={project[1]}
                                >
                                  <FaExternalLinkAlt />
                                </a>
                              </span>
                            )}
                          </div>
                          <div className=" textcenter descriptionTxtColor txtOverflow">
                            {project[2]}
                          </div>
                          <div className="headingTxtColor padT10 textcenter">
                            {project[3]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Layout>
    )
  }
}

BlogPageHome.propTypes = {
  data: PropTypes.object,
}

export default BlogPageHome

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          id
          frontmatter {
            path
            title
            date(formatString: "MMM DD, YYYY")
            author
            timeToRead
            description
          }
        }
      }
    }
  }
`
