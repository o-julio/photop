import React from 'react'
import PropTypes from 'prop-types'
import Section from '../Section'

export default class FilePicker extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)

    this.fileInput = React.createRef()
  }

  /**
   * Handles files selections, filtering the already existing ones
   * @return {undefined} void
   */
  handleChange() {
    const { onSelectFiles, fileList } = this.props
    // avoiding repeated files
    const newFileList = Array.from(this.fileInput.current.files).filter((file) => {
      const alreadyExists = fileList.some((previousFile) => previousFile.name === file.name)
      return !alreadyExists
    })
    onSelectFiles(fileList.concat(newFileList))
  }

  render() {
    return (
      <Section
        title="Step 1"
        subtitle="Select the images you want to include in your gallery"
      >
        <div className="field">
          <div className="file is-medium is-boxed">
            <label
              htmlFor="filePickerInput"
              className="file-label"
            >
              <input
                type="file"
                className="file-input"
                accept="image/*"
                id="filePickerInput"
                multiple
                ref={this.fileInput}
                onChange={this.handleChange}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fa fa-upload"></i>
                </span>
                <span className="file-label">
                  Add images
                </span>
              </span>
            </label>
          </div>
        </div>
      </Section>
    )
  }
}

FilePicker.propTypes = {
  onSelectFiles: PropTypes.func.isRequired,
}
