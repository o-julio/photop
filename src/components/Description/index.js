import React from 'react'
import Section from '../Section'

/**
 * Returns an area to input work description
 */
class Description extends React.PureComponent {
  render() {
    const { handleChange } = this.props
    return (
      <Section
        title="Step 3"
        subtitle="Enter a nice description for your work"
      >
        <div className="field">
          <div className="control">
            <textarea
              onChange={handleChange}
              className="textarea is-large"
              type="text"
              placeholder="Type here"
            >
            </textarea>
          </div>
        </div>

      </Section>
    )
  }
}

export default Description
