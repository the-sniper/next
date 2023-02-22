import React from "react";
import { Button } from "@material-ui/core";

function SavedCard({
  index,
  name,
  lastFourDigits,
  expiry,
  isSelected,
  onClick,
  handleCardRemoval,
}) {
  return (
    <Button className="savedCard" onClick={onClick}>
      <span className={`material-icons selectIcon`}>
        {isSelected ? "radio_button_checked" : "radio_button_unchecked"}
      </span>
      <div>
        <h3>{name}</h3>
        <h4>**** **** **** {lastFourDigits}</h4>
        <h4>{expiry}</h4>
      </div>
      <Button onClick={handleCardRemoval} className="removeSS">
        <span className="material-icons">cancel</span>
      </Button>
    </Button>
  );
}

export default SavedCard;
