import React from 'react'


interface OfferCardHeadingProps {
    title: string;
    // description: string;
}

const OfferCardHeading: React.FC<OfferCardHeadingProps> = ({ title }) => {
    return (
        <div className="offerheadWrapper">
            <h2 className="hompagecardh2">{title}</h2>
            {/* <p className="hompagecardPara">{description}</p> */}
        </div>
    )
}

export default OfferCardHeading

