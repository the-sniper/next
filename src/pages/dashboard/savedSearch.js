import React, { useState, useEffect, useContext } from "react";
import { Button, Drawer } from "@material-ui/core";
import DashboardLayout from "@/components/templates/DashboardLayout";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import UserContext from "@/context/user/userContext";
import AuthContext from "@/context/auth/authContext";
import { handleRedirectInternal } from "@/common/components";
import moment from "moment";
import NoRecordsFound from "@/components/atoms/NoRecordsFound";
import { useRouter } from "next/router";

function SavedSearch() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { getSavedSearch, removeSavedSearch } = useContext(UserContext);
  const router = useRouter();

  const [viewSavedSearch, setViewSavedSearch] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      getAllSavedSearch();
    }
  }, [user]);

  const getAllSavedSearch = async () => {
    const allSavedSearch = await getSavedSearch({ user_id: user.id });
    if (allSavedSearch) {
      setViewSavedSearch(allSavedSearch);
    }
  };

  const handleDeleteSearch = async (searchId) => {
    const success = await removeSavedSearch({ user_id: user.id, id: searchId });
    if (success) {
      getAllSavedSearch();
    }
  };

  const handleOpenSearch = (searchIndex) => {
    router.push(viewSavedSearch[searchIndex].url);
  };

  return (
    <DashboardLayout title="Saved Searches">
      <div className="mySavedSearches">
        <h5 className="dashSubtitle">
          You can find all your saved searches here.
          <br />
          Saved search helps you find your preferred products easily.{" "}
        </h5>
        {viewSavedSearch?.length > 0 ? (
          <div className="table-responsive aiTable">
            <table className="table text-left">
              <thead>
                <tr>
                  <th scope="col">S no</th>
                  <th scope="col">Title</th>
                  <th scope="col">Date added</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {viewSavedSearch?.length > 0 &&
                  viewSavedSearch.map((data, index) => (
                    <tr key={`saved_${index}`}>
                      <td>{index + 1}</td>
                      <td>{data.title}</td>
                      <td>
                        {moment.utc(data.date_added).local().format("LL LT")}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center ssActBtn">
                          <Button onClick={() => handleOpenSearch(index)}>
                            <span className="material-icons">open_in_new</span>
                          </Button>
                          <Button onClick={() => handleDeleteSearch(data.id)}>
                            <span className="material-icons">delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoRecordsFound />
        )}

        {/* <div className="dashActBtn">
          <PrimaryButton label="Save" type="submit" />
        </div> */}
      </div>
    </DashboardLayout>
  );
}

export default SavedSearch;
