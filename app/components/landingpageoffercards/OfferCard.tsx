import React from 'react'
import Image, { StaticImageData } from 'next/image';

interface OfferCardProps {
    title: string;
    description: string;
    imageSrc: StaticImageData;
}

const OfferCard: React.FC<OfferCardProps> = ({ title, description, imageSrc }) => {
  return (
      <div className=" offerWrapper">
          <div className="CardImage">
              <Image
                  className="h-full opacity-55 hover:opacity-90"
                  src={imageSrc}
                  alt={title}
                  quality={100}
              />
          </div>
          
          <div className="Card">
              <h2 className="hompagecardh2">{title}</h2>
              <p className="hompagecardPara">{description}</p>
          </div>

          
      </div>
  )
}

export default OfferCard;
