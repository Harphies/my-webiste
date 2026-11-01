import React from "react"
import FadeIn from "./FadeIn"
import profilePic from "../assets/profilePic.jpeg"
import profile from "../data/profile.json"

const Avatar = () => (
  <div className="margin30">
    <div className="posRel h145p op0 opAnimator" style={{ animationDelay: "0.07s" }}>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
        <img alt={profile.name} className="posAbs avatarImg" width="400" height="400" src={profilePic} />
      </a>
    </div>
    <div className="marginT20 textcenter">
      <FadeIn className="lh2em" style={{ animationDelay: "0.20s" }}>
        <p className="ico20">{profile.headline}</p>
        <p>{profile.specialism}</p>
        <p className="profileSummary">{profile.summary}</p>
        <p className="descriptionTxtColor">{profile.location}</p>
      </FadeIn>
    </div>
  </div>
)
export default Avatar
