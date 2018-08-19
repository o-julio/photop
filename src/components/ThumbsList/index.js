import React from 'react'
import ThumbListItem from '../ThumbListItem'
import Section from '../Section'

export default class ThumbList extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handleRemoveFile = this.handleRemoveFile.bind(this)
  }

  handleRemoveFile(fileToRemove) {
    const { fileList, onSelectFiles } = this.props
    const newFileList = fileList.filter((file) => file !== fileToRemove)
    onSelectFiles(newFileList)
  }

  render() {
    const { fileList } = this.props
    const thumbList = fileList.map((file) => {
      return (
        <ThumbListItem
          key={`thumb_${file.path || file.name}`}
          file={file}
          onRemoveFile={this.handleRemoveFile}
        />
      )
    })
    return (
      <Section
        title="Step 2"
        subtitle="Review your images and remove unwanted items"
      >
        <div className="columns is-multiline">
          {thumbList}
        </div>
      </Section>
    )
  }
}

ThumbList.defaultProps = {
  fileList: [],
  onSelectFiles: () => {}
}
