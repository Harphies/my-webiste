import React from "react"
import FadeIn from "./FadeIn"
import profilePic from "../assets/profilePic.jpeg"

const LINKEDIN_URL = "https://www.linkedin.com/in/olalekan-taofeek/"
const GI_LINKEDIN_URL = "https://www.linkedin.com/in/olalekan-taofeek/"

const Avatar = () => {
  return (
    <div className="margin30">
      <div
        className="posRel h145p op0 opAnimator "
        style={{ animationDelay: "0.07s" }}
      >
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          <img
            alt="profileImg"
            className="posAbs avatarImg "
            width="400"
            height="400"
            src={profilePic}
          />
        </a>
      </div>
      <div className="marginT20">
        {/* <div className="padT10 width100 textcenter avatarInto oh">
          <FadeIn className="lh2em" style={{ animationDelay: '0.6s' }}>a blog by <span><a href={LINKEDIN_URL} target="_blank" className="themeColor linkHand" rel="noopener noreferrer">dhilip</a></span></FadeIn>
        </div> */}
        {/* <div className="padT10 width100 textcenter avatarInto oh">
          <FadeIn className="lh2em" style={{ animationDelay: "0.15s" }}>
            Software Architect
            <a href={GI_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <span className="linkHand">TREPLABS</span>
            </a>
          </FadeIn>
        </div> */}
        <div className="padT10 width100 textcenter avatarInto oh">
          <FadeIn
            className="lh2em"
            style={{ lineHeight: "3em", animationDelay: "0.20s" }}
          >
            Cloud Native & Solutions Architect | Serverless | Integrations | Automation
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
export default Avatar
