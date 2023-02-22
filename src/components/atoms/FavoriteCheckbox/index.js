import React, { useState, useContext, useEffect } from "react";
import ProductContext from "../../../context/product/productContext";
import AuthContext from "../../../context/auth/authContext";
import AlertContext from "../../../context/alert/alertContext";
import { useHistory, useLocation } from "react-router";
import { colors } from "@material-ui/core";

const FavoriteCheckbox = ({
  watchlisted,
  project_id,
  fill,
  withLabel,
  updateData,
}) => {
  const history = useHistory();
  const { addWatchlist, removeWatchlist, searchAllLots } =
    useContext(ProductContext);
  const { setAlert } = useContext(AlertContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (watchlisted !== undefined) {
      setChecked(parseInt(watchlisted) === 0 ? false : true);
    }
    return () => {
      setChecked(false);
    };
  }, [project_id, watchlisted]);

  const toggleFavourite = async () => {
    if (checked) {
      let removeWatch = await removeWatchlist({
        user_id: user && user.id ? user.id : "",
        project_id: project_id,
      });
      if (removeWatch) {
        setAlert("Removed from watchlist successfully", "success");
        updateData();
        setChecked(false);
      }
    } else {
      let addWatch = await addWatchlist({
        user_id: user && user.id ? user.id : "",
        project_id: project_id,
      });
      if (addWatch) {
        setAlert("Added to watchlist successfully", "success");
        updateData();
        setChecked(true);
      }
    }
  };

  const handleRedirect = () => {
    history.push("/login");
  };

  return (
    <>
      {watchlisted !== undefined ? (
        <div
          className={`${
            withLabel && "withLabel"
          } favoriteCheck d-flex justify-content-center align-items-center`}
        >
          <input
            id={project_id}
            type="checkbox"
            hidden
            checked={checked}
            onChange={() =>
              isAuthenticated ? toggleFavourite() : handleRedirect()
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          {checked ? (
            <label htmlFor={project_id}>
              {withLabel && "Added to watchlist"}
              <span className="material-icons">favorite</span>
            </label>
          ) : (
            <label htmlFor={project_id}>
              {fill ? (
                <>
                  {withLabel && "Add to watchlist"}
                  <span className="material-icons ntChckd">favorite</span>
                </>
              ) : (
                <>
                  {withLabel && "Add to watchlist"}
                  <span className="material-icons">favorite_border</span>
                </>
              )}
            </label>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default FavoriteCheckbox;
