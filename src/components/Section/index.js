import React from 'react'

export default class Section extends React.PureComponent {
  render() {
    const { title, subtitle, children } = this.props
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">{title}</h1>
          <h2 className="subtitle">
            {subtitle}
          </h2>
        </div>
        <div className="container">
          {children}
        </div>
      </section>
    )
  }
}
