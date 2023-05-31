import React from "react";
import Slider from "react-slick";
import AppCard from "../components/AppCard";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Carousel(props){
    console.log(props);
    const settings = {
      dots: true,
      centerMode: true,
      className: "carousel",
      infinite: true,
      centerPadding: "30px",
      speed: 1500,
      slidesToShow: 3,
      slidesToScroll: 1
    };
 
    const cardsJSX = props.data.map((card, index) => {
     console.log(index);
     return <div className="cardInCarousel">
        <AppCard
          key={index}
          title={card.name}
          image={card.image_url}
          description={card.categories
            .map((category) => category.title)
            .join(", ")}
          address={card.location.join(", ")}
          score={Math.round(card.averageScore * 100)}
          url={card.url}
          
        />
      </div>}
   
    );
    
    return (
      <div className="cardContainer">
        <h2> Results </h2>
        <Slider {...settings}>
          {cardsJSX}
        </Slider>
      </div>
    );
  }