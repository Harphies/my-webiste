import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { FaMoon, FaSun } from "react-icons/fa"

const Toggle = ({ theme, themer, className }) => (
  <div className={className}>
    <Helmet
      meta={[
        { name: "theme-color", content: theme === "dark" ? "#000" : "#235bc1" },
      ]}
    />
    <button
      className="theme-toggle"
      type="button"
      onClick={themer}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <FaSun aria-hidden="true" />
      ) : (
        <FaMoon aria-hidden="true" />
      )}
    </button>
  </div>
)

Toggle.propTypes = {
  theme: PropTypes.string,
  themer: PropTypes.func,
  className: PropTypes.string,
}

export default Toggle
