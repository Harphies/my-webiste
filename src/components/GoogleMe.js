import React from "react"
import FadeIn from "./FadeIn"
const GOOGLE_ME_URL = "https://bit.ly/2N5vrIy"

const GoogleMe = () => {
  return (
    <div className="fadeInWord textcenter padT20">
      <FadeIn className="lh2em" style={{ animationDelay: "0.3s" }}>
        <a
          className="ico20 scaleOnHover google"
          rel="noopener nofollow noreferrer"
          href={GOOGLE_ME_URL}
          target="_blank"
        >
          google <h1 className="ico20 inbl">Harphies</h1>
        </a>
      </FadeIn>
    </div>
  )
}
export default GoogleMe
