import React, { useState, useEffect, useCallback, useContext } from "react";
import Container from "@material-ui/core/Container";
import { Button } from "@material-ui/core";

import StripeCustomerContext from "@/context/stripe/customer/customerContext";
import StripeCardContext from "@/context/stripe/card/cardContext";
import AuthContext from "@/context/auth/authContext";
import DashboardLayout from "@/components/templates/DashboardLayout";

const ListCards = (props) => {
  const [cards, setCards] = useState([]);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [isLoading, setIsLoading] = useState(true);
  const [manageCard, setManageCard] = useState({
    popup: false,
    status: "new",
    data: null,
  });

  const toggleFullScreenCardPopup = (popup, status, data) => {
    setManageCard({ popup, status, data });
  };

  const {
    // customer_details,
    createStripeCustomer,
    getStripeCustomer,
    addCustomerProfile,
    responseStatus: responseStatusStripeCustomer,
  } = useContext(StripeCustomerContext);

  const {
    get_all_card_details,
    get_skyflow_cards,
    getAllStripeCards,
    getSkyflowCards,
    responseStatus: responseStatusCard,
    clearResponse: clearResponseCard,
  } = useContext(StripeCardContext);

  const getStripeCards = () => {
    getAllStripeCards({
      account_id: process.env.NEXT_PUBLIC_AUCTIONPAYID,
      customer_id: user.card_paymentid,
      object: "card",
    });
    toggleFullScreenCardPopup(false, "new", null);
  };

  useEffect(() => {
    if (user && user.card_paymentid) {
      console.log(user, "getStripeuser");
      if (global.storeConfigration?.skyflow_integration?.value == 1) {
        getSkyflowCards();
      } else {
        getStripeCards();
      }
    } else if (user && !user.card_paymentid) {
      console.log("user", user);
      createStripeCustomer({
        account_id: process.env.NEXT_PUBLIC_AUCTIONPAYID,
        description: "TEST CUSTOMER",
        email: user.email,
        name: user.first_name + " " + user.last_name,
      });
    }
  }, [user]);

  useEffect(() => {
    if (responseStatusStripeCustomer) {
      if (responseStatusStripeCustomer.status === "success") {
        if (responseStatusStripeCustomer.from === "create") {
          console.log(
            "responseStatusStripeCustomer",
            responseStatusStripeCustomer
          );
          addCustomerProfile({
            customer_id: responseStatusStripeCustomer.data.id,
          });
        }
        // setIsLoading(false)
      }
    }
  }, [responseStatusStripeCustomer]);

  useEffect(() => {
    if (responseStatusCard) {
      if (
        responseStatusCard.from === "card_source_create" ||
        responseStatusCard.from === "card_source_update" ||
        responseStatusCard.from === "card_source_delete"
      ) {
        if (responseStatusCard.status === "success") {
          getStripeCards();
        }
      }
      setIsLoading(false);
    }
    return () => {
      clearResponseCard();
    };
  }, [responseStatusCard]);

  useEffect(() => {
    if (global.storeConfigration?.skyflow_integration?.value == 1) {
      if (get_skyflow_cards) {
        setCards(get_skyflow_cards);
        setIsLoading(false);
      }
    } else {
      if (get_all_card_details) {
        setCards(get_all_card_details.records);
        setIsLoading(false);
      }
    }

    return () => {
      setCards([]);
    };
  }, [get_all_card_details, get_skyflow_cards]);

  return (
    <>
      <DashboardLayout props={props}>
        <Container className="db-bids-wrapper mt-4">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div className="savedCardsCnt">
                <h2 className="mp-head">Credit Cards</h2>

                <div className="savedCards">
                  <div
                    className="emptyCard d-flex justify-content-between flex-column"
                    onClick={() => toggleFullScreenCardPopup(true, "new", null)}
                  >
                    <div>
                      <span>
                        <img src="/assets/svg/emptyCard.svg" />
                      </span>
                      <h2>ADD A NEW CARD</h2>
                    </div>
                  </div>
                  {cards &&
                    cards.length > 0 &&
                    cards?.map((data, index) => (
                      <div
                        className="credCard d-flex justify-content-between flex-column"
                        key={index}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <img src="/assets/images/hologram.png" />
                          {data.brand}
                        </div>
                        <div className="credCardNum">
                          <h2>**** **** **** {data.last4}</h2>
                        </div>
                        <div className="credCardName d-flex justify-content-between align-items-center">
                          <div className="text-left">
                            <span>CARD HOLDER</span>
                            <p>{data.name}</p>
                          </div>

                          <div className="text-left">
                            <span>EXPIRES</span>
                            <p>{data.exp_month + "/" + data.exp_year}</p>
                          </div>
                        </div>
                        {global.storeConfigration?.skyflow_integration?.value ==
                        1 ? (
                          <div className="d-flex justify-content-end align-items-center cardActions">
                            {data.isDefault && (
                              <h6 className="defaultSelection">Default</h6>
                            )}
                            <Button
                              onClick={() =>
                                toggleFullScreenCardPopup(true, "update", data)
                              }
                              className="edit"
                            >
                              <span className="material-icons">edit</span>
                              Edit
                            </Button>

                            {!data.isDefault && (
                              <>
                                <Button
                                  onClick={() =>
                                    toggleFullScreenCardPopup(
                                      true,
                                      "default",
                                      data
                                    )
                                  }
                                  className="default"
                                >
                                  <span className="material-icons">
                                    published_with_changes
                                  </span>
                                  Make Default
                                </Button>
                              </>
                            )}
                            <Button
                              onClick={() =>
                                toggleFullScreenCardPopup(true, "delete", data)
                              }
                              className="delete"
                            >
                              <span className="material-icons">delete</span>
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-end align-items-center cardActions">
                            {/* {customer_details &&
                              data.id === customer_details?.default_source && (
                                <h6 className="defaultSelection">Default</h6>
                              )}
                            <Button
                              onClick={() =>
                                toggleFullScreenCardPopup(true, "update", data)
                              }
                              className="edit"
                            >
                              <span className="material-icons">edit</span>
                              Edit
                            </Button>

                            {customer_details &&
                              data.id !== customer_details?.default_source && (
                                <>
                                  <Button
                                    onClick={() =>
                                      toggleFullScreenCardPopup(
                                        true,
                                        "default",
                                        data
                                      )
                                    }
                                    className="default"
                                  >
                                    <span className="material-icons">
                                      published_with_changes
                                    </span>
                                    Make Default
                                  </Button>
                                </>
                              )} */}
                            <Button
                              onClick={() =>
                                toggleFullScreenCardPopup(true, "delete", data)
                              }
                              className="delete"
                            >
                              <span className="material-icons">delete</span>
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              <div className="PaymentModal">
                {/* <Popup
                            open={addBank}
                            size="md"
                            handleClose={() => setAddBank(false)}
                            modaltitle="Bank Account"
                        ></Popup>*/}
                {/* {global.storeConfigration?.skyflow_integration?.value == 1 ? (
                  <CardDetailsSkyflow
                    allCards={cards}
                    data={manageCard}
                    function={toggleFullScreenCardPopup}
                  />
                ) : (
                  <CardDetails
                    allCards={cards}
                    data={manageCard}
                    function={toggleFullScreenCardPopup}
                  />
                )} */}
              </div>
            </>
          )}
        </Container>
      </DashboardLayout>
    </>
  );
};

export default ListCards;
