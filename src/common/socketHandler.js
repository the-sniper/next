export const messageHandler = (
  data,
  product,
  user,
  setAlert,
  setViewProduct,
  type
) => {
  let user_id = user?.id;
  const index = product.findIndex((s) => s.id === parseInt(data.id, 10));
  let productToChange = product[index];
  if (index !== -1) {
    if (type === "realclosedupdates") {
      if (data.usr !== "") {
        if (user_id === parseInt(data.bpop_cbidder)) {
          product[index] = {
            ...productToChange,
            market_status: "sold",
            bidtopstatus: "won",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
            buynowed: data.bpop_cbidder,
            buynowpaid: 0,
          };
          setViewProduct([...product]);
        } else if (parseInt(productToChange.bid_or_not) > 0) {
          product[index] = {
            ...productToChange,
            market_status: "sold",
            bidtopstatus: "lost",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
            buynowed: data.bpop_cbidder,
            buynowpaid: 0,
          };
          setViewProduct([...product]);
        } else {
          product[index] = {
            ...productToChange,
            market_status: "sold",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
          };
          setViewProduct([...product]);
        }
      } else {
        if (parseInt(productToChange.bid_or_not) > 0) {
          product[index] = {
            ...productToChange,
            market_status: "closed",
            bidtopstatus: "lost",
          };
          setViewProduct([...product]);
        } else {
          product[index] = {
            ...productToChange,
            market_status: "closed",
          };
          setViewProduct([...product]);
        }
      }
    } else if (type === "bidAddtime") {
      console.log("product after fake proxy socket handler", data, product);
      let date_closed = product[index].date_closed;
      if (parseInt(data.bpop_belowFive) === 1) {
        date_closed = data.bpop_belowFiveIncrement;
      }
      if (data.status === "failed" && user_id === parseInt(data.bpop_cbidder)) {
        setAlert(data.error, "error");
      }
      if (data.status !== "failed") {
        let maxbidamt = product[index].maxbidamt;
        let cbidnot = product[index].cbidnot;
        if (user_id === parseInt(data.bpop_cbidder)) {
          if (maxbidamt < parseFloat(data.bidAmount)) {
            maxbidamt = data.bidAmount;
          }
          if (data.bpop_bidcount == 1 && data.bpop_wprice == 1) {
            maxbidamt = data.bpop_wprice_morehigh;
          }
          if (data.bpop_orgwsprice && data.bpop_orgwsprice != "") {
            maxbidamt = data.bpop_orgwsprice;
          }
          setAlert("Bid placed successfully", "success");
          if (parseInt(user_id) === parseInt(data.bpop_higher)) {
            if (
              parseInt(product[index].rprice || 0) <= parseInt(data.bpop_wprice)
            ) {
              if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                data.bpop_bidstatus = `You are winning this item at $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()}. `;
              } else {
                data.bpop_bidstatus = `You are winning this item at $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()}. Your autoBid of $${parseFloat(
                  data.bpop_wprice_morehigh
                ).toUSFormat()} has been placed successfully.`;
              }
              setAlert("You are winning this item!", "success");
            } else {
              if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                data.bpop_bidstatus = `Your bid of $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()} on this item placed, but reserve price not yet met.`;
              } else {
                data.bpop_bidstatus = `Your bid of $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()} and auto bid of $${parseFloat(
                  data.bpop_wprice_morehigh
                ).toUSFormat()} on this item placed, but reserve price not yet met.`;
              }
              setAlert(
                "You are losing this item. Because of reserve price not yet met!",
                "error"
              );
            }
          } else if (data.bpop_bidstatus.includes("losing")) {
            data.bpop_bidstatus = `You've been outbid on this item. Current leading bid is $${parseFloat(
              data.bpop_wprice
            ).toUSFormat()}`;
            setAlert("You've been outbid on this item.", "error");
          }
          product[index] = {
            ...productToChange,
            next_bid: data.bpop_cuser_nextbid,
            wprice: data.bpop_wprice,
            latestbid: data.bpop_wprice,
            bidtopstatus: data.bpop_bidstatus,
            nobids: data.bpop_bidcount,
            bid_count: data.bpop_bidcount,
            incrementamt: data.bpop_increment,
            bid_or_not: 1,
            date_closed,
            maxbidamt: maxbidamt,
            latestbid_user: data.bpop_higher,
            cbidtext: "Current Bid",
          };
          setViewProduct([...product]);
        } else {
          console.log("coming inside 3333");
          if (parseInt(productToChange.bid_or_not) > 0) {
            console.log("coming inside 55555", user_id, productToChange, data);
            if (user_id === parseInt(data.bpop_higher)) {
              console.log("123123213", parseInt(productToChange.next_bid));
              if (
                parseInt(productToChange.next_bid) < parseInt(data.bpop_nextbid)
              ) {
                if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                  data.bidtopstatus = `You are winning this item at $${parseFloat(
                    data.bpop_wprice
                  ).toUSFormat()}.`;
                } else {
                  data.bidtopstatus = `You are winning this item at $${parseFloat(
                    data.bpop_wprice
                  ).toUSFormat()}. Your autoBid of $${parseFloat(
                    data.bpop_wprice_morehigh
                  ).toUSFormat()} has been placed successfully.`;
                }
                console.log("faasdfsadf");
                product[index] = {
                  ...productToChange,
                  latestbid: data.bpop_wprice,
                  nobids: data.bpop_bidcount,
                  bidcount: data.bpop_bidcount,
                  incrementamt: data.bpop_increment,
                  next_bid: data.bpop_nextbid_org,
                  wprice: data.bpop_wprice,
                  bidtopstatus: data.bidtopstatus,
                  bid_count: data.bpop_bidcount,
                  latestbid_user: data.bpop_higher,
                  date_closed,
                };
                setViewProduct([...product]);
              } else {
                if (
                  parseInt(product[index].rprice || 0) <=
                  parseInt(data.bpop_wprice)
                ) {
                  if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                    data.bidtopstatus = `You are winning this item at $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()}.`;
                  } else {
                    data.bidtopstatus = `You are winning this item at $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()}. Your autoBid of $${parseFloat(
                      data.bpop_wprice_morehigh
                    ).toUSFormat()} has been placed successfully.`;
                  }
                } else {
                  if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                    data.bidtopstatus = `Your bid of $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                  } else {
                    data.bidtopstatus = `Your bid of $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()} and auto bid of $${parseFloat(
                      data.bpop_wprice_morehigh
                    ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                  }
                }
                product[index] = {
                  ...productToChange,
                  latestbid: data.bpop_wprice,
                  nobids: data.bpop_bidcount,
                  bidcount: data.bpop_bidcount,
                  incrementamt: data.bpop_increment,
                  wprice: data.bpop_wprice,
                  bidtopstatus: data.bidtopstatus,
                  bid_count: data.bpop_bidcount,
                  latestbid_user: data.bpop_higher,
                  date_closed,
                };
                setViewProduct([...product]);
              }
            } else {
              product[index] = {
                ...productToChange,
                latestbid: data.bpop_wprice,
                nobids: data.bpop_bidcount,
                bidcount: data.bpop_bidcount,
                incrementamt: data.bpop_increment,
                next_bid: data.bpop_nextbid_org,
                wprice: data.bpop_wprice,
                bid_count: data.bpop_bidcount,
                bidtopstatus: `You've been outbid on this item. Current leading bid is $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()}`,
                bid_or_not: 1,
                date_closed,
              };
              setViewProduct([...product]);
            }
          } else {
            console.log("coming inside 6777777", data);
            product[index] = {
              ...productToChange,
              latestbid: data.bpop_wprice,
              nobids: data.bpop_bidcount,
              bidcount: data.bpop_bidcount,
              incrementamt: data.bpop_increment,
              next_bid: data.bpop_nextbid_org,
              wprice: data.bpop_wprice,
              bid_count: data.bpop_bidcount,
              cbidtext: "Current Bid",
              date_closed,
            };
            setViewProduct([...product]);
          }
        }
        // getBidHistoryProduct({ product_id: project_id })
      }
    } else if (type === "watchlistAdded") {
      product[index] = {
        ...productToChange,
        watchlistid: data.status === "added" ? 1 : 0,
      };
      setViewProduct([...product]);
    }
  }
};

export const messageHandlerSingle = (
  data,
  product,
  user,
  setAlert,
  setViewProduct,
  type,
  showAlert
) => {
  let user_id = user.id;
  const index = product.id === parseInt(data.id, 10);
  let productToChange = product;
  if (index) {
    if (type === "realclosedupdates") {
      if (data.usr !== "") {
        if (user_id === parseInt(data.bpop_cbidder)) {
          product = {
            ...productToChange,
            market_status: "sold",
            bidtopstatus: "won",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
            buynowed: data.bpop_cbidder,
            buynowpaid: 0,
          };
          setViewProduct(product);
        } else if (parseInt(productToChange.bid_or_not) > 0) {
          product = {
            ...productToChange,
            market_status: "sold",
            bidtopstatus: "lost",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
            buynowed: data.bpop_cbidder,
            buynowpaid: 0,
          };
          setViewProduct(product);
        } else {
          product = {
            ...productToChange,
            market_status: "sold",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
          };
          setViewProduct(product);
        }
      } else {
        if (parseInt(productToChange.bid_or_not) > 0) {
          product = {
            ...productToChange,
            market_status: "closed",
            bidtopstatus: "lost",
          };
          setViewProduct(product);
        } else {
          product = {
            ...productToChange,
            market_status: "closed",
          };
          setViewProduct(product);
        }
      }
    } else if (type === "bidAddtime") {
      let date_closed = product.date_closed;
      if (parseInt(data.bpop_belowFive) === 1) {
        date_closed = data.bpop_belowFiveIncrement;
      }
      if (data.status === "failed" && user_id === parseInt(data.bpop_cbidder)) {
        if (showAlert) {
          setAlert(data.error, "error");
        }
      }
      if (data.status !== "failed") {
        if (user_id === parseInt(data.bpop_cbidder)) {
          if (showAlert) {
            setAlert("Bid placed successfully", "success");
          }

          if (parseInt(user_id) === parseInt(data.bpop_higher)) {
            if (parseInt(product.rprice || 0) <= parseInt(data.bpop_wprice)) {
              if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                data.bpop_bidstatus = `You are winning this item at $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()}. `;
              } else {
                data.bpop_bidstatus = `You are winning this item at $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()}. Your autoBid of $${parseFloat(
                  data.bpop_wprice_morehigh
                ).toUSFormat()} has been placed successfully.`;
              }
              setAlert("You are winning this item!", "success");
            } else {
              if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                data.bpop_bidstatus = `Your bid of $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()} on this item placed, but reserve price not yet met.`;
              } else {
                data.bpop_bidstatus = `Your bid of $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()} and auto bid of $${parseFloat(
                  data.bpop_wprice_morehigh
                ).toUSFormat()} on this item placed, but reserve price not yet met.`;
              }
              setAlert(
                "You are losing this item. Because of reserve price not yet met!",
                "error"
              );
            }
          } else if (data.bpop_bidstatus.includes("losing")) {
            data.bpop_bidstatus = `You've been outbid on this item. Current leading bid is $${parseFloat(
              data.bpop_wprice
            ).toUSFormat()}`;
            setAlert("You've been outbid on this item.", "error");
          }
          product = {
            ...productToChange,
            next_bid: data.bpop_cuser_nextbid,
            wprice: data.bpop_wprice,
            bidtopstatus: data.bpop_bidstatus,
            bid_count: data.bpop_bidcount,
            bid_or_not: 1,
            date_closed,
            cbidtext: "Current Bid",
          };
          setViewProduct(product);
        } else {
          if (parseInt(productToChange.bid_or_not) > 0) {
            if (user_id === parseInt(data.bpop_higher)) {
              if (
                parseInt(productToChange.next_bid) < parseInt(data.bpop_nextbid)
              ) {
                if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                  data.bidtopstatus = `You are winning this item at $${parseFloat(
                    data.bpop_wprice
                  ).toUSFormat()}.`;
                } else {
                  data.bidtopstatus = `You are winning this item at $${parseFloat(
                    data.bpop_wprice
                  ).toUSFormat()}. Your autoBid of $${parseFloat(
                    data.bpop_wprice_morehigh
                  ).toUSFormat()} has been placed successfully.`;
                }
                product = {
                  ...productToChange,
                  next_bid: data.bpop_nextbid_org,
                  wprice: data.bpop_wprice,
                  bidtopstatus: data.bidtopstatus,
                  bid_count: data.bpop_bidcount,
                  date_closed,
                };
                setViewProduct(product);
              } else {
                if (
                  parseInt(product.rprice || 0) <= parseInt(data.bpop_wprice)
                ) {
                  if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                    data.bidtopstatus = `You are winning this item at $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()}.`;
                  } else {
                    data.bidtopstatus = `You are winning this item at $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()}. Your autoBid of $${parseFloat(
                      data.bpop_wprice_morehigh
                    ).toUSFormat()} has been placed successfully.`;
                  }
                } else {
                  if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                    data.bidtopstatus = `Your bid of $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                  } else {
                    data.bidtopstatus = `Your bid of $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()} and auto bid of $${parseFloat(
                      data.bpop_wprice_morehigh
                    ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                  }
                }
                product = {
                  ...productToChange,
                  wprice: data.bpop_wprice,
                  bidtopstatus: data.bidtopstatus,
                  bid_count: data.bpop_bidcount,
                  date_closed,
                };
                setViewProduct(product);
              }
            } else {
              product = {
                ...productToChange,
                next_bid: data.bpop_nextbid_org,
                wprice: data.bpop_wprice,
                bid_count: data.bpop_bidcount,
                bidtopstatus: `You've been outbid on this item. Current leading bid is $${parseFloat(
                  data.bpop_wprice
                ).toUSFormat()}`,
                bid_or_not: 1,
                date_closed,
              };
              setViewProduct(product);
            }
          } else {
            product = {
              ...productToChange,
              next_bid: data.bpop_nextbid_org,
              wprice: data.bpop_wprice,
              bid_count: data.bpop_bidcount,
              cbidtext: "Current Bid",
              date_closed,
            };
            setViewProduct(product);
          }
        }
        // getBidHistoryProduct({ product_id: project_id })
      }
    } else if (type === "watchlistAdded") {
      product = {
        ...productToChange,
        watchlistid: data.status === "added" ? 1 : 0,
      };
      setViewProduct(product);
    }
  }
};

export const messageHandlerSingleLot = (
  data,
  product,
  user,
  setAlert,
  setViewProduct,
  type,
  currentPrice,
  setCurrentPrice
) => {
  let user_id = user?.id ? user?.id : "";
  let allDetails = product;
  let lotDetails = product.lotDetails;
  const index = lotDetails.id === parseInt(data.id, 10);
  console.log("bid add time initial values", allDetails);
  let productToChange = allDetails;
  if (index) {
    if (type === "realclosedupdates") {
      if (data.usr !== "") {
        if (user_id === parseInt(data.bpop_cbidder)) {
          product = {
            ...productToChange,
            market_status: "sold",
            bidtopstatus: "won",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
            buynowed: data.bpop_cbidder,
            buynowpaid: 0,
          };
          setViewProduct(product);
        } else if (parseInt(productToChange.bid_or_not) > 0) {
          product = {
            ...productToChange,
            market_status: "sold",
            bidtopstatus: "lost",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
            buynowed: data.bpop_cbidder,
            buynowpaid: 0,
          };
          setViewProduct(product);
        } else {
          product = {
            ...productToChange,
            market_status: "sold",
            buynowamount: data.buynowamount,
            cbidtext: "Sold Price",
          };
          setViewProduct(product);
        }
      } else {
        if (parseInt(productToChange.bid_or_not) > 0) {
          product = {
            ...productToChange,
            market_status: "closed",
            bidtopstatus: "lost",
          };
          setViewProduct(product);
        } else {
          product = {
            ...productToChange,
            market_status: "closed",
          };
          setViewProduct(product);
        }
      }
    } else if (type === "bidAddtime") {
      console.log("bid add time socket value executed");
      let date_closed = lotDetails.date_closed;
      if (parseInt(data.bpop_belowFive) === 1) {
        date_closed = data.bpop_belowFiveIncrement;
      }
      if (
        data.status === "failed" &&
        parseInt(user_id) === parseInt(data.bpop_cbidder)
      ) {
        setAlert(data.error, "error");
      }
      if (data.status !== "failed") {
        let maxbidamt = lotDetails.maxbidamt;
        if (user_id === parseInt(data.bpop_cbidder)) {
          if (maxbidamt < parseFloat(data.bidAmount)) {
            maxbidamt = data.bidAmount;
          }
          if (data.bpop_bidcount == 1 && data.bpop_wprice == 1) {
            maxbidamt = data.bpop_wprice_morehigh;
          }
          if (data.bpop_orgwsprice && data.bpop_orgwsprice != "") {
            maxbidamt = data.bpop_orgwsprice;
          }

          //   if (parseInt(user_id) === parseInt(data.bpop_higher)) {
          //     if (parseInt(product.rprice) <= parseInt(data.bpop_wprice)) {
          //       if (data.bpop_wprice === data.bpop_wprice_morehigh) {
          //         data.bpop_bidstatus = `You are winning this item at $${parseFloat(
          //           data.bpop_wprice
          //         ).toUSFormat()}. `;
          //       } else {
          //         data.bpop_bidstatus = `You are winning this item at $${parseFloat(
          //           data.bpop_wprice
          //         ).toUSFormat()}. Your autoBid of $${parseFloat(
          //           data.bpop_wprice_morehigh
          //         ).toUSFormat()} has been placed successfully.`;
          //       }
          //     } else {
          //       if (data.bpop_wprice === data.bpop_wprice_morehigh) {
          //         data.bpop_bidstatus = `Your bid of $${parseFloat(
          //           data.bpop_wprice
          //         ).toUSFormat()} on this item placed, but reserve price not yet met.`;
          //       } else {
          //         data.bpop_bidstatus = `Your bid of $${parseFloat(
          //           data.bpop_wprice
          //         ).toUSFormat()} and auto bid of $${parseFloat(
          //           data.bpop_wprice_morehigh
          //         ).toUSFormat()} on this item placed, but reserve price not yet met.`;
          //       }
          //     }
          //   } else if (data.bpop_bidstatus.includes("losing")) {
          //     data.bpop_bidstatus = `You've been outbid on this item. Current leading bid is $${parseFloat(
          //       data.bpop_wprice
          //     ).toUSFormat()}`;
          //   }
          allDetails.current_bid = data.bpop_wprice;
          allDetails.next_bid = data.bpop_cuser_nextbid;
          allDetails.lotDetails.next_bid = data.bpop_cuser_nextbid;
          allDetails.lotDetails.wprice = data.bpop_wprice;
          allDetails.lotDetails.latestbid = data.bpop_wprice;
          allDetails.bidtopstatus = data.bpop_bidstatus;
          allDetails.nobids = data.bpop_bidcount;
          allDetails.incrementamt = data.bpop_increment;
          allDetails.bid_or_not = 1;
          allDetails.date_closed = date_closed;
          allDetails.maxbidamt = data.bpop_cuser_nextbid;
          allDetails.bid_count = data.bpop_bidcount;
          allDetails.bids = data.bpop_bidcount;
          allDetails.cbidtext = "Current Bid";
          setViewProduct(allDetails);
          setCurrentPrice(allDetails.current_bid);
          if (parseInt(user_id) === parseInt(data.bpop_cbidder)) {
            setAlert("Bid placed successfully", "success");
          }
        } else {
          if (
            parseInt(productToChange.bid_or_not) > 0 ||
            parseInt(productToChange.cbidnot) > 0
          ) {
            if (user_id === parseInt(data.bpop_higher)) {
              if (
                parseInt(productToChange.next_bid) < parseInt(data.bpop_nextbid)
              ) {
                if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                  data.bidtopstatus = `You are winning this item at $${parseFloat(
                    data.bpop_wprice
                  ).toUSFormat()}.`;
                } else {
                  data.bidtopstatus = `You are winning this item at $${parseFloat(
                    data.bpop_wprice
                  ).toUSFormat()}. Your autoBid of $${parseFloat(
                    data.bpop_wprice_morehigh
                  ).toUSFormat()} has been placed successfully.`;
                }
                allDetails.current_bid = data.bpop_wprice;
                allDetails.next_bid = data.bpop_nextbid_org;
                allDetails.lotDetails.next_bid = data.bpop_nextbid_org;
                allDetails.lotDetails.wprice = data.bpop_wprice;
                allDetails.lotDetails.latestbid = data.bpop_wprice;
                allDetails.bidtopstatus = data.bpop_bidstatus;
                allDetails.nobids = data.bpop_bidcount;
                allDetails.incrementamt = data.bpop_increment;
                allDetails.bid_or_not = 1;
                allDetails.date_closed = date_closed;
                allDetails.maxbidamt = data.bpop_nextbid_org;
                allDetails.bid_count = data.bpop_bidcount;
                allDetails.bids = data.bpop_bidcount;
                allDetails.cbidtext = "Current Bid";
                setViewProduct(allDetails);
                setCurrentPrice(allDetails.current_bid);
              } else {
                if (parseInt(product.rprice) <= parseInt(data.bpop_wprice)) {
                  if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                    data.bidtopstatus = `You are winning this item at $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()}.`;
                  } else {
                    data.bidtopstatus = `You are winning this item at $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()}. Your autoBid of $${parseFloat(
                      data.bpop_wprice_morehigh
                    ).toUSFormat()} has been placed successfully.`;
                  }
                } else {
                  if (data.bpop_wprice === data.bpop_wprice_morehigh) {
                    data.bidtopstatus = `Your bid of $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                  } else {
                    data.bidtopstatus = `Your bid of $${parseFloat(
                      data.bpop_wprice
                    ).toUSFormat()} and auto bid of $${parseFloat(
                      data.bpop_wprice_morehigh
                    ).toUSFormat()} on this item placed, but reserve price not yet met.`;
                  }
                }
                allDetails.current_bid = data.bpop_wprice;
                // allDetails.next_bid = data.bpop_cuser_nextbid;
                // allDetails.lotDetails.next_bid = data.bpop_cuser_nextbid;
                allDetails.lotDetails.wprice = data.bpop_wprice;
                allDetails.lotDetails.latestbid = data.bpop_wprice;
                allDetails.bidtopstatus = data.bpop_bidstatus;
                allDetails.nobids = data.bpop_bidcount;
                allDetails.incrementamt = data.bpop_increment;
                allDetails.bid_or_not = 1;
                allDetails.date_closed = date_closed;
                // allDetails.maxbidamt = data.bpop_cuser_nextbid;
                allDetails.bid_count = data.bpop_bidcount;
                allDetails.bids = data.bpop_bidcount;
                allDetails.cbidtext = "Current Bid";
                setViewProduct(allDetails);
                setCurrentPrice(allDetails.current_bid);
              }
            } else {
              allDetails.current_bid = data.bpop_wprice;
              allDetails.next_bid = data.bpop_nextbid_org;
              allDetails.lotDetails.next_bid = data.bpop_nextbid_org;
              allDetails.lotDetails.wprice = data.bpop_wprice;
              allDetails.lotDetails.latestbid = data.bpop_wprice;
              allDetails.bidtopstatus = data.bpop_bidstatus;
              allDetails.nobids = data.bpop_bidcount;
              allDetails.incrementamt = data.bpop_increment;
              allDetails.bid_or_not = 1;
              allDetails.date_closed = date_closed;
              allDetails.maxbidamt = data.bpop_nextbid_org;
              allDetails.bid_count = data.bpop_bidcount;
              allDetails.bids = data.bpop_bidcount;
              allDetails.cbidtext = "Current Bid";
              setViewProduct(allDetails);
              setCurrentPrice(allDetails.current_bid);
            }
          } else {
            allDetails.current_bid = data.bpop_wprice;
            allDetails.next_bid = data.bpop_nextbid_org;
            allDetails.lotDetails.next_bid = data.bpop_nextbid_org;
            allDetails.lotDetails.wprice = data.bpop_wprice;
            allDetails.lotDetails.latestbid = data.bpop_wprice;
            allDetails.nobids = data.bpop_bidcount;
            allDetails.incrementamt = data.bpop_increment;
            allDetails.bid_or_not = 1;
            allDetails.date_closed = date_closed;
            allDetails.maxbidamt = data.bpop_nextbid_org;
            allDetails.bid_count = data.bpop_bidcount;
            allDetails.bids = data.bpop_bidcount;
            setViewProduct(allDetails);
            setCurrentPrice(allDetails.current_bid);
          }
        }
      }
    } else if (type === "watchlistAdded") {
      product = {
        ...productToChange,
        watchlistid: data.status === "added" ? 1 : 0,
      };
      setViewProduct(product);
    }
  }
};
