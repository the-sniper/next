import React from "react";
import { Button } from "@material-ui/core";
import PrimaryButton from "../../atoms/PrimaryButton";
import SecondaryButton from "../../atoms/SecondaryButton";

function AddressCard({
  type,
  name,
  addressLine1,
  addressLine2,
  city,
  state,
  country,
  zipcode,
  isDefault,
  isSelected,
  onClick,
  phone,
  handleEditAddress,
  handleSetDefaultAddress,
  handleShippingAddressRemoval,
}) {
  return (
    <>
      {type === "new" ? (
        <Button className="addressCard new" onClick={onClick}>
          <img src="/assets/svg/mailbox.svg" alt="New address" />
          <h5>Add a new address</h5>
        </Button>
      ) : (
        <Button className="addressCard" onClick={onClick}>
          <span
            className={`material-icons selectIcon ${isSelected && "checked"}`}
          >
            check_circle
          </span>
          <h3>{name}</h3>
          <h4>{addressLine1}</h4>
          <h4>{addressLine2}</h4>
          <h4>{phone}</h4>
          <h4>{`${city}, ${state} ${zipcode}`}</h4>
          <h4>{country}</h4>
          {isDefault === 1 ? (
            ""
          ) : (
            <span className="mt-2">
              <SecondaryButton
                btnSize="small"
                label="Make Default"
                onClick={handleSetDefaultAddress}
              />
            </span>
          )}
          <div className="mt-2 ml-auto addressActions">
            <Button onClick={handleShippingAddressRemoval}>
              <span className="material-icons">delete</span>{" "}
            </Button>
            <Button onClick={handleEditAddress}>
              <span className="material-icons">edit</span>{" "}
            </Button>
          </div>
        </Button>
      )}
    </>
  );
}

export default AddressCard;
