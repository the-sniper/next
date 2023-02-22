import React from "react";
import Slider from "react-slick";

const ClientCarousel = () => {
  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    variableWidth: true,
    adaptiveHeight: true,
    arrows: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="clntCrslWrapper">
      <h5 className="mb-3">Our Customers</h5>
      <Slider {...settings}>
        <div>
          <img
            width={"220"}
            src="/assets/images/clientlogos/renugo.png"
            alt="Renugo"
          />
        </div>
        <div>
          <img
            width={"150"}
            src="/assets/images/clientlogos/slibuy.png"
            alt="Slibuy"
          />
        </div>
        <div>
          <img
            width={"136"}
            src="/assets/images/clientlogos/nellis.png"
            alt="Nellis"
          />
        </div>
        <div>
          <img
            width={"120"}
            src="/assets/images/clientlogos/seadwelling.png"
            alt="Sea Dwelling"
          />
        </div>
        <div>
          <img
            width={"149"}
            src="/assets/images/clientlogos/somos.png"
            alt="Somos"
          />
        </div>
        <div>
          <img
            width={"285"}
            src="/assets/images/clientlogos/gmf.png"
            alt="GMF"
          />
        </div>
        <div>
          <img
            width={"142"}
            src="/assets/images/clientlogos/idealfloor.png"
            alt="Ideal Floors"
          />
        </div>
        <div>
          <img
            width={"108"}
            src="/assets/images/clientlogos/iquippo.png"
            alt="IQuippo"
          />
        </div>
        <div>
          <img
            width={"161"}
            src="/assets/images/clientlogos/ruumr.png"
            alt="Rummr"
          />
        </div>
        <div>
          <img
            width={"123"}
            src="/assets/images/clientlogos/aucwine.png"
            alt="AucWine"
          />
        </div>
        <div>
          <img
            width={"224"}
            src="/assets/images/clientlogos/beestate.png"
            alt="Bee State"
          />
        </div>
        {/* <div>
          <img src="/assets/images/clientlogos/dealbadger.png" />
        </div> */}
      </Slider>
    </div>
  );
};

export default ClientCarousel;
