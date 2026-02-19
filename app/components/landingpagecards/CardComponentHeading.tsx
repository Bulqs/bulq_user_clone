import React from 'react'

interface CardComponentHeadingProps {
    title: string;
    description?: string; // Support StaticImageData and string for flexibility
}

const CardComponentHeading: React.FC<CardComponentHeadingProps> = ({ title, description }) => {
  return (
      <div className="headWrapper">
              <h2 className="hompagecardh2">{title}</h2>
              <p className="hompagecardPara">{description}</p>
      </div>
  )
}

export default CardComponentHeading
