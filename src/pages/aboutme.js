import React from "react"
import PropTypes from "prop-types"
import Layout from "../components/Layout-Page"
import FadeIn from "../components/FadeIn"
import profile from "../data/profile.json"
import SEO from "../components/seo"

class AboutMe extends React.Component {
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
    return (
      <Layout className="mh100" theme={this.state.theme} themer={this.themer}>
        <SEO title={`About ${profile.name} | HPC & AI Infrastructure`} description={profile.description} ogUrl="https://harphies.tech/aboutme/" />
        <div>
          <div className="mw960">
            <div
              className="width100 textcenter oh"
              style={{ lineHeight: "1.7em" }}
            >
              <FadeIn className=" fs35 fadeInWord ">About</FadeIn>
            </div>
            <div
              className="width100 textcenter oh"
              style={{ animationDelay: "4s", lineHeight: "1.7em" }}
            >
              <FadeIn className=" fs35 fadeInWord lh2em ">{profile.name}</FadeIn>
            </div>
            <div className="pad20 lh2em profileBio">
              <p>{profile.summary}</p>
              <h2>What I work on</h2>
              <ul>{profile.focus.map(item => <li key={item}>{item}</li>)}</ul>
              <h2>How I work</h2>
              <p>{profile.approach}</p>
              <p>{profile.background}</p>
              <h2>Writing and community</h2>
              <p>{profile.community}</p>
              <p>I write about what I test: the configuration, the evidence, the tradeoffs and what still needs validating.</p>
              <ul>{profile.publicWriting.map(post => <li key={post.url}><a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a></li>)}</ul>
              <p><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

AboutMe.propTypes = {
  data: PropTypes.object,
}

export default AboutMe
