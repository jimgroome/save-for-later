import React from 'react'
import Link from './Link'

const Links = ({links, onDeleteClick = null}) => {
    return (
        <table className="table">
        <tbody>
          {links.map((link) => (
              <Link link={link} onDeleteClick={onDeleteClick} key={link.uuid} />
          ))}
        </tbody>
      </table>
)
}

export default Links
