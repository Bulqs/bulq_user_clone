import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface CardComponent3Props {
    title: string;
    description: string;
    imageSrc: StaticImageData | string; // Support StaticImageData and string for flexibility
}

const CardComponent3: React.FC<CardComponent3Props> = ({ title, description, imageSrc }) => {
    return (
        <div
            className="cardWrapper bg-cover bg-no-repeat bg-center hover:opacity-90"
            style={{ backgroundImage: `url(${typeof imageSrc === 'string' ? imageSrc : imageSrc.src})` }}
        >
            <div className="CardTransparent">
                <h2 className="hompagecardh2">{title}</h2>
                <p className="hompagecardPara">{description}</p>
            </div>
        </div>
    );
}

export default CardComponent3;
