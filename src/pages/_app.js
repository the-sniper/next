import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Head from "next/head";
import createEmotionCache from "../lib/material-ui/create-emotion-cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../lib/material-ui/theme";
import "allsettled-polyfill";
import { StylesProvider } from "@material-ui/core";
import { socket } from "@/common/socket";

import "../styles/app.css";
import "../index.css";
import "../styles/Home.css";
import "../Utils/Utils.css";
import "../styles/productCommon.css";
import "../styles/passwordStrength.css";
import "../styles/Skeleton.css";
import "../styles/FavoriteCheckbox.css";
import "../styles/NoRecordsFound.css";
import "../styles/RadioBox.css";
import "../styles/AddToCalendar.css";
import "../styles/AddressCard.css";
import "../styles/Loader.css";
import "../styles/MarketingLoader.css";
import "../styles/PreBidComponent.css";
import "../styles/ProductCard.css";
import "../styles/SavedCard.css";
import "../styles/searchfield.css";
import "../styles/BidHistory.css";
import "../styles/Cars.css";
import "../styles/Dialog.css";
import "../styles/DonorHistory.css";
import "../styles/FilterPanel.css";
import "../styles/Footer.css";
import "../styles/FullScreenPopup.css";
import "../styles/header.css";
import "../styles/HomeBanner.css";
import "../styles/Popup.css";
import "../styles/ProductViewSlider.css";
import "../styles/DashboardLayout.css";
import "../styles/AuctionSeller.css";
import "../styles/AuctionView.css";
import "../styles/auctioneer.css";
import "../styles/Cart.css";
import "../styles/carsView.css";
import "../styles/checkoutCart.css";
import "../styles/Checkout.css";
import "../styles/Cards.css";
import "../styles/Dashboard.css";
import "../styles/DemoRequest.css";
import "../styles/forgotPassword.css";
import "../styles/PluginsView.css";
import "../styles/Invoice.css";
import "../styles/liquidation.css";
import "../styles/LiveLots.css";
import "../styles/LiveLotView.css";
import "../styles/Login.css";
import "../styles/Marketing.css";
import "../styles/TemplateBuilder.css";
import "../styles/MarketingDemo.css";
import "../styles/ProductView.css";
import "../styles/Reviews.css";
import "../styles/CarAuctions.css";
import "../styles/Search.css";
import "../styles/SearchAuction.css";
import "../styles/Signup.css";
import "../styles/Static.css";
import "../styles/ourTeam.css";
import "../styles/Ticketing.css";
import "../styles/Videos.css";

import ProductState from "@/context/product/productState";
import AuctionState from "@/context/auction/auctionState";
import CommonState from "@/context/common/commonState";
import AlertState from "@/context/alert/alertState";
import Alerts from "@/common/alert";
import BuyerState from "@/context/buyer/buyerState";
import UserState from "@/context/user/userState";
import { SnackbarProvider } from "notistack";
import Button from "@material-ui/core/Button";
import StripeCardState from "@/context/stripe/card/cardState";
import AuthState from "@/context/auth/authState";
import { keepTheme } from "src/Utils/theme";
import CommonTemplate from "@/components/templates/commonTemplate";
import { useRouter } from "next/router";
import InitialLoad from "@/common/initialLoad";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
global.site_url = process.env.NEXT_PUBLIC_API_DOMAIN;
global.images_url = process.env.NEXT_PUBLIC_IMAGE_URL;

function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const notistackRef = useRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  useEffect(() => {
    keepTheme();
  });

  Number.prototype.toUSFormat = function (n = 2) {
    return this.toLocaleString("en-US", {
      minimumFractionDigits: n,
      maximumFractionDigits: n,
    });
  };
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
  };

  const [userIn, setUserin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router?.pathname.includes("liveLots")) {
      // console.log("Im in");
      setUserin(true);
      socket.emit("userWatch", "userConnected");
    } else {
      if (userIn === true) {
        // console.log("Im out");
        setUserin(false);
        socket.emit("userWatch", "userDisconnected");
      }
    }
  }, [router?.pathname]);

  return (
    <CacheProvider value={emotionCache}>
      <CommonState>
        <AuthState>
          <UserState>
            <ProductState>
              <AuctionState>
                <BuyerState>
                  <StripeCardState>
                    <AlertState>
                      <SnackbarProvider
                        maxSnack={3}
                        ref={notistackRef}
                        action={(key) => (
                          <Button
                            style={{ color: "#fff" }}
                            onClick={onClickDismiss(key)}
                          >
                            <span className="material-icons">close</span>
                          </Button>
                        )}
                      >
                        <StylesProvider injectFirst>
                          <div className="App">
                            <Alerts />
                            {/* <InitialLoad /> */}
                            <CommonTemplate>
                              <Component {...pageProps} />
                            </CommonTemplate>
                          </div>
                        </StylesProvider>
                      </SnackbarProvider>
                    </AlertState>
                  </StripeCardState>
                </BuyerState>
              </AuctionState>
            </ProductState>
          </UserState>
        </AuthState>
      </CommonState>
    </CacheProvider>
  );
}

export default App;
