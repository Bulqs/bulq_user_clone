import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface CardComponent2Props {
    title: string;
    description: string;
    imageSrc: StaticImageData;
}

const CardComponent2: React.FC<CardComponent2Props> = ({title, description, imageSrc}) => {
    return (
        <div className="cardWrapper">

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
    );
}

export default CardComponent2
