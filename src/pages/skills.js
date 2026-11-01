import React from "react"
import PropTypes from "prop-types"
import Layout from "../components/Layout-Page"
import FadeIn from "../components/FadeIn"
import { technicalSkills1, technicalSkills2 } from "../components/constants"
import SEO from "../components/seo"
import profile from "../data/profile.json"

class Skills extends React.Component {
  constructor(props) {
    super(props)
    this.themer = this.themer.bind(this)
    this.getPrevTheme = this.getPrevTheme.bind(this)
    this.renderHalf = this.renderHalf.bind(this)
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

  renderHalf(second) {
    const skills = second ? technicalSkills2 : technicalSkills1
    return <div>{skills.map(([title, detail]) => (
      <section className="pad20 lh2em" key={title}>
        <h2 className="ico20">{title}</h2>
        <p className="descriptionTxtColor">{detail}</p>
      </section>
    ))}</div>
  }
  render() {
    return (
      <Layout className="mh100" theme={this.state.theme} themer={this.themer}>
        <SEO title={`Expertise | ${profile.name}`} description="LLM inference, GPU infrastructure, Kubernetes, RDMA, performance evaluation and GitOps." ogUrl="https://harphies.tech/skills/" />
        <div>
          <div className="mh90vh">
            <div className="width100 textcenter oh">
              <FadeIn className=" fs35 fadeInWord ">Areas of Focus</FadeIn>
            </div>
            <div className="skillCard marginT50">
              <div className="widthhalf">{this.renderHalf()}</div>
              <div className="widthhalf">{this.renderHalf(true)}</div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

Skills.propTypes = {
  data: PropTypes.object,
}

export default Skills
