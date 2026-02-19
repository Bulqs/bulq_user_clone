import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface CardComponentProps {
    title: string;
    description: string;
    imageSrc: StaticImageData;
}

const CardComponent: React.FC<CardComponentProps> = ({ title, description, imageSrc }) => {
    return (
        <div className="cardWrapper">
            <div className="Card">
                <h2 className="hompagecardh2">{title}</h2>
                <p className="hompagecardPara">{description}</p>
            </div>

            <div className="CardImage">
                <Image
                    className="h-full opacity-55 hover:opacity-90"
                    src={imageSrc}
                    alt={title}
                    quality={100}
                />
            </div>
        </div>
    );
}
    export default CardComponent;
