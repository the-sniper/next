import React, { useState, useEffect, useContext } from 'react';
import PrimaryButton from '../../atoms/PrimaryButton';
import { makeStyles } from '@material-ui/core/styles';
import Slider from 'react-slick';
import Typist from 'react-typist';
import { noImageAvailable } from '../../../common/components';
import ReactPlayer from 'react-player';
import { Button } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: 'transparent',
    boxShadow: 'none',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function HomeBanner(props) {
  const [sliderMain, setSliderMain] = useState(null);
  const [sliderThumb, setSliderThumb] = useState(null);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(0);
  const [currCategory, setCurrCategory] = useState('Products');
  const [categories, setCategories] = useState([]);
  // const [isPlayerOn, setIsPlayerOn] = useState(true);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let slider1 = [];
  let slider2 = [];

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    lazyLoad: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };
  const thumbSettings = {
    slidesToShow: 7,
    swipeToSlide: true,
    focusOnSelect: true,
    adaptiveHeight: true,
    variableWidth: true,
    beforeChange: (current, next) => {
      setPreviousSlideIndex(current);
      setCurrentSlideIndex(next);
    },
    afterChange: (current) => setNextSlideIndex(current),
  };
  const categoriess = [
    { img: '/assets/images/art.jpg', title: 'Art' },
    { img: '/assets/images/banner.jpg', title: 'Asian Antiques' },
    { img: '/assets/images/automobile.jpg', title: 'Automobile' },
    { img: '/assets/images/coin.jpg', title: 'Collectible Coins' },
    { img: '/assets/images/electronic.jpg', title: 'Electronics' },
    { img: '/assets/images/furniture.jpg', title: 'Furniture' },
    { img: '/assets/images/jewelry.jpg', title: 'Jewelry' },
    { img: '/assets/images/home.jpg', title: 'Homes' },
    { img: '/assets/images/livestock.jpg', title: 'Live Stock' },
    { img: '/assets/images/others.jpg', title: 'Others' },
  ];

  useEffect(() => {
    // if (!isPlayerOn) {
    setSliderMain(slider1);
    setSliderThumb(slider2);
    // }
  }, [slider1, slider2]);

  useEffect(() => {
    let catToDisplay = [];
    if (props.allCategory.length > 0) {
      props.allCategory.map((category) => {
        catToDisplay.push({ img: '', title: category.name });
      });
    }
    setCategories(catToDisplay);
  }, [props.allCategory]);

  const handleExploreButtonClick = () => {
    props.handleCategoryClick(props.allCategory[currentSlideIndex].id);
  };

  return (
    <div className='homeBanner'>
      {categoriess && categoriess.length > 0 ? (
        <>
          {/* <div className='tagline customContainer'>
            <h4>THE NUMBER ONE AUCTION ON THE WEB</h4>
          </div> */}
          <div className='hbCnt'>
            <div className='hbLt w-100 text-center'>
              {/* <h1>
                Find Your
                <Typist
                  count={3}
                  key={currentSlideIndex}
                  cursor={{ hideWhenDone: true }}
                >
                  {categoriess[currentSlideIndex].title}
                </Typist>{' '}
                Locally
              </h1> */}
              <div className='btnWrpr d-flex align-items-center justify-content-center'>
                <PrimaryButton
                  label='Explore'
                  btnSize='small'
                  onClick={handleExploreButtonClick}
                />
                <Button className='otlnButton' onClick={handleClickOpen}>
                  Watch Video <PlayCircleOutlineIcon className='ml-2' />
                </Button>
              </div>
            </div>
            {/* {isPlayerOn ? (
              <ReactPlayer
                url="https://vimeo.com/591863269"
                playing="true"
                width="649px"
                height="374px"
                onEnded={() => {
                  setIsPlayerOn(false);
                }}
              />
            ) : ( */}
            {/* <div className='hbRt d-none'>
              <Slider
                {...settings}
                asNavFor={sliderThumb}
                ref={(slider) => (slider1 = slider)}
              >
                {categoriess.map((data, index) => (
                  <div>
                    <img
                      src={data.img}
                      alt={data.title}
                      onError={(e) => noImageAvailable(e)}
                    />
                  </div>
                ))}
              </Slider>
              <Slider
                asNavFor={sliderMain}
                ref={(slider) => (slider2 = slider)}
                {...thumbSettings}
                className='bannerThumb'
              >
                {categoriess.map((data, index) => (
                  <>
                    <div className='hbCatTitle'>
                      <h6>{data.title}</h6>
                    </div>
                  </>
                ))}
              </Slider>
            </div> */}
            {/* )} */}
          </div>
          <Dialog
            className='videoDialogWrapper'
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <div className='d-flex align-items-center justify-content-end'>
                <IconButton
                  edge='start'
                  color='inherit'
                  onClick={handleClose}
                  aria-label='close'
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </AppBar>
            <ReactPlayer
              className='cstmVdoPlayer'
              url='https://vimeo.com/591863269'
              playing='true'
            />
          </Dialog>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default HomeBanner;
