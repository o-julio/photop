import React from 'react'

export default class ThumbListItem extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      src: ''
    }

    this.handleRemoveFile = this.handleRemoveFile.bind(this)
  }

  /**
   * Removes current file from fileList
   * @return {undefined}         void
   */
  handleRemoveFile() {
    const { file, onRemoveFile } = this.props
    onRemoveFile(file)
  }

  render() {
    const { file } = this.props
    const { src } = this.state

    const id = `thumb_${file.path || file.name}`
    const reader = new FileReader()

    reader.onloadend = () => {
      this.setState({
        src: reader.result
      })
    }

    if (file) {
      reader.readAsDataURL(file)
    }

    return (
      <div className="column is-one-quarter-desktop is-half-tablet">
        <div className="card">
          <div className="card-image has-text-centered">
            {src ? (
              <figure className="image is-5by3">
                <img
                  id={id}
                  src={src}
                  alt=""
                />
              </figure>
            ) : (
              <button type="button" className="button is-white is-loading"></button>
            )}
          </div>
          <footer className="card-footer">
            <div className="card-footer-item ">
              <button
                type="button"
                className="button is-danger"
                onClick={this.handleRemoveFile}
              >
                Remove
              </button>
            </div>
          </footer>
        </div>
      </div>

    )
  }
}
