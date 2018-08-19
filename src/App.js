import React, { Component } from 'react'
import './App.css'
import generatePackage from './utils/package'
import FilePicker from './components/FilePicker'
import ThumbsList from './components/ThumbsList'
import Section from './components/Section'
import Description from './components/Description'

class App extends Component {
  constructor(props) {
    super(props)

    this.handleSelectFiles = this.handleSelectFiles.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.generatePackage = this.generatePackage.bind(this)

    this.state = {
      fileList: [],
      description: '',
      packageLoading: false,
    }
  }

  handleDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  handleSelectFiles(fileList) {
    this.setState({ fileList })
  }

  generatePackage() {
    const { fileList, description } = this.state
    this.setState({
      packageLoading: true
    })
    generatePackage(fileList, description).then(() => {
      this.setState({
        packageLoading: false
      })
    })
  }

  render() {
    const { fileList, packageLoading } = this.state

    return (
      <div className="content">
        <section className="hero is-light">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
              PhoTop Generator
              </h1>
              <h2 className="subtitle">
              Generate galleries to showcase your portfolio
              </h2>
            </div>
          </div>
        </section>

        <FilePicker
          onSelectFiles={this.handleSelectFiles}
          fileList={fileList}
        />
        {fileList.length ? (
          (
            <React.Fragment>
              <ThumbsList
                fileList={fileList}
                onSelectFiles={this.handleSelectFiles}
              />
              <Description
                handleChange={this.handleDescription}
              />
              <Section
                title="Step 4"
                subtitle="Download package and unzip it in your favourite server!"
              >
                <button
                  type="button"
                  className="button is-dark"
                  onClick={this.generatePackage}
                >
                  Generate
                </button>
                {
                  packageLoading ? (
                    <button type="button" className="button is-white is-loading"></button>
                  ) : null
                }
              </Section>
            </React.Fragment>
          )
        ) : null}
      </div>
    )
  }
}

export default App
